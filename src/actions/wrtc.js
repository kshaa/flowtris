import SimpleWebRTC from 'simplewebrtc'

/**
 * Action types
 */
export const WRTC_HAS_ERRORED = 'WRTC_HAS_ERRORED'
export const WRTC_IS_LOADING = 'WRTC_IS_LOADING'
export const WRTC_CONNECT_SUCCESS = 'WRTC_CONNECT_SUCCESS'

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

export const wrtcConnectSuccess = (wrtc) => {
    return {
        type: WRTC_CONNECT_SUCCESS,
        wrtc
    }
}

// Thunk action creator
export const initWrtc = (nick, room) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const state = getState()
        const wrtc = state.wrtc.wrtcInstance
        const config = state.config

        if (Object.keys(wrtc).length === 0) {
            dispatch(wrtcIsLoading(true))

            wrtcConnect(config, nick, room)
                .then((wrtc) => {
                    dispatch(wrtcIsLoading(false))
                    dispatch(wrtcConnectSuccess(wrtc))
                    resolve(wrtc)
                })
                .catch((response) => {
                    dispatch(wrtcIsLoading(false))
                    dispatch(wrtcHasErrored(true))
                    reject(response)
                })
        } else {
            resolve(wrtc)
        }
    })
}

// Helper function for wrtcInit
const wrtcConnect = (config, nick = config.nick, room = config.room) => {
    return new Promise((resolve, reject) => {
        const wrtc = new SimpleWebRTC({ nick })

        // Set connection timeout
        const timeoutId = setTimeout(() => {
            reject('WebRTC connection timed out after ' + config.timeout + 'ms.')
        }, config.timeout)

        // Join room on working connection
        wrtc.on('connectionReady', () => {
            wrtc.joinRoom(room, (error, room) => {
                clearTimeout(timeoutId)
                resolve(wrtc)
            })
        })

    })
}
