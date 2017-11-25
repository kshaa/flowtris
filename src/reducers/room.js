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
    PLAYER_HAS_LEFT
} from '../actions/players'

import {
    GAME_FIELD_UPDATED,
    GAME_ENGINE_UPDATED,
    GAME_STOPPED
} from '../actions/game'

const updateLeaveOrSet = (changedState, previousState, key, defaultValue) => {
    return key in changedState ? changedState[key] : // Check change first
           key in previousState ? previousState[key] : // Else check if there's a previous value
           defaultValue // Else set the default
}

const createPlayer = (
    previousState = {}, // So we don't accidentally check keys on 'undefined'
    changedState = {}
) => {
    // This for sure could be done by some underscore/jQuery .extend
    // But that'd be kind of bloaty for this project
    return {
        started: updateLeaveOrSet(changedState, previousState, 'started', false),
        lost: updateLeaveOrSet(changedState, previousState, 'lost', false),
        won: updateLeaveOrSet(changedState, previousState, 'won', false),
        piece: updateLeaveOrSet(changedState, previousState, 'piece', []),
        field: updateLeaveOrSet(changedState, previousState, 'field', []),
        engine: updateLeaveOrSet(changedState, previousState, 'engine', {})
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
            if (action.initiator) {
                return action.initiator
            } else {
                return state
            }
        default:
            return state
    }
}

export function selfGame(state = {}, action) {
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
                return createPlayer(state, { field: action.data })
            }
        case GAME_ENGINE_UPDATED:
            if (action.initiator == SELF_INITIATOR) {
                return createPlayer(state, { engine: action.data })
            }
        case GAME_STOPPED:
            if (action.initiator == SELF_INITIATOR && (action.won || action.lost)) {
                return createPlayer(state, { lost: action.lost, won: action.won })
            }
        default:
            return state
    }
}

export function remoteGames(state = {}, action) {
    switch (action.type) {
        case LOBBY_SENT_INVITE:
        case LOBBY_RECEIVED_INVITE:
            if (action.player.id) {
                return {
                    ...state,
                    [action.player.id]: createPlayer()
                }
            } else {
                return state
            }
        case LOBBY_ABORTED_INVITE:
        case LOBBY_LOST_INVITE:
        case LOBBY_DECLINED_INVITE:
            return {}
        case GAME_FIELD_UPDATED:
            if (action.initiator == REMOTE_INITIATOR && action.playerId) {
                return Object.assign(
                    state,
                    {
                        [action.playerId]: createPlayer(state[action.playerId], { field: action.data })
                    }
                )
            }
        case GAME_STOPPED:
            if (action.initiator == REMOTE_INITIATOR && action.playerId && (action.won || action.lost)) {
                return Object.assign(
                    state,
                    {
                        [action.playerId]: createPlayer(state[action.playerId], { lost: action.lost, won: action.won })
                    }
                )
            }
        default:
            return state
    }
}

export function roomGames(state = {}, action) {
    // Reset state on invite
    switch (action.type) {
        case LOBBY_RECEIVED_INVITE:
        case LOBBY_SENT_INVITE:
            state = {}
    }

    return  {
        self: selfGame(state.self, action),
        remote: remoteGames(state.remote, action)
    }
}

export function inviteDestroyed(state = true, action) {
    switch (action.type) {
        case LOBBY_ACCEPTED_INVITE:
            return true
        case LOBBY_RECEIVED_INVITE:
        case LOBBY_SENT_INVITE:
            return false
        default:
            return state
    }
}

export function roomEnded(state = false, action) {
    switch (action.type) {
        case GAME_STOPPED:
            return true
        case LOBBY_RECEIVED_INVITE:
        case LOBBY_SENT_INVITE:
            return false
        default:
            return state
    }
}

export function room(state = {}, action) {
    if (action.type === PLAYER_HAS_LEFT && state.roomGames && state.roomGames.remote) {
        const leftPeerId = action.peer.id,
              invitedPeerId = Object.keys(state.roomGames.remote)[0]

        // If invited player left, remove invite
        if (invitedPeerId === leftPeerId) {
            state.inviteDestroyed = true
        }
    }

    return {
        roomInitiator: roomInitiator(state.roomInitiator, action),
        roomEnded: roomEnded(state.roomEnded, action),
        inviteDestroyed: inviteDestroyed(state.inviteDestroyed, action),
        roomGames: roomGames(state.roomGames, action)
    }
}
