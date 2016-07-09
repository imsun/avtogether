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
			const data = Object.assign({}, action.data)
			if (!isNaN(parseFloat(data.volume))) {
				localStorage.setItem('videoVolume', data.volume)
			}
			if (data.currentTime !== undefined) {
				data.realTime = data.currentTime
			}
			return Object.assign({}, state, data)
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