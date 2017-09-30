import { listenPlayers, messagePlayers } from './players'

/**
 * Action types
 */

// Local'ish
export const LOBBY_SENT_INVITE = 'LOBBY_SENT_INVITE'
export const LOBBY_ABORTED_INVITE = 'LOBBY_ABORTED_INVITE'
export const LOBBY_ACCEPTED_INVITE = 'LOBBY_ACCEPTED_INVITE'
export const LOBBY_DECLINED_INVITE = 'LOBBY_DECLINED_INVITE'

// Remote'ish
export const LOBBY_RECEIVED_INVITE = 'LOBBY_RECEIVED_INVITE'
export const LOBBY_LOST_INVITE = 'LOBBY_LOST_INVITE'

/**
 * Message types
 */
export const GAME_INVITE = 'GAME_INVITE'
export const GAME_INVITE_ABORT = 'GAME_INVITE_ABORT'
export const GAME_ACCEPT = 'GAME_ACCEPT'
export const GAME_DENY = 'GAME_DENY'

/**
 * Initiator const
 */
export const SELF_INITIATOR = 'SELF_INITIATOR'
export const REMOTE_INITIATOR = 'REMOTE_INITIATOR'
export const NO_INITIATOR = 'NO_INITIATOR'

/**
 * Action creators
 */
export const sentInvite = (player) => {
    return {
        type: LOBBY_SENT_INVITE,
        initiator: SELF_INITIATOR,
        player
    }
}

export const abortedInvite = () => {
    return {
        type: LOBBY_ABORTED_INVITE,
        initiator: NO_INITIATOR
    }
}

export const receivedInvite = (player) => {
    return {
        type: LOBBY_RECEIVED_INVITE,
        initiator: REMOTE_INITIATOR,
        player
    }
}

export const lostInvite = () => {
    return {
        type: LOBBY_LOST_INVITE,
        initiator: NO_INITIATOR
    }
}

export const acceptedInvite = (player) => {
    return {
        type: LOBBY_ACCEPT,
        player
    }
}

export const deniedInvite = (player) => {
    return {
        type: LOBBY_DENY,
        player
    }
}

/**
 * Thunk action creators
 */
export const sendInvite = (recipient) => (dispatch, getState) => {
    dispatch(messagePlayers(GAME_INVITE, {
        recipientId: recipient.id,
    }))
    dispatch(sentInvite(recipient))
}

export const listenInvite = (dispatch, getState) => {
    console.log('listening')
    dispatch(listenPlayers(GAME_INVITE, (peer, { payload, type }) => {
        const state = getState(),
              recipientId = payload.recipientId,
              selfId = state.wrtc.wrtcInstance.connection.connection.id, 
              host = state.players.find((player) => player.id == peer.id).peer

              console.log('maybe got invite', recipientId, selfId, host)
        if (recipientId == selfId) {
              console.log('totes got invite', recipientId, selfId, host)
            dispatch(receivedInvite(host))
        }
    }))
}

export const abortInvite = (host, recipient) => (dispatch, getState) => {
    const hostId = getState().wrtc.wrtcInstance.id
    dispatch(messagePlayers(GAME_INVITE_ABORT, {
        recipientId: recipient.id,
        hostId 
    }))
    dispatch(abortedInvite(recipient))
}

export const listenAbortInvite = (dispatch, getState) => {
    dispatch(listenPlayers(GAME_INVITE, (peer, info) => {
        const payload = info.payload,
              hostId = payload.hostId,
              players = getState().players,
              host = players.find((player) => player.id == hostId)

        dispatch(lostInvite(host))
    }))
}

export const acceptInvite = (player) => (dispatch, getState) => {
    dispatch(acceptedInvite(player))
}

export const denyInvite = (player) => (dispatch, getState) => {
    dispatch(deniedInvite(player))
}
