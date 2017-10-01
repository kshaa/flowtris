import SimpleWebRTC from 'simplewebrtc'

/**
 * Action types
 */
export const WRTC_HAS_ERRORED = 'WRTC_HAS_ERRORED'
export const WRTC_IS_LOADING = 'WRTC_IS_LOADING'
export const WRTC_CONNECT_FINISHED = 'WRTC_CONNECT_FINISHED'
export const WRTC_SUBSCRIBE = 'WRTC_SUBSCRIBE'
export const WRTC_SUBSCRIBE_FLUSH = 'WRTC_SUBSCRIBE_FLUSH'
export const WRTC_JOIN_ROOM = 'WRTC_JOIN_ROOM'
export const WRTC_LEAVE_ROOM = 'WRTC_LEAVE_ROOM'

/**
 * Action creators
 */
export const wrtcHasErrored = (bool) => {
    return {
        type: WRTC_HAS_ERRORED,
        hasErrored: bool
    }
}

export const wrtcIsLoading = (bool) => {
    return {
        type: WRTC_IS_LOADING,
        isLoading: bool
    }
}

export const wrtcConnectFinished = (bool, wrtc = {}) => {
    return {
        type: WRTC_CONNECT_FINISHED,
        isFinished: bool,
        wrtc
    }
}

export const wrtcSubscribe = (promise, resolve, reject) => {
    return {
        type: WRTC_SUBSCRIBE,
        promise,
        resolve,
        reject
    }
}

export const wrtcSubscribersFlush = {
    type: WRTC_SUBSCRIBE_FLUSH
}

export const wrtcJoinRoom = (room) => {
    return {
        type: WRTC_JOIN_ROOM,
        room
    }
}

export const wrtcLeaveRoom = {
    type: WRTC_LEAVE_ROOM
}

// Thunk action creator
export const initWrtc = (room, nick) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const state = getState()
        const config = state.config
        const wrtc = state.wrtc
        
        console.log('gonna do smth', wrtc)
        if (wrtc.wrtcHasFinished || wrtc.wrtcIsLoading) {
            // Reload
            console.log('reloading wrtc')
            Promise.resolve(wrtc.wrtcInstance)
                .then((payload) => {
                    if (wrtc.currentRoom !== room) {
                        console.log(room)
                        dispatch(switchRoomWrtc(room))
                    }
                    console.log(payload)
                    resolve(payload)
                })
                .catch((payload) => {
                    reject(payload)
                })
        } else {
            // Connect
            console.log('check')
            dispatch(wrtcIsLoading(true))
            dispatch(wrtcConnectFinished(false, {}))

            console.log('connecting to wrtc')
            wrtcConnect(config, nick, room)
                .then((instance) => {
                    // Time has passed,
                    // update wrtc subscribers
                    const wrtc = getState().wrtc
                    console.log(instance)
                    console.log(wrtc.wrtcSubscribers)
                    wrtc.wrtcSubscribers.map((subscriber) => {
                        subscriber.resolve(instance)
                    })
                    dispatch(wrtcJoinRoom(room))
                    console.log('check')
                    dispatch(wrtcSubscribersFlush)
                    console.log('check')
                    dispatch(wrtcIsLoading(false))
                    console.log('check')
                    dispatch(wrtcConnectFinished(true, instance))
                    console.log('check')
                    resolve(instance)
                })
                .catch((response) => {
                    wrtc.wrtcSubscribers.map((subscriber) => {
                        subscriber.reject(response)
                    })
                    dispatch(wrtcIsLoading(false))
                    dispatch(wrtcHasErrored(true))
                    dispatch(wrtcConnectFinished(true, wrtc))
                    reject(response)
                })
        }
    })
}

export const subscribeWrtc = () => (dispatch, getState) => {
    console.log('subscribering')
    return new Promise((resolve, reject) => {
        const state = getState()
        const config = state.config
        const wrtc = state.wrtc

        if (wrtc.wrtcHasFinished) {
            console.log(wrtc.wrtcInstance)
            Promise.resolve(wrtc.wrtcInstance)
                .then((payload) => {
                    resolve(payload)
                })
                .catch((payload) => {
                    reject(payload)
                })
        } else {
            dispatch(wrtcSubscribe(this, resolve, reject))
        }
    })
}

export const switchRoomWrtc = (room) => (dispatch, getState) => {
    const state = getState(),
          wrtc = state.wrtc

    dispatch(leaveRoomWrtc)
    dispatch(joinRoomWrtc(room))
}

export const leaveRoomWrtc = (dispatch, getState) => {
    const state = getState(),
          wrtc = state.wrtc

    wrtc.wrtcInstance.leaveRoom()
    dispatch(wrtcLeaveRoom)
}

export const joinRoomWrtc = (room) => (dispatch, getState) => {
    const state = getState(),
          wrtc = state.wrtc

    wrtc.wrtcInstance.joinRoom(room)
    dispatch(wrtcJoinRoom(room))
}

const wrtcConnect = (config, nick = config.nick, room) => {
    return new Promise((resolve, reject) => {
        // If there's an old instance
        // this should really wipe the old one
        const wrtcInstance = new SimpleWebRTC({
            debug: false,
            nick
        })

        // Set connection timeout
        const timeout = setTimeout(() => {
            reject('WebRTC connection timed out after ' + config.timeout + 'ms.')
        }, config.timeout)

        console.log(wrtcInstance)
        // Join room on working connection
        if (wrtcInstance.connection.connection.io.readyState == 'open') {
            console.log('connection is ready, joining room ' + room)
            wrtcInstance.joinRoom(room, (error, room) => {
                console.log('room joined')
                clearTimeout(timeout)
                resolve(wrtcInstance)
            })
        } else {
            wrtcInstance.on('connectionReady', () => {
                console.log('connection is ready, joining room ' + room)
                wrtcInstance.joinRoom(room, (error, room) => {
                    console.log('room joined')
                    clearTimeout(timeout)
                    resolve(wrtcInstance)
                })
            })
        }
    })
}
