import SimpleWebRTC from 'simplewebrtc'

export const wrtcHasErrored = (bool) => {
    return {
        type: 'WRTC_HAS_ERRORED',
        hasErrored: bool
    }
}

export const wrtcIsLoading = (bool) => {
    return {
        type: 'WRTC_IS_LOADING',
        isLoading: bool
    }
}

export const wrtcSuccess = (wrtc) => {
    return {
        type: 'WRTC_SUCCESS',
        wrtc
    }
}

export const wrtcInit = (nick, channel) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const state = getState()
        const wrtc = state.wrtc
        const config = state.config

        if (Object.keys(wrtc).length === 0) {
            dispatch(wrtcIsLoading(true))

            wrtcConnect(config, nick, channel)
                .then((wrtc) => {
                    dispatch(wrtcIsLoading(false))
                    dispatch(wrtcConnectSuccess(peer))
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

const wrtcConnect = (config, nick = config.nick, channel) => {
    return new Promise((resolve, reject) => {
        const wrtc = new SimpleWebRTC({ nick })
       
        wrtc.on('connectionReady', () => {
            wrtc.joinRoom(config.room, (error, room) => {
                peer.on('channelMessage', (sender, channel, data) => {
                    if (data.type === 'ping') {
                        // Scream back
                        console.log('pong\'d', sender.nick);
                        peer.sendDirectlyToAll(channel, 'pong', true)
                    } else if (data.type === 'pong') {
                        // Stop screaming and be happy
                        clearInterval(screamer)
                        resolve(peer)
                    } else {
                        console.log(data)
                    }
                })
                peer.on('createdPeer', (newpeer) => {
                    newpeer.pc.on('iceConnectionStateChange', (e) => {
                        console.log('Nick: ', newpeer.nick, e)
                    })
                    newpeer.pc.on('answer', () => {
                        console.log('answer gotten / ', peer.nick)
                    })
                    peer.sendDirectlyToAll(channel, 'tada', true)
                    console.log('sent tada', newpeer.nick);
                })
            })
        }) 
    })
}
