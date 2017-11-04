import { listenPlayers, messagePlayers } from './players'
import {
    SELF_INITIATOR,
    REMOTE_INITIATOR
} from './lobby'
import TetrisEngine from 'tetris-engine/src/engine.es6'

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
export const gameStarted = (engine, playerId) => {
    return {
        type: GAME_STARTED,
        engine,
        playerId
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
    playerId,
    initiator = playerId ? REMOTE_INITIATOR : SELF_INITIATOR
) => {
    console.log('create action')
    return {
        type, 
        data,
        playerId,
        initiator
    }
}

/**
 * Thunk actions
 */
export const changeGameData = (type, data, playerId = undefined) => (dispatch, getState) => {
    console.log('broadcast data change')
    dispatch(gameDataChanged(
        type,
        data,
        playerId
    ))
    if (!playerId) {
        dispatch(messagePlayers(type, { data }))
    }
}

export const listenChangeGameData = (type) => (dispatch, getState) => {
    dispatch(listenPlayers(type, (peer, { payload, type }) => {
        dispatch(changeGameData(
            type,
            payload.data,
            peer.id
        ))
    }))
}

/**
 * Bind all engine actions to state
 * and keyboard events to engine
 */
const bindEngineToState = (dispatch, getState, engine) => {
    engine.start()
    console.log('started local engine')

    /**
     * Synchronizing engine state with Redux state
     *
     * These state change checks should be done in the engine
     * this is inefficient
     */
    engine.hook.before((engine) => {
        const state = getState(),
              game = state.room.roomGames.self, // Old game state
              field = engine.field()

        if (field != game.field) {
            dispatch(changeGameData(GAME_FIELD_UPDATED, field))
        }
    })
}

const bindRemoteEnginesToState = (dispatch, getState) => {
    dispatch(listenChangeGameData(GAME_FIELD_UPDATED));
}

const startGames = (dispatch, getState) => {
    const state = getState(),
          games = state.room.roomGames,
          remoteGames = games.remote

    // Start remotes
    bindRemoteEnginesToState(dispatch, getState)
    Object.keys(remoteGames).map((playerId) => {
        dispatch(gameStarted(playerId))
    })

    // Bind self
    const engine = new TetrisEngine()
    dispatch(gameStarted())
    bindEngineToState(dispatch, getState, engine)
}

export const startRoom = (dispatch, getState) => {
    const state = getState(),
          roomInitiator = state.room.roomInitiator

    console.log('starting')
    if (roomInitiator === SELF_INITIATOR) {
        dispatch(waitForPlayers)
    } else {
        dispatch(listenStartGames)
    }
}

export const listenStartGames = (dispatch, getState) => {
    console.log('listening game start')
    dispatch(listenPlayers(GAME_STARTED, (peer, { payload, type }) => {
        // I could write a check here to see if game host initiated start
        dispatch(startGames)
    }))
}

const waitForPlayers = (dispatch, getState) => {
    /**
     * Timeout handler
     */
    const timeoutId = setTimeout(() => {
        clearInterval(checkerId)
        alert('Wait timed out' + getState().config.timeout)
    }, getState().config.timeout)

    /**
     * Player arrival handler
     */
    const checkerId = setInterval(() => {
        const state = getState(),
            players = state.players,
            games = state.room.roomGames,
            remoteGames = games.remote,
            playersReady = Object.keys(remoteGames).length == players.filter(player => player.loaded).length

            console.log(players, games, remoteGames, playersReady)

        if (playersReady) {
            console.log('players are ready, starting')
            dispatch(messagePlayers(GAME_STARTED))
            dispatch(startGames)

            clearInterval(checkerId);
            clearTimeout(timeoutId);
        }
    }, 100)
}