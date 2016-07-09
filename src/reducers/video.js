import { videoActions } from '../actions'

if (isNaN(parseFloat(localStorage.getItem('videoVolume')))) {
	localStorage.setItem('videoVolume', 0.5)
}

const initState = {
	paused: true,
	currentTime: 0,
	fullScreen: false,
	mute: false,
	volume: parseFloat(localStorage.getItem('videoVolume')),
	muted: false,
	statusStack: [],
	isLoading: false,
	duration: 0,
	videoReady: false,
	realTime: 0
}

export default function(state = initState, action) {
	switch (action.type) {
		case videoActions.SET:
			if (!isNaN(parseFloat(action.data.volume))) {
				localStorage.setItem('videoVolume', action.data.volume)
			}
			return Object.assign({}, state, action.data)
		case videoActions.SEEK:
			return Object.assign({}, state, {
				currentTime: action.currentTime
			})
		case videoActions.SET_PAUSED:
			return Object.assign({}, state, {
				paused: action.paused
			})
		case videoActions.PUSH_STATUS:
			return Object.assign({}, state, {
				statusStack: state.statusStack.concat([action.status])
			})
		case videoActions.CLEAR_STATUS:
			return Object.assign({}, state, {
				statusStack: []
			})
		case videoActions.RESET:
			return Object.assign({}, initState)
		default:
			return state
	}
}