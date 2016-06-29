import './common.less'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import store from './store'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import App from './components/container'
import Entry from './components/entry'
import Room from './components/room'

injectTapEventPlugin()

render((
	<MuiThemeProvider>
		<Provider store={store}>
			<Router history={browserHistory}>
				<Route path="/" component={App}>
					<IndexRoute component={Entry}/>
					<Route path="/room/:id" component={Room}/>
				</Route>
			</Router>
		</Provider>
	</MuiThemeProvider>
), document.querySelector('#app'))
