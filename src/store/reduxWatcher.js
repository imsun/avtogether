import isEqual from 'lodash/isEqual'

const select = (state, cursor) => cursor.reduce((previous, current) => previous[current], state)
export default class ReduxWatcher {
	constructor(store) {
		const watchList = this.__watchList = {}
		this.__store = store
		this.__previousState = store.getState()
		store.subscribe(() => {
			const currentState = this.__currentState = store.getState()
			const previousState = this.__previousState
			Object.keys(watchList).forEach(key => {
				const listeners = watchList[key]
				if (!listeners) {
					return
				}
				const cursor = JSON.parse(key)
				const previousValue = select(previousState, cursor)
				const currentValue = select(currentState, cursor)

				if (!isEqual(previousValue, currentValue)) {
					listeners.forEach(listener => listener({
						store,
						cursor,
						previousState,
						currentState,
						previousValue,
						currentValue
					}))
				}
			})
			this.__previousState = currentState
		})
		this.watch = this.watch.bind(this)
	}
	watch(cursor, listener) {
		const watchList = this.__watchList
		const cursorStr = JSON.stringify(cursor)
		watchList[cursorStr] = watchList[cursorStr] || []
		watchList[cursorStr].push(listener)
	}
	off(cursor, listener) {
		const cursorStr = JSON.stringify(cursor)
		if (!this.__watchList[cursorStr]) {
			console.warn(`No such listener for ${cursor}`)
			return
		}
		const listeners = this.__watchList[cursorStr]
		const listenerIndex = listeners.indexOf(listener)
		if (listenerIndex >= 0) {
			listeners.splice(listeners.indexOf(listener))
		} else {
			console.warn(`No such listener for ${cursor}`)
		}
		if (listeners.length === 0) {
			delete this.__watchList[cursorStr]
		}
	}
}