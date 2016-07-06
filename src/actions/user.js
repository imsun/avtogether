export const SET_NAME = 'USER_SET_NAME'
export const OPEN_NAME_DIALOG = 'USER_OPEN_NAME_DIALOG'
export const CLOSE_NAME_DIALOG = 'USER_CLOSE_NAME_DIALOG'
export const SET_NAME_REQUIRED = 'USER_SET_NAME_REQUIRED'
export const JOIN_ROOM = 'USER_JOIN_ROOM'
export const CLEAR_RECENTLY_JOINED = 'USER_CLEAR_RECENTLY_JOINED'

export const setName = name => ({ type: SET_NAME, name })
export const openNameDialog = () => ({ type: OPEN_NAME_DIALOG })
export const closeNameDialog = () => ({ type: CLOSE_NAME_DIALOG })
export const setNameRequired = required => ({ type: SET_NAME_REQUIRED, required })
export const joinRoom = roomId => ({ type: JOIN_ROOM, roomId })
export const clearRecentlyJoined = () => ({ type: CLEAR_RECENTLY_JOINED })