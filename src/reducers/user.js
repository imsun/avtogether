import { userActions } from '../actions'

if (!localStorage.getItem('id')) {
	localStorage.setItem('id', Date.now().toString(36) + Math.random().toString(36).substring(2))
}

const initState = {
	id: localStorage.getItem('id'),
	name: localStorage.getItem('name') || '',
	nameDialogOpen: !localStorage.getItem('name'),
	nameRequired: false
}

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
		default:
			return state
	}
}