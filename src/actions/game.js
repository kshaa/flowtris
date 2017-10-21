import { listenPlayers, messagePlayers } from './players'
import { browserHistory } from 'react-router'
import { room as gameRoomLabel } from '../components/RoomPage'
import {
    SELF_INITIATOR,
    REMOTE_INITATOR
} from './lobby'

/**
 * Action types
 */

export const GAME_DROPPED_LINE = 'GAME_DROPPED_LINE'
export const GAME_CHANGED_FIELD = 'GAME_CHANGED_FIELD'
export const GAME_STARTED = 'GAME_STARTED'

/**
 * Action creators
 */
export const droppedLine = (lineNumber, initiator, player) => {
    return {
        type: GAME_DROPPED_LINE,
        lineNumber,
        initiator,
        player
    }
}

export const changedField = (field, initiator, player) => {
    return {
        type: GAME_CHANGED_FIELD, 
        field,
        initiator,
        player
    }
}

export const gameStarted = {
    type: GAME_STARTED
}

/**
 * Thunk action creators
 */
export const initGame = () => (dispatch, getState) => {
    const state = getState(),
          roomInitiator = state.room.roomInitiator

    if (roomInitiator === SELF_INITIATOR) {
        dispatch(messagePlayers(GAME_STARTED))
        dispatch(gameStarted)
    }
}

export const sendChangedField = (field) => (dispatch, getState) => {
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
    const recipient = getState().room.roomBuddy
    console.log(recipient) 
    dispatch(messagePlayers(GAME_INVITE_ABORT, {
        recipientId: recipient.id
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
    const recipient = getState().room.roomBuddy,
          host = getState().wrtc.wrtcInstance.connection.connection
    dispatch(messagePlayers(GAME_ACCEPT, {
        recipientId: recipient.id,
    }))
    dispatch(acceptedInvite(recipient))
    // Send acceptance, wait and go to room
    // this seems like a hacky fix
    setTimeout(() => {
        dispatch(startGame(host.id))
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
             dispatch(startGame(host.id))
        }
    }))
}

export const declineInvite = (dispatch, getState) => {
    const recipient = getState().room.roomBuddy
        console.log(recipient)
    dispatch(messagePlayers(GAME_DECLINE, {
        recipientId: recipient.id,
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
