export const SET_NAME = 'USER_SET_NAME'
export const OPEN_NAME_DIALOG = 'USER_OPEN_NAME_DIALOG'
export const CLOSE_NAME_DIALOG = 'USER_CLOSE_NAME_DIALOG'
export const SET_NAME_REQUIRED = 'USER_SET_NAME_REQUIRED'

export const setName = name => ({ type: SET_NAME, name })
export const openNameDialog = () => ({ type: OPEN_NAME_DIALOG })
export const closeNameDialog = () => ({ type: CLOSE_NAME_DIALOG })
export const setNameRequired = required => ({ type: SET_NAME_REQUIRED, required })