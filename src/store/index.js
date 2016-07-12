import { createStore } from 'redux'
import rootReducer from '../reducers'
import ReduxWatcher from 'redux-watcher'

const store = createStore(rootReducer)

if (module.hot) {
	// Enable Webpack hot module replacement for reducers
	module.hot.accept('../reducers', () => {
		const nextRootReducer = require('../reducers').default
		store.replaceReducer(nextRootReducer)
	})
}

export const watcher = new ReduxWatcher(store)
export default store