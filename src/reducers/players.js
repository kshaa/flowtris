import {
    PLAYER_HAS_CONNECTED,
    PLAYER_HAS_CHANGED_STATE,
    PLAYER_HAS_LEFT
} from '../actions/players'

export const players = (state = [], action) => {
    switch (action.type) {
        case PLAYER_HAS_CONNECTED:
            return addPlayer(state, action)
        case PLAYER_HAS_CHANGED_STATE:
            return updatePlayer(state, action)
        case PLAYER_HAS_LEFT:
            return removePlayer(state, action)
        default:
            return state
    }
}

const addPlayer = (state, action) => {
    return [
        ...state,
        constructPlayer(action.peer, action.loaded)
    ]
}

const updatePlayer = (state, action) => {
    const playerIndex = state.findIndex(player => player.id === action.peer.id)

    return [
        ...state.slice(0, playerIndex),
        constructPlayer(action.peer, action.loaded),
        ...state.slice(playerIndex + 1)
    ]
}

const removePlayer = (state, action) => {
    const playerIndex = state.findIndex(player => player.id === action.peer.id)

    if (playerIndex !== undefined) {
        return [
            ...state.slice(0, playerIndex),
            ...state.slice(playerIndex + 1)
        ]
    }
}

const constructPlayer = (peer, loaded) => ({
    id: peer.id,
    nick: peer.nick,
    loaded,
    peer
})

