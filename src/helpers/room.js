import config from '../config'
import store, { watcher } from '../store'
import { roomActions, userActions, videoActions } from '../actions'
import * as Messages from './messages'
import AV from 'leancloud-storage/dist/av'
import WebTorrent from 'webtorrent/webtorrent.min'
import { browserHistory } from 'react-router'

AV.init(config.leancloud)

const client = new WebTorrent()
client.on('error', e => {
	console.log(e);
})

const trackers = config.torrent && config.torrent.trackers

export default { create, goto, join, leave, seed, addTorrent, loadTorrent, updateRemote }

function create() {
	const RoomObject = AV.Object.extend('Room')
	const room = new RoomObject()
	return room.save({}).then(res => {
		goto(res.id)
	})
}

function goto(id) {
	browserHistory.push(`/room/${id}`)
}

function join(id) {
	const rooms = new AV.Query('Room')

	store.dispatch(roomActions.setId(id))
	store.dispatch(userActions.joinRoom(id))
	return rooms.get(id)
		.then(data => {
			console.log('Room info:', data.attributes)
			store.dispatch(roomActions.setConversationId(data.attributes.conversationId))
			store.dispatch(roomActions.setTorrents(data.attributes.torrents))
			store.dispatch(videoActions.set({
				paused: data.attributes.paused,
				currentTime: data.attributes.currentTime
			}))
		})
		.then(() => Messages.init())
		.then(() => Messages.broadcast(Messages.JOIN_ROOM, store.getState().user))
}

function leave() {
	return new Promise(resolve => {
		const torrents = store.getState().room.torrents
		if (torrents.length > 0) {
			client.remove(torrents[0].id, () => resolve())
			store.dispatch(roomActions.setTorrents([]))
		} else {
			resolve()
		}
	})
		.then(() => Messages.broadcast(Messages.LEAVE_ROOM))
		.then(() => Messages.quit())
}

function seed(file) {
	return new Promise(resolve => {
		client.seed(file, {
			announce: trackers
		}, torrent => {
			resolve(torrent)
		})
	})
}

function addTorrent(torrent) {
	const prevTorrent = store.getState().room.torrents[0]
	store.dispatch(roomActions.setTorrents([{
		name: torrent.name,
		id: torrent.magnetURI
	}]))
	const torrents = [{
		name: torrent.name,
		id: torrent.magnetURI
	}]
	return new Promise(resolve => {
		if (prevTorrent) {
			client.remove(prevTorrent.id, () => resolve())
		} else {
			resolve()
		}
	})
		.then(() => updateRemote({ torrents }))
		.then(() => Messages.broadcast(Messages.TORRENTS_UPDATE, {torrents}))
		.then(() => Promise.resolve(torrent))
}

function loadTorrent() {
	store.dispatch(videoActions.pushStatus('finding peers...'))
	return new Promise(resolve => {
		client.add(store.getState().room.torrents[0].id, torrent => {
			console.log('add torrent: ', torrent.name)
			console.log('peers number: ', torrent.numPeers)
			torrent.on('wire', (wire, addr) => {
				console.log('new peer: ', addr)
				console.log('peers number: ', torrent.numPeers)
			})
			torrent.on('noPeers', (announceType) => {
				console.log(announceType)
			})
			store.dispatch(videoActions.pushStatus('peers found.'))
			resolve(torrent)
		})
	})
}

function updateRemote(state) {
	const roomId = store.getState().room.id
	const room = AV.Object.createWithoutData('Room', roomId)
	Object.keys(state).forEach(key => {
		console.log(`updateRemote { ${key}: ${JSON.stringify(state[key])} }`)
		room.set(key, state[key])
	})
	return room.save()
}


/**
 * Watch video states and update server data
 */
watcher.watch(['video', 'videoReady'], videoReadyListener)

let videoUpdateTimer
function videoReadyListener({ currentValue: videoReady }) {
	const method = videoReady ? 'watch' : 'off'
	watcher[method](['video', 'currentTime'], videoListener)
	watcher[method](['video', 'paused'], videoListener)
	if (videoReady) {
		let latestTime = store.getState().video.realTime
		videoUpdateTimer = setInterval(() => {
			const currentTime = store.getState().video.realTime
			if (currentTime !== latestTime) {
				latestTime = currentTime
				updateRemote({ currentTime })
			}
		}, 2000)
	} else {
		clearInterval(videoUpdateTimer)
		videoUpdateTimer = null
	}
}

function videoListener({ selector, currentState, currentValue }) {
	const stateName = selector[selector.length - 1]
	updateRemote({
		[stateName]: currentValue
	})
		.then(() => {
			if (!currentState.video.disableBroadcast) {
				Messages.broadcast(Messages.VIDEO_UPDATE, {
					[stateName]: currentValue
				})
			}
		})
}
