import {
    WRTC_HAS_ERRORED,
    WRTC_IS_LOADING,
    WRTC_CONNECT_SUCCESS
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

export function wrtcInstance(state = {}, action) {
    switch (action.type) {
        case WRTC_CONNECT_SUCCESS:
            return action.wrtc
        default:
            return state
    }
}

export function wrtc(state = {}, action) {
    return {
        wrtcInstance: wrtcInstance(state.wrtcInstance, action),
        wrtcIsLoading: wrtcIsLoading(state.wrtcIsLoading, action),
        wrtcHasErrored: wrtcHasErrored(state.wrtcHasErrored, action)
    }
}
