import { videoActions } from '../actions'

const initState = {
	paused: true,
	currentTime: 0
}

export default function(state = initState, action) {
	switch (action.type) {
		case videoActions.SET:
			return Object.assign({}, state, action.data)
		case videoActions.SEEK:
			return Object.assign({}, state, {
				currentTime: action.currentTime
			})
		case videoActions.SET_PAUSED:
			return Object.assign({}, state, {
				paused: action.paused
			})
		default:
			return state
	}
}