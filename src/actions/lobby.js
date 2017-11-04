import { listenPlayers, messagePlayers } from './players'
import { browserHistory } from 'react-router'
import { room as gameRoomLabel } from '../components/RoomPage'

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
export const GAME_DECLINE = 'GAME_DECLINE'

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

export const acceptedInvite = () => {
    return {
        type: LOBBY_ACCEPTED_INVITE,
        initiator: REMOTE_INITIATOR
    }
}

export const declinedInvite = () => {
    return {
        type: LOBBY_DECLINED_INVITE,
        initiator: NO_INITIATOR
    }
}

/**
 * Thunk action creators
 */
export const redirectGame = (room) => (dispatch, getState) => {
    browserHistory.push('/' + gameRoomLabel + '/' + room)
}

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

export const abortInvite = (dispatch, getState) => {
    const recipientId = Object.keys(getState().room.roomGames.remote)[0]
    dispatch(messagePlayers(GAME_INVITE_ABORT, {
        recipientId
    }))
    dispatch(abortedInvite())
}

export const listenAbortInvite = (dispatch, getState) => {
    console.log('listening')
    dispatch(listenPlayers(GAME_INVITE_ABORT, (peer, { payload, type }) => {
        console.log('shit, he aborted')
        const state = getState(),
              recipientId = payload.recipientId,
              selfId = state.wrtc.wrtcInstance.connection.connection.id, 
              host = state.players.find((player) => player.id == peer.id).peer

        if (recipientId == selfId) {
            dispatch(lostInvite())
        }
    }))
}

export const acceptInvite = (dispatch, getState) => {
    const recipientId = Object.keys(getState().room.roomGames.remote)[0],
          host = getState().wrtc.wrtcInstance.connection.connection
    dispatch(acceptedInvite())
    dispatch(messagePlayers(GAME_ACCEPT, {
        recipientId
    }))
    // Send acceptance, wait and go to room
    // this seems like a hacky fix
    setTimeout(() => {
        dispatch(redirectGame(host.id))
    }, 100)
}

export const listenAcceptInvite = (dispatch, getState) => {
    dispatch(listenPlayers(GAME_ACCEPT, (peer, { payload, type }) => {
        const state = getState(),
              recipientId = payload.recipientId,
              selfId = state.wrtc.wrtcInstance.connection.connection.id, 
              host = state.players.find((player) => player.id == peer.id).peer

        if (recipientId == selfId) {
             console.log('parties agreed')
             dispatch(redirectGame(host.id))
        }
    }))
}

export const declineInvite = (dispatch, getState) => {
    const recipientId = Object.keys(getState().room.roomGames.remote)[0]
    dispatch(messagePlayers(GAME_DECLINE, {
        recipientId
    }))
    dispatch(declinedInvite())
}

export const listenDeclineInvite = (dispatch, getState) => {
    dispatch(listenPlayers(GAME_DECLINE, (peer, { payload, type }) => {
        const state = getState(),
              recipientId = payload.recipientId,
              selfId = state.wrtc.wrtcInstance.connection.connection.id, 
              host = state.players.find((player) => player.id == peer.id).peer

        if (recipientId == selfId) {
            dispatch(lostInvite())
        }
    }))
}