import './style.less'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { userActions } from '../../actions'

import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import { GitHubIcon } from '../icon'

function backHome() {
	browserHistory.push('/')
}

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			nameDialogErrorText: null,
			newName: null
		}

		;['setNewName', 'updateName']
			.forEach(method => this[method] = this[method].bind(this))
	}
	setNewName(e) {
		this.setState({
			newName: e.target.value
		})
	}
	updateName() {
		this.props.setName(this.state.newName)
		this.props.closeNameDialog()
	}
	render() {
		const iconRight = (
			this.props.name
				? <FlatButton label={this.props.name} onTouchTap={this.props.openNameDialog} />
				: null
		)

		const cancelButton = (
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.props.closeNameDialog}
			/>
		)
		const confirmButton = (
			<FlatButton
				label="Confirm"
				primary={true}
				onTouchTap={this.updateName}
				disabled={!this.state.newName || this.state.nameDialogErrorText !== null}
			/>
		)
		const actions = (!this.props.nameRequired || !!this.props.name)
			? [cancelButton, confirmButton]
			: [confirmButton]
		const customContentStyle = {
			maxWidth: '400px'
		}
		return (
			<div className="container">
				<AppBar
					title={this.props.location.pathname === '/' ? null : "AvTogether"}
					titleStyle={{ cursor: 'pointer', flex: '' }}
					iconStyleLeft={{ display: 'none' }}
					iconElementRight={iconRight}
					zDepth={0}
					onTitleTouchTap={backHome}
				/>
				{this.props.children}

				<footer>
					<a href="https://github.com/imsun/AvTogether" target="_blank">
						<GitHubIcon color="white"/>
					</a>
					<p>
						<a href="//imsun.net" target="_blank">imsun.net</a>
					</p>
				</footer>
				<Dialog
					title="Set Your Name"
					actions={actions}
					modal={false}
					open={this.props.nameDialogOpen}
					onRequestClose={this.props.closeNameDialog}
					contentStyle={customContentStyle}
				>
					<TextField
						hintText="Your Name"
						errorText={this.state.nameDialogErrorText}
						onChange={this.setNewName} />
					<br />
				</Dialog>
			</div>
		)
	}
}

App.propTypes = {
	name: PropTypes.string
}

const mapDispatchToProps = dispatch => ({
	setName: name => dispatch(userActions.setName(name)),
	openNameDialog: () => dispatch(userActions.openNameDialog()),
	closeNameDialog: () => {
		dispatch(userActions.closeNameDialog())
	}
})


export default connect(state => state.user, mapDispatchToProps)(App)