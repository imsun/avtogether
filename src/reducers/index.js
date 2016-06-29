import { combineReducers } from 'redux'
import room from './room'
import user from './user'
import video from './video'

export default combineReducers({ room, user, video })