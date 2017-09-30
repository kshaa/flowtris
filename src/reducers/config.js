import data from '../config'
import {
    CONFIG_NICK,
    CONFIG_TIMEOUT
} from '../actions/config' 

export function config(state = data, action) {
    switch (action.type) {
        case CONFIG_TIMEOUT:
            return {
                ...state,
                timeout: action.timeout
            }
        case CONFIG_NICK:
            return {
                ...state,
                nick: action.nick
            }
        default:
            return state   
    }
}
