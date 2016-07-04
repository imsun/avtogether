import { userActions } from '../actions'

if (!localStorage.getItem('id')) {
	localStorage.setItem('id', Date.now().toString(36) + Math.random().toString(36).substring(2))
}
const recentlyJoined = localStorage.getItem('recentlyJoined')
const initState = {
	id: localStorage.getItem('id'),
	name: localStorage.getItem('name') || '',
	nameDialogOpen: !localStorage.getItem('name'),
	nameRequired: false,
	recentlyJoined: recentlyJoined ? JSON.parse(recentlyJoined) : []
}

const formatTime = date => `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`

export default function(state = initState, action) {
	switch (action.type) {
		case userActions.SET_NAME:
			localStorage.setItem('name', action.name)
			return Object.assign({}, state, {
				name: action.name
			})
		case userActions.OPEN_NAME_DIALOG:
			return Object.assign({}, state, {
				nameDialogOpen: true
			})
		case userActions.CLOSE_NAME_DIALOG:
			return Object.assign({}, state, {
				nameDialogOpen: state.nameRequired && !state.name
			})
		case userActions.SET_NAME_REQUIRED:
			return Object.assign({}, state, {
				nameRequired: action.required,
				nameDialogOpen: state.nameDialogOpen || action.required && !state.name
			})
		case userActions.JOIN_ROOM:
			const roomId = action.roomId
			const roomIndex = state.recentlyJoined.findIndex(value => value.roomId === roomId)
			const recentlyJoined = state.recentlyJoined.slice()
			if (roomIndex >= 0) {
				recentlyJoined.splice(roomIndex, 1)
			}
			recentlyJoined.unshift({
				roomId,
				time: formatTime(new Date())
			})
			localStorage.setItem('recentlyJoined', JSON.stringify(recentlyJoined))
			return Object.assign({}, state, { recentlyJoined })
		case userActions.CLEAR_RECENTLY_JOINED:
			localStorage.setItem('recentlyJoined', '[]')
			return Object.assign({}, state, {
				recentlyJoined: []
			})
		default:
			return state
	}
}