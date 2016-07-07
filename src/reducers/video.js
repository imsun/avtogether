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
	muted: false
}

export default function(state = initState, action) {
	switch (action.type) {
		case videoActions.SET:
			if (!isNaN(parseFloat(action.data.volume))) {
				localStorage.setItem('videoVolume', action.data.volume)
			}
			return Object.assign({}, state, action.data)
		case videoActions.SEEK:
			console.log('seektime ........', action.currentTime)
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