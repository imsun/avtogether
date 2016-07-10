import isEqual from 'lodash/isEqual'

const select = (state, selector) => selector.reduce((prev, current) => prev[current], state)
export default class ReduxWatcher {
	constructor(store) {
		const watchList = this.__watchList = {}
		this.__prevState = store.getState()
		store.subscribe(() => {
			const currentState = store.getState()
			const prevState = this.__prevState
			Object.keys(watchList).forEach(key => {
				const listeners = watchList[key]
				if (!listeners) {
					return
				}
				const selector = JSON.parse(key)
				const prevValue = select(prevState, selector)
				const currentValue = select(currentState, selector)

				if (!isEqual(prevValue, currentValue)) {
					listeners.forEach(listener => listener({
						store,
						selector,
						prevState,
						currentState,
						prevValue,
						currentValue
					}))
				}
			})
			this.__prevState = currentState
		})
		this.watch = this.watch.bind(this)
	}
	watch(selector, listener) {
		const watchList = this.__watchList
		const selectorStr = JSON.stringify(selector)
		watchList[selectorStr] = watchList[selectorStr] || []
		watchList[selectorStr].push(listener)
	}
	off(selector, listener) {
		const selectorStr = JSON.stringify(selector)
		if (!this.__watchList[selectorStr]) {
			console.warn(`No such listener for ${selector}`)
			return
		}
		const listeners = this.__watchList[selectorStr]
		const listenerIndex = listeners.indexOf(listener)
		if (listenerIndex >= 0) {
			listeners.splice(listeners.indexOf(listener))
		} else {
			console.warn(`No such listener for ${selector}`)
		}
		if (listeners.length === 0) {
			delete this.__watchList[selectorStr]
		}
	}
}