import {
    PLAYER_HAS_CONNECTED,
    PLAYER_HAS_LOADED,
    PLAYER_HAS_LEFT
} from '../actions/players'

export const players = (state = [], action) => {
    switch (action.type) {
        case PLAYER_HAS_CONNECTED:
            return addConnectedPlayer(state, action)
        case PLAYER_HAS_LOADED:
            return addLoadedPlayer(state, action)
        case PLAYER_HAS_LEFT:
            return removePlayer(state, action)
        default:
            return state
    }
}

const constructPlayer = (peer, loaded) => ({
    id: peer.id,
    nick: peer.nick,
    loaded,
    peer
})

const addConnectedPlayer = (state, action) => {
    return addPlayer(state, action, false)
}

const addLoadedPlayer = (state, action) => {
    return addPlayer(state, action, true)
}

const addPlayer = (state, action, loaded) => {
    const peer = action.peer
    const playerIndex = state.findIndex(player => player.id === peer.id)

    if (playerIndex !== undefined) {
        return [
            ...state.slice(0, playerIndex),
            constructPlayer(peer, loaded),
            ...state.slice(playerIndex + 1)
        ]
    } else {
        return [
            ...state,
            constructPlayer(peer, loaded)
        ]
    }
}

const removePlayer = (state, action) => {
    const peer = action.peer
    const playerIndex = state.findIndex(player => player.id === peer.id)

    if (playerIndex !== undefined) {
        return [
            ...state.slice(0, playerIndex),
            ...state.slice(playerIndex + 1)
        ]
    }
}
