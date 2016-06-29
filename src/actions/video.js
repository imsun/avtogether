export const SET = 'VIDEO_SET'
export const SET_PAUSED = 'VIDEO_SET_PAUSED'
export const SEEK = 'VIDEO_SEEK'

export const set = data => ({ type: SET, data })
export const setPaused = paused => ({ type: SET_PAUSED, paused })
export const seek = currentTime => ({ type: SEEK, currentTime })
