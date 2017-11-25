import { subscribeWrtc } from './wrtc'

/**
 * Action types
 */
export const PLAYER_HAS_CONNECTED = 'PLAYER_HAS_CONNECTED'
export const PLAYER_HAS_CHANGED_STATE = 'PLAYER_HAS_CHANGED_STATE'
export const PLAYER_HAS_LEFT = 'PLAYER_HAS_LEFT'
export const PLAYER_SENT_MESSAGE = 'PLAYER_SENT_MESSAGE'
export const PLAYER_LISTENING_MESSAGE = 'PLAYER_LISTENING_MESSAGE'
export const PLAYERS_FLUSH = 'PLAYERS_FLUSH'

/**
 * Action creators
 */
export const playerHasConnected = (peer) => {
    return {
        type: PLAYER_HAS_CONNECTED,
        loaded: peerLoaded(peer),
        peer
    }
}

export const playerHasChangedState = (peer) => {
    return {
        type: PLAYER_HAS_CHANGED_STATE,
        loaded: peerLoaded(peer),
        peer
    }
}

export const playerHasLeft = (peer) => {
    return {
        type: PLAYER_HAS_LEFT,
        peer
    }
}

/**
 * Thunk action creators
 */
export const initPlayers = (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch(subscribeWrtc())
            .then((wrtc) => {
                wrtc.getPeers().map(checkStatus.bind(null, getState, dispatch))
                wrtc.on('createdPeer', checkStatus.bind(null, getState, dispatch))
                resolve('Loaded players.')
            })
            .catch((response) => {
                reject('Failed to load players: ' + response)
            }) 
    })
}

export const messagePlayers = (type, payload = {}) => (dispatch, getState) => {
    dispatch(subscribeWrtc())
        .then((wrtc) => {
            wrtc.sendDirectlyToAll('-', type, payload)
        })
}

export const listenPlayers = (type, callback, killPromise) => (dispatch, getState) => {
    dispatch(subscribeWrtc())
        .then((wrtc) => {
            // Generate listener for callback trigger
            let isDead = false // Actual wrtc.off works odd
            const listener = (peer, channelLabel, info) => {
                if (info.type === type && !isDead) {
                    callback(peer, info)
                }
            }

            wrtc.on('channelMessage', listener)

            // If kill promise exists and ever resolves
            // Disable listener
            if (typeof (killPromise) !== 'undefined') {
                Promise.resolve(killPromise)
                    .then(() => {
                        isDead = true
                    })
            }
        })
}

/**
 *  Helpers
 */
const playersFlush = (getState, dispatch) => {
    const state = getState(),
          peers = state.wrtc.wrtcInstance.getPeers()

    if (state.wrtc.wrtcHasFinished) {
        // Instance is up, let's clean up boys    
        state.players.map((player) => {
            if (peers.find(peer => player.id == peer.id) !== undefined) {
                dispatch(playerHasLeft(player.peer))
            }
        })
    } else {
        // Instance is down, remove players
        state.players.map((player) => {
            dispatch(playerHasLeft(player.peer))
        })
    }
}

const checkStatus = (getState, dispatch, peer) => {
    dispatchStatus(getState, dispatch, peer)
    peer.pc.on('iceConnectionStateChange', (e) => {
        dispatchStatus(getState, dispatch, peer)
    })
}

const dispatchStatus = (getState, dispatch, peer) => {
    if (peerLeft(peer)) {
        dispatch(playerHasLeft(peer))
    } else {
        if (peerIsAssigned(getState, peer)) {
            dispatch(playerHasChangedState(peer))
        } else {
            dispatch(playerHasConnected(peer))
        }
    }
}

const peerIsAssigned = (getState, peer) => {
    const state = getState()
    const players = state.players

    return undefined !== players.find((player) => {
        return player.id === peer.id
    })
}

const peerLeft = (peer) => {
    switch (peer.pc.iceConnectionState) {
        case 'closed':
        case 'failed':
            return true
            break
        default:
            return false
            break
    }
}

const peerLoaded = (peer) => {
    switch (peer.pc.iceConnectionState) {
        case 'connected':
        case 'completed':
        case 'checking':
            return true
            break
        default:
            return false
            break
    }
}

