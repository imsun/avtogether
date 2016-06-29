import * as videoActions from './video'


export const SET_ID = 'ROOM_SET_ID'
export const SET_TORRENTS = 'ROOM_SET_TORRENTS'
export const SET_CONVERSATION_ID = 'ROOM_SET_CONVERSATION_ID'
export const ADD_MESSAGE = 'ROOM_ADD_MESSAGE'
export const CLEAR_MESSAGES = 'ROOM_CLEAR_MESSAGES'
export const SET_VIEWERS_COUNT = 'ROOM_SET_VIWERS_COUNT'


export const setId = id => ({ type: SET_ID, id })
export const setTorrents = torrents => ({ type: SET_TORRENTS, torrents })
export const setConversationId = conversationId => ({ type: SET_CONVERSATION_ID, conversationId })
export const addMessage = message => ({ type: ADD_MESSAGE, message })
export const clearMessages = () => ({ type: CLEAR_MESSAGES })
export const setViewersCount = viewersCount => ({ type: SET_VIEWERS_COUNT, viewersCount })
