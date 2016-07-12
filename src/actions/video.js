export const SET = 'VIDEO_SET'
export const SET_WITHOUT_BROADCAST = 'VIDEO_SET_WITHOUT_BROADCAST'
export const PUSH_STATUS = 'VIDEO_PUSH_STATUS'
export const CLEAR_STATUS = 'VIDEO_CLEAR_STATUS'
export const RESET = 'VIDEO_RESET'

export const set = data => ({ type: SET, data })
export const setWithoutBroadcast = data => ({ type: SET_WITHOUT_BROADCAST, data })
export const pushStatus = status => ({ type: PUSH_STATUS, status })
export const clearStatus = () => ({ type: CLEAR_STATUS })
export const reset = () => ({ type: RESET })
