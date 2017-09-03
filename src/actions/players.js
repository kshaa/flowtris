import { wrtcInit } from './wrtc'

/**
 * Action types
 */
export const PLAYER_HAS_CONNECTED = 'PLAYER_HAS_CONNECTED'
export const PLAYER_HAS_LOADED = 'PLAYER_HAS_LOADED'
export const PLAYER_HAS_LEFT = 'PLAYER_HAS_LEFT'

/**
 * Action creators
 */
export const playerHasConnected = (peer) => {
    return {
        type: PLAYER_HAS_CONNECTED,
        peer
    }
}

export const playerHasLoaded = (peer) => {
    return {
        type: PLAYER_HAS_LOADED,
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
export const playersInit = (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        const state = getState()
        const players = state.players.playersList
        
        dispatch(wrtcInit())
            .then((wrtc) => {
                wrtc.getPeers().map(handlePeer.bind(null, dispatch))
                wrtc.on('createdPeer', handlePeer.bind(null, dispatch))
                resolve(wrtc)
            })
            .catch((response) => {
                reject('Failed to load players: ' + response)
            }) 
    })
}

const handlePeer = (dispatch, peer) => {
    dispatch(playerHasConnected(peer))
    handlePeerState(dispatch, peer) // In case peer has already loaded
    peer.pc.on('iceConnectionStateChange', (e) => {
        handlePeerState(dispatch, peer)
    })
}

const handlePeerState = (dispatch, peer) => {
    switch (peer.pc.iceConnectionState) {
        case 'connected':
            dispatch(playerHasLoaded(peer))
            break
        case 'closed':
            dispatch(playerHasLeft(peer))
            break
    }
}
