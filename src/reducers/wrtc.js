import {
    WRTC_HAS_ERRORED,
    WRTC_IS_LOADING,
    WRTC_CONNECT_FINISHED,
    WRTC_SUBSCRIBE,
    WRTC_SUBSCRIBE_FLUSH,
    WRTC_JOIN_ROOM,
    WRTC_LEAVE_ROOM
} from '../actions/wrtc'

export function wrtcCurrentRoom(state = '', action) {
    switch (action.type) {
        case WRTC_JOIN_ROOM:
            return action.room
        case WRTC_LEAVE_ROOM:
            return ''
        default:
            return state
    }
}

export function wrtcHasErrored(state = false, action) {
    switch (action.type) {
        case WRTC_HAS_ERRORED:
            return action.hasErrored
        default:
            return state
    }
}

export function wrtcIsLoading(state = false, action) {
    switch (action.type) {
        case WRTC_IS_LOADING:
            return action.isLoading
        default:
            return state
    }
}

export function wrtcHasFinished(state = false, action) {
    switch (action.type) {
        case WRTC_CONNECT_FINISHED:
            return action.isFinished
        default:
            return state
    }
}

export function wrtcInstance(state = {}, action) {
    switch (action.type) {
        case WRTC_CONNECT_FINISHED:
            return action.wrtc
        default:
            return state
    }
}

export function wrtcSubscribers(state = [], action) {
    switch (action.type) {
        case WRTC_SUBSCRIBE:
            return [
                ...state,
                {
                    promise: action.promise,
                    resolve: action.resolve,
                    reject: action.reject
                }
            ]
        case WRTC_SUBSCRIBE_FLUSH:
            return []
        default:
            return state  
    }         
} 

export function wrtc(state = {}, action) {
    return {
        wrtcInstance: wrtcInstance(state.wrtcInstance, action),
        wrtcSubscribers: wrtcSubscribers(state.wrtcSubscribers, action),
        wrtcIsLoading: wrtcIsLoading(state.wrtcIsLoading, action),
        wrtcHasErrored: wrtcHasErrored(state.wrtcHasErrored, action),
        wrtcHasFinished: wrtcHasFinished(state.wrtcHasFinished, action),
        wrtcCurrentRoom: wrtcCurrentRoom(state.wrtcCurrentRoom, action)
    }
}
