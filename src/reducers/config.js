import data from '../config'
import {
    CONFIG_ROOM,
    CONFIG_NICK,
    CONFIG_TIMEOUT
} from '../actions/config' 

export function configRoom(state = data.room, action) {
    switch (action.type) {
        case CONFIG_ROOM:
            return action.room
        default:
            return state   
    }
}

export function configNick(state = data.nick, action) {
    switch (action.type) {
        case CONFIG_NICK:
            return action.nick
        default:
            return state   
    }
}

export function configTimeout(state = data.timeout, action) {
    switch (action.type) {
        case CONFIG_TIMEOUT:
            return action.timeout
        default:
            return state   
    }
}

export function config(state = {}, action) {
    return {
        room: configRoom(state.room, action),
        nick: configNick(state.nick, action),
        timeout: configTimeout(state.timeout, action)
    }
}
