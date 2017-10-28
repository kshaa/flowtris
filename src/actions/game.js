import { listenPlayers, messagePlayers } from './players'
import {
    SELF_INITIATOR,
    REMOTE_INITIATOR
} from './lobby'

/**
 * Action types
 */
export const GAME_STARTED       = 'GAME_STARTED'
export const GAME_STOPPED       = 'GAME_STOPPED'
export const GAME_PIECE_UPDATED = 'GAME_PIECE_UPDATED'
export const GAME_FIELD_UPDATED = 'GAME_FIELD_UPDATED' 
export const GAME_LINE_ADDED    = 'GAME_LINE_ADDED'    // No. - above which grid line will be added
export const GAME_LINE_DROPPED  = 'GAME_LINE_DROPPED'  // No. - which field line will be deleted

/**
 * Actions
 */
export const gameStarted = (id) => {
    return {
        type: GAME_STARTED,
        id
    }
}

export const gameStopped = (id) => {
    return {
        type: GAME_STOPPED,
        id
    }
}

/**
 * Add/Drop line,
 * Update whole field,
 * Update falling piece
 */
export const gameDataChanged = (
    type,
    data,
    player,
    initiator = player ? REMOTE_INITIATOR : SELF_INITIATOR
) => {
    return {
        type, 
        data,
        initiator,
        player
    }
}

/**
 * Thunk actions
 */
const startGames = (dispatch, getState) => {
    /**
     * I don't want to subscribe to wrtc and check players there,
     * because that would mean duplicating 'players' code, which is wrong,
     * and I shouldn't listen to actions, because that's an anti-pattern.
     * Maybe I should create a subscription system for players, but that's
     * the same thing, so I'll just hackily add a timer, and call it a day :D
     * @type {number}
     */
    const checkerId = setTimeout(() => {
        const state = getState(),
              players = state.players,
              games = state.room.roomGames,
              remoteGames = games.remote,
              selfGame = games.self

        if (players.length == Object.keys(remoteGames).length) {
            Object.keys(remoteGames).map((id) => {
                dispatch(gameStarted(id))

                /**
                 * Initiate tetris engine and subscribe to it
                 * and give it access to keyboard or pass clicks
                 * manually here
                 */
            })
            console.log('started engine, puuuis')
        }
    })
}

export const startRoom = (dispatch, getState) => {
    const state = getState(),
          roomInitiator = state.room.roomInitiator

    if (roomInitiator === SELF_INITIATOR) {
        dispatch(messagePlayers(GAME_STARTED))
        dispatch(startGames)
    } else {
        dispatch(listenStartGames)
    }
}

export const changeGameData = (type, data) => (dispatch, getState) => {
    dispatch(gameDataChanged(
        type,
        data
    ))
    dispatch(messagePlayers(type, {
        [type]: data
    }))
}
export const listenStartGames = (dispatch, getState) => {
    console.log('listening game start')
    dispatch(listenPlayers(GAME_STARTED, (peer, { payload, type }) => {
        // I could write a check here to see if game host initiated start
        dispatch(startGames)
    }))
}

export const listenChangeGameData = (type) => (dispatch, getState) => {
    console.log('listening game changes')
    dispatch(listenPlayers(type, (peer, { payload, type }) => {
        const state = getState(),
              player = state.players.find((player) => player.id == peer.id).peer

        console.log('got call, starting engine, puiiis')
        dispatch(gameDataChanged(
            type,
            payload.type,
            player
        ))
    }))
}
