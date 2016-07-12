import store, { watch } from '../store'
import Room from './room'
import { roomActions, videoActions } from '../actions'
import config from '../config'
import * as colors from 'material-ui/styles/colors'
import { Realtime, TypedMessage, messageType, messageField } from 'leancloud-realtime/dist/realtime.browser'

const realtime = new Realtime(Object.assign({
	noBinary: true
}, config.leancloud))

let _client, _conversation, _timer

const EventMessage = class extends TypedMessage {}
const EVENT_MESSAGE_TYPE = 1
messageType(EVENT_MESSAGE_TYPE)(EventMessage)
messageField('event')(EventMessage)
messageField('data')(EventMessage)
messageField('user')(EventMessage)
realtime.register(EventMessage)

export function init() {
	return new Promise(resolve => {
		if (_client) {
			resolve(_client)
		} else {
			realtime.createIMClient(store.getState().user.id)
				.then(client => {
					client.on('message', onMessage)
					_client = client
					resolve(client)
				})
		}
	})
		.then(client => {
			const conversationId = store.getState().room.conversationId
			if (!conversationId) {
				return client.createConversation({
					name: 'AvTogether',
					transient: true
				}).then(conversation => {
					Room.updateRemote({
						conversationId: conversation.id
					})
					return Promise.resolve(conversation)
				})
			} else {
				return client.getConversation(conversationId)
					.then(conversation => conversation.join())
			}
		})
		.then(conversation => {
			if (_timer) {
				clearInterval(_timer)
			}
			_timer = setInterval(updateViewersCount, 5000)
			_conversation = conversation
			return Promise.resolve(conversation)
		})
}

export function quit() {
	clearInterval(_timer)
	if (!_conversation) {
		return Promise.reject()
	} else {
		const temp = _conversation

		_conversation = null
		return temp.quit()
	}
}

export const JOIN_ROOM = 'JOIN_ROOM'
export const LEAVE_ROOM = 'LEAVE_ROOM'
export const VIDEO_UPDATE = 'VIDEO_UPDATE'
export const TORRENTS_UPDATE = 'TORRENTS_UPDATE'
export const CHAT = 'CHAT'

function onMessage(message) {
	const data = JSON.parse(message.data)
	const user = JSON.parse(message.user)

	console.log(message)

	switch(message.event) {
		case VIDEO_UPDATE:
			if (user.id !== store.getState().user.id) {
				store.dispatch(videoActions.setWithoutBroadcast(data))
			}
			break
		case TORRENTS_UPDATE:
			if (user.id !== store.getState().user.id) {
				store.dispatch(roomActions.setTorrents(data.torrents))
			}
			break
		case JOIN_ROOM:
			updateViewersCount()
			store.dispatch(roomActions.addMessage({
				user,
				type: JOIN_ROOM,
				text: ` joined this room`
			}))
			break
		case LEAVE_ROOM:
			if (user.id !== store.getState().user.id) {
				updateViewersCount()
				store.dispatch(roomActions.addMessage({
					user,
					type: LEAVE_ROOM,
					text: ` leaved this room`
				}))
			} else {
				store.dispatch(roomActions.clearMessages())
			}
			break
		case CHAT:
			store.dispatch(roomActions.addMessage({
				user,
				type: CHAT,
				text: `: ${data}`
			}))
			break
	}
}

const palette = []
Object.keys(colors).forEach(color => {
	if (/500$/.test(color)) {
		palette.push(color)
	}
})
const colorCount = palette.length
export const computeColor = seed => {
	const seedNum = seed.split('').reduce((previous, current) => previous + parseInt(current, 36), 0)
	return colors[palette[parseInt(seedNum, 36) % colorCount]]
}

export function getViewersCount() {
	if (!_conversation) {
		return Promise.reject()
	} else {
		return _conversation.count()
	}
}

export function updateViewersCount() {
	getViewersCount().then(count => store.dispatch(roomActions.setViewersCount(count)))
}

export function broadcast(event, data = {}) {
	if (!_conversation) {
		return Promise.reject()
	} else {
		const message = new EventMessage()
		message.setTransient(true)
		message.event = event
		message.data = JSON.stringify(data)
		message.user = JSON.stringify(store.getState().user)
		onMessage(message)
		return _conversation.send(message)
	}
}

export default { broadcast }