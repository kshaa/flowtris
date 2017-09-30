import { combineReducers } from 'redux'
import { config } from './config'
import { wrtc } from './wrtc'
import { players } from './players'
import { room } from './room'

export default combineReducers({
    config,
    wrtc,
    players,
    room
})
