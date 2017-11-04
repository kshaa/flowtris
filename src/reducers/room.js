import {
    LOBBY_SENT_INVITE,
    LOBBY_ABORTED_INVITE,
    LOBBY_ACCEPTED_INVITE,
    LOBBY_DECLINED_INVITE,
    LOBBY_RECEIVED_INVITE,
    LOBBY_LOST_INVITE,
    NO_INITIATOR,
    SELF_INITIATOR,
    REMOTE_INITIATOR
} from '../actions/lobby'

import {
    GAME_FIELD_UPDATED
} from '../actions/game'

const createPlayer = (
    previousState = {}, // So we don't accidentally check keys on 'undefined'
    started = previousState.started ? previousState.started : false,
    piece = previousState.piece ? previousState.piece : [],
    field = previousState.field ? previousState.field : []
) => {
    return {
        started,
        piece,
        field
    }
}

export function roomInitiator(state = NO_INITIATOR, action) {
    switch (action.type) {
        case LOBBY_SENT_INVITE:
        case LOBBY_RECEIVED_INVITE:
        case LOBBY_ACCEPTED_INVITE:
        case LOBBY_ABORTED_INVITE:
        case LOBBY_LOST_INVITE:
        case LOBBY_DECLINED_INVITE:
            return action.initiator
        default:
            return state
    }
}

export function selfGame(state = {}, action) {
    console.log('action being reduced', action.type)
    switch (action.type) {
        case LOBBY_SENT_INVITE:
        case LOBBY_RECEIVED_INVITE:
            return createPlayer()
        case LOBBY_ABORTED_INVITE:
        case LOBBY_LOST_INVITE:
        case LOBBY_DECLINED_INVITE:
            return {}
        case GAME_FIELD_UPDATED:
            if (action.initiator == SELF_INITIATOR) {
                return createPlayer(state, undefined, undefined, action.data)
            }
        default:
            return state
    }
}

export function remoteGames(state = {}, action) {
    switch (action.type) {
        case LOBBY_SENT_INVITE:
        case LOBBY_RECEIVED_INVITE:
            return {
                ...state,
                [action.player.id]: createPlayer()
            }
        case LOBBY_ABORTED_INVITE:
        case LOBBY_LOST_INVITE:
        case LOBBY_DECLINED_INVITE:
            return {}
        case GAME_FIELD_UPDATED:
            if (action.initiator == REMOTE_INITIATOR) {
                return Object.assign(
                    state,
                    {
                        [action.playerId]: createPlayer(state, undefined, undefined, action.data)
                    }
                )
            }
        default:
            return state
    }
}

export function roomGames(state = {}, action) {
    return  {
        self: selfGame(state.self, action),
        remote: remoteGames(state.remote, action)
    }
}

export function room(state = {}, action) {
    return {
        roomInitiator: roomInitiator(state.roomInitiator, action),
        roomGames: roomGames(state.roomGames, action)
    }
}
