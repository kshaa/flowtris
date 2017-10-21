import {
    LOBBY_SENT_INVITE,
    LOBBY_ABORTED_INVITE,
    LOBBY_ACCEPTED_INVITE,
    LOBBY_DECLINED_INVITE,
    LOBBY_RECEIVED_INVITE,
    LOBBY_LOST_INVITE,
    NO_INITIATOR
} from '../actions/lobby'


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

export function roomBuddy(state = {}, action) {
    switch (action.type) {
        case LOBBY_SENT_INVITE:
        case LOBBY_RECEIVED_INVITE:
        case LOBBY_ACCEPTED_INVITE:
            return action.player
        case LOBBY_ABORTED_INVITE:
        case LOBBY_LOST_INVITE:
        case LOBBY_DECLINED_INVITE:
            return {}
        default:
            return state
    }
}

export function room(state = {}, action) {
    return {
        roomInitiator: roomInitiator(state.selfHosted, action),
        roomBuddy: roomBuddy(state.host, action)
    }
}
