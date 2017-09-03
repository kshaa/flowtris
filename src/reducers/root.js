import { combineReducers } from 'redux'
import { config } from './config'
import { wrtc } from './wrtc'
import { players } from './players'

export default combineReducers({
    config,
    wrtc,
    players
})
