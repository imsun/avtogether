import './style.less'
import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import Room from '../../helpers/room'
import { userActions } from '../../actions'

import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import { List, ListItem } from 'material-ui/List'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import { GitHubIcon } from '../icon'

function backHome() {
	browserHistory.push('/')
}

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			userPopoverOpen: false,
			userAnchorEl: null,
			nameDialogErrorText: null,
			newName: null,
			recentlyJoinedDialogOpen: false
		}

		;[
			'openUserPopover', 'closeUserPopover'
			, 'openNameDialog', 'setNewName', 'updateName'
			, 'openRecentlyJoinedDialog', 'closeRecentlyJoinedDialog'
		]
			.forEach(method => this[method] = this[method].bind(this))
	}
	openUserPopover(e) {
		e.preventDefault()
		this.setState({
			userPopoverOpen: true,
			userAnchorEl: e.currentTarget
		})
	}
	closeUserPopover() {
		this.setState({
			userPopoverOpen: false
		})
	}
	openNameDialog() {
		this.closeUserPopover()
		this.props.openNameDialog()
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
	openRecentlyJoinedDialog() {
		this.closeUserPopover()
		this.setState({
			recentlyJoinedDialogOpen: true
		})
	}
	closeRecentlyJoinedDialog() {
		this.setState({
			recentlyJoinedDialogOpen: false
		})
	}
	render() {
		const iconRight = (
			this.props.name
				? <FlatButton label={this.props.name} onTouchTap={this.openUserPopover} />
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
		const nameDialogActions = (!this.props.nameRequired || !!this.props.name)
			? [cancelButton, confirmButton]
			: [confirmButton]
		const recentlyJoinedDialogActions = [(
			<FlatButton
				label="clear"
				primary={true}
				onTouchTap={this.props.clearRecentlyJoined}
			/>
		),(
			<FlatButton
				label="ok"
				primary={true}
				onTouchTap={this.closeRecentlyJoinedDialog}
			/>
		)]
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
				<Popover
					open={this.state.userPopoverOpen}
					anchorEl={this.state.userAnchorEl}
					anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
					targetOrigin={{horizontal: 'right', vertical: 'top'}}
					onRequestClose={this.closeUserPopover}
				>
					<Menu>
						<MenuItem primaryText="Reset Name" onTouchTap={this.openNameDialog} />
						<MenuItem primaryText="Recently Joined" onTouchTap={this.openRecentlyJoinedDialog} />
					</Menu>
				</Popover>

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
					actions={nameDialogActions}
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
				<Dialog
					title="Recently Joined"
					actions={recentlyJoinedDialogActions}
					modal={false}
					open={this.state.recentlyJoinedDialogOpen}
					onRequestClose={this.closeRecentlyJoinedDialog}
					contentStyle={customContentStyle}
				>
					<List>
						<Divider />
						{
							this.props.recentlyJoined.map(room => [(
								<ListItem
									key={room.roomId}
									primaryText={room.roomId}
									secondaryText={room.time}
									onTouchTap={() => {
										this.closeRecentlyJoinedDialog()
										Room.goto(room.roomId)
									}}
								/>
							), (
								<Divider />
							)])
						}
					</List>
				</Dialog>
			</div>
		)
	}
}

App.propTypes = {
	name: PropTypes.string,
	recentlyJoined: PropTypes.array
}

export default connect(
	state => state.user,
	dispatch => bindActionCreators(userActions, dispatch)
)(App)