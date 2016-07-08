export const SET = 'VIDEO_SET'
export const SET_PAUSED = 'VIDEO_SET_PAUSED'
export const SEEK = 'VIDEO_SEEK'
export const PUSH_STATUS = 'VIDEO_PUSH_STATUS'
export const CLEAR_STATUS = 'VIDEO_CLEAR_STATUS'

export const set = data => ({ type: SET, data })
export const setPaused = paused => ({ type: SET_PAUSED, paused })
export const seek = currentTime => ({ type: SEEK, currentTime })
export const pushStatus = status => ({ type: PUSH_STATUS, status })
export const clearStatus = () => ({ type: CLEAR_STATUS })
