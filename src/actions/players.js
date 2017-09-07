import { initWrtc } from './wrtc'

/**
 * Action types
 */
export const PLAYER_HAS_CONNECTED = 'PLAYER_HAS_CONNECTED'
export const PLAYER_HAS_CHANGED_STATE = 'PLAYER_HAS_CHANGED_STATE'
export const PLAYER_HAS_LEFT = 'PLAYER_HAS_LEFT'

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

// Thunk action creator
export const initPlayers = (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch(initWrtc())
            .then((wrtc) => {
                wrtc.getPeers().map(checkStatus.bind(null, getState, dispatch))
                wrtc.on('createdPeer', checkStatus.bind(null, getState, dispatch))
                resolve(wrtc)
            })
            .catch((response) => {
                reject('Failed to load players: ' + response)
            }) 
    })
}

const checkStatus = (getState, dispatch, peer) => {
    broadcastStatus(getState, dispatch, peer)
    peer.pc.on('iceConnectionStateChange', (e) => {
        broadcastStatus(getState, dispatch, peer)
    })
}

const broadcastStatus = (getState, dispatch, peer) => {
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
            return true
            break
        default:
            return false
            break
    }
}

