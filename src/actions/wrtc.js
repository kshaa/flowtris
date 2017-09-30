import SimpleWebRTC from 'simplewebrtc'

/**
 * Action types
 */
export const WRTC_HAS_ERRORED = 'WRTC_HAS_ERRORED'
export const WRTC_IS_LOADING = 'WRTC_IS_LOADING'
export const WRTC_CONNECT_FINISHED = 'WRTC_CONNECT_FINISHED'
export const WRTC_SUBSCRIBE = 'WRTC_SUBSCRIBE'

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

// Thunk action creator
export const initWrtc = (room, nick) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const state = getState()
        const config = state.config
        const wrtc = state.wrtc

        if (wrtc.wrtcHasFinished || wrtc.wrtcIsLoading) {
            wrtc.wrtcInstance
                .then((payload) => {
                    resolve(payload)
                })
                .catch((payload) => {
                    reject(payload)
                })
        } else {
            dispatch(wrtcIsLoading(true))
            dispatch(wrtcConnectFinished(false, wrtc))

            wrtcConnect(config, nick, room)
                .then((instance) => {
                    wrtc.wrtcSubscribers.map((subscriber) => {
                        subscriber.resolve(instance)
                    })
                    dispatch(wrtcIsLoading(false))
                    dispatch(wrtcConnectFinished(true, instance))
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
    return new Promise((resolve, reject) => {
        const state = getState()
        const config = state.config
        const wrtc = state.wrtc

        if (wrtc.wrtcHasFinished || wrtc.wrtcIsLoading) {
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

const wrtcConnect = (config, nick = config.nick, room) => {
    return new Promise((resolve, reject) => {
        const wrtc = new SimpleWebRTC({
            debug: false,
            nick
        })

        // Set connection timeout
        const timeout = setTimeout(() => {
            reject('WebRTC connection timed out after ' + config.timeout + 'ms.')
        }, config.timeout)

        // Join room on working connection
        wrtc.on('connectionReady', () => {
            wrtc.joinRoom(room, (error, room) => {
                clearTimeout(timeout)
                resolve(wrtc)
            })
        })
    })
}
