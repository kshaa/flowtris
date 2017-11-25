import { listenPlayers, messagePlayers } from './players'
import {
    SELF_INITIATOR,
    REMOTE_INITIATOR,
    LOBBY_RECEIVED_INVITE,
    LOBBY_SENT_INVITE
} from './lobby'
import TetrisEngine from 'tetris-engine/src/engine.es6'

/**
 * Action types
 */
export const GAME_STARTED               = 'GAME_STARTED'
export const GAME_STOPPED               = 'GAME_STOPPED'
export const GAME_PIECE_UPDATED         = 'GAME_PIECE_UPDATED'
export const GAME_ENGINE_UPDATED        = 'GAME_ENGINE_UPDATED'
export const GAME_FIELD_UPDATED         = 'GAME_FIELD_UPDATED'
export const GAME_LINE_ADDED            = 'GAME_LINE_ADDED'    // No. - above which grid line will be added
export const GAME_LINE_DROPPED          = 'GAME_LINE_DROPPED'  // No. - which field line will be deleted

/**
 *  A horrible promise, which will spaghettify and break everything
 *  Note to self - don't write code when:
 *   1. You're tired
 *   2. You're stressed
 *   3. You're lazy
 *  Aka never write code again
 */
let localGameEndResolvers = []
const gameEndPromise = (dispatch) => {
    return new Promise((resolve) => {
        const lateResolve = () => {
            // On game end, wait a bit (lol, race condition party)
            // And resolve this promise, which will trigger listener disabling
            // * I've written so many anti patterns in this projects, it's not even funny anymore *
            setTimeout(() => {
                resolve()
            }, 100)

            localGameEndResolvers = []
        }

        localGameEndResolvers.push(resolve)
        dispatch(listenPlayers(GAME_STOPPED, lateResolve))
        // These should never be the resolvers, but just in case
        dispatch(listenPlayers(LOBBY_SENT_INVITE, lateResolve))
        dispatch(listenPlayers(LOBBY_RECEIVED_INVITE, lateResolve))
    })
}

/**
 * Actions
 */
export const gameStarted = (
    engine,
    playerId,
    initiator = playerId ? REMOTE_INITIATOR : SELF_INITIATOR
) => {
    return {
        type: GAME_STARTED,
        engine,
        playerId,
        initiator
    }
}

export const gameStopped = (
    info = {},
    playerId,
    initiator = playerId ? REMOTE_INITIATOR : SELF_INITIATOR
) => {
    return {
        type: GAME_STOPPED,
        lost: info.lost,
        won: info.won,
        playerId,
        initiator
    }
}

/**
 * Just for synchronization, logic-less actions
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
    // Generate promise that will trigger at the end of game
    dispatch(listenPlayers(type, (peer, { payload, type }) => {
        dispatch(changeGameData(
            type,
            payload.data,
            peer.id
        ))
    }, gameEndPromise(dispatch)))
}

/**
 * Actions for moving
 */
export const moveLeft = (dispatch) => {
    dispatch(move('left'))
}

export const moveRight = (dispatch) => {
    dispatch(move('right'))
}

export const moveDown = (dispatch) => {
    dispatch(move('down'))
}

export const moveClockwise = (dispatch) => {
    dispatch(move('cw'))
}

export const moveDrop = (dispatch) => {
    dispatch(move('drop'))
}

const move = (direction) => (dispatch, getState) => {
    const state = getState(),
          engine = state.room.roomGames.self.engine

    if (engine.move) {
        engine.move(direction);
    }
}

/**
 * Bind all engine actions to state
 * and keyboard events to engine
 */
const bindEngineToState = (dispatch, getState, engine) => {
    engine.start()

    /**
     * Store engine for easy global move binding from graphical
     * component
     */
    dispatch(changeGameData(GAME_ENGINE_UPDATED, engine))

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

        // Update game field
        // Transform to string, because it's shorter & consise than .every
        if (field.toString() != game.field.toString()) {
            dispatch(changeGameData(GAME_FIELD_UPDATED, field))
        }
    })

    engine.hook.after((engine) => {
        const state = getState(),
            dudeTwoId = Object.keys(state.room.roomGames.remote)[0],
            game = state.room.roomGames.self, // Old game state
            lost = engine.settings().lost

        // End game
        if (lost && !game.lost) {
            // This is kind of wonky, in case I want to later do multi(2+)player
            // Also let's just get done with this
            dispatch(gameStopped({ lost: true }))
            dispatch(gameStopped({ won: true }, dudeTwoId))
            dispatch(messagePlayers(GAME_STOPPED, { lost: true }))

            // Resolve game end to stop listeners
            if (localGameEndResolvers) {
                localGameEndResolvers.map((resolver) => {
                    resolver()
                })

                localGameEndResolvers = []
            }

            // Kill hooks
            if (engine.hook) {
                engine.hook.killHooks()
            }
        }
    })
}

const bindRemoteEnginesToState = (dispatch, getState) => {
    // Update game field
    dispatch(listenChangeGameData(GAME_FIELD_UPDATED));

    // End game
    dispatch(listenPlayers(GAME_STOPPED, (peer, { payload, type }) => {
        if (payload.lost) {
            // Stop own engine
            const state = getState(),
                  game = state.room.roomGames.self

            if (!game.won && !game.lost) {
                game.engine.pause()
                game.engine.hook.killHooks()

                dispatch(gameStopped(
                    { lost: true },
                    peer.id
                ))

                dispatch(gameStopped(
                    { won: true },
                ))
            }
        }
    }, gameEndPromise(dispatch)))
}

const startGames = (engine) => (dispatch, getState) => {
    const state = getState(),
          games = state.room.roomGames,
          remoteGames = games.remote

    engine.spawnTime = performance.now()
    // Listen to remotes
    bindRemoteEnginesToState(dispatch, getState)
    // This could be moved into the bind ^, if we add a start emitter & listener
    Object.keys(remoteGames).map((playerId) => {
        dispatch(gameStarted(playerId))
    })

    // Start and bind your own engine (This is slow, so first start listening remotes ^)
    dispatch(gameStarted(engine))
    bindEngineToState(dispatch, getState, engine)
}

export const startRoom = (dispatch, getState) => {
    const state = getState(),
          roomInitiator = state.room.roomInitiator

    if (roomInitiator === SELF_INITIATOR) {
        dispatch(waitForPlayers)
    } else {
        dispatch(listenStartGames)
    }
}

export const listenStartGames = (dispatch, getState) => {
    dispatch(listenPlayers(GAME_STARTED, (peer, { payload, type }) => {
        // I could write a check here to see if game host(!) initiated start
        console.log('heard you got a game going, starting engine, yo')
        const engine = new TetrisEngine(payload.seed)
        dispatch(startGames(engine))
    }, gameEndPromise(dispatch)))
}

const waitForPlayers = (dispatch, getState) => {
    /**
     * Timeout handler
     */
    const timeoutId = setTimeout(() => {
        clearInterval(checkerId)
        dispatch(gameStopped())
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

        if (playersReady) {
            const engine = new TetrisEngine()
            dispatch(messagePlayers(GAME_STARTED, { seed: engine.seed() }))
            dispatch(startGames(engine))

            clearInterval(checkerId);
            clearTimeout(timeoutId);
        }
    }, 100)
}