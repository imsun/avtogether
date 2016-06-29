import { roomActions } from '../actions'

const initState = {
	id: '',
	torrents: [],
	conversationId: '',
	viewersCount: 0,
	messages: []
}

export default function(state = initState, action) {
	switch (action.type) {
		case roomActions.SET_ID:
			return Object.assign({}, state, {
				id: action.id
			})
		case roomActions.SET_TORRENTS:
			return Object.assign({}, state, {
				torrents: action.torrents || []
			})
		case roomActions.SET_CONVERSATION_ID:
			return Object.assign({}, state, {
				conversationId: action.conversationId
			})
		case roomActions.ADD_MESSAGE:
			return Object.assign({}, state, {
				messages: [
					...state.messages,
					action.message
				]
			})
		case roomActions.CLEAR_MESSAGES:
			return Object.assign({}, state, {
				messages: []
			})
		case roomActions.SET_VIEWERS_COUNT:
			return Object.assign({}, state, {
				viewersCount: action.viewersCount
			})
		default:
			return state
	}
}
