import {
    WRTC_HAS_ERRORED,
    WRTC_IS_LOADING,
    WRTC_CONNECT_FINISHED,
    WRTC_SUBSCRIBE
} from '../actions/wrtc'

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
        wrtcHasFinished: wrtcHasFinished(state.wrtcHasFinished, action)
    }
}
