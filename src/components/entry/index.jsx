import './style.less'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Room from '../../helpers/room'
import { userActions } from '../../actions'

import { LogoIcon } from '../icon'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import { Step, Stepper, StepLabel } from 'material-ui/Stepper'
import SwapIcon from 'material-ui/svg-icons/action/swap-vert'
import SyncIcon from 'material-ui/svg-icons/notification/sync'
import ForumIcon from 'material-ui/svg-icons/communication/forum'
import { cyan500 } from 'material-ui/styles/colors'

class Entry extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			joinDialogOpen: false,
			joinDialogRoomId: '',
			joinDialogErrorText: null
		}

		;['openJoinDialog', 'closeJoinDialog', 'setTargetRoom', 'joinRoom']
			.forEach(method => this[method] = this[method].bind(this))
	}
	componentDidMount() {
		this.props.setNameRequired(false)
	}
	openJoinDialog() {
		this.setState({
			joinDialogOpen: true
		})
	}
	closeJoinDialog() {
		this.setState({
			joinDialogOpen: false
		})
	}
	setTargetRoom(e) {
		if (!e.target.value) {
			this.setState({
				joinDialogErrorText: 'Room ID is required.'
			})
		} else {
			this.setState({
				joinDialogErrorText: null
			})
		}
		this.setState({
			joinDialogRoomId: e.target.value
		})
	}
	joinRoom() {
		Room.goto(this.state.joinDialogRoomId)
	}
	render() {
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.closeJoinDialog}
			/>,
			<FlatButton
				label="Join"
				primary={true}
				onTouchTap={this.joinRoom}
				disabled={!this.state.joinDialogRoomId || this.state.joinDialogErrorText !== null}
			/>
		]
		const customContentStyle = {
			maxWidth: '400px'
		}
		return (
			<div className="entry-page">
				<div className="banner">
					<LogoIcon className="logo" />
					<h1>AvTogether</h1>
					<p>Enjoy videos together with your friends.</p>
					<RaisedButton
						className="entry-button"
						secondary={true}
						onTouchTap={Room.create}
						label="Open Room"
					/>
					<RaisedButton
						className="entry-button"
						labelColor={cyan500}
						onTouchTap={this.openJoinDialog}
						label="Join Room"
					/>
				</div>

				<div className="steps">
					<div className="content">
						<h2>EASY TO GO</h2>
						<div>
							AvTogether is an experimental project to share local videos with your friends via WebRTC,
							based on <a href="https://webtorrent.io/">WebTorrent</a>.
						</div>
						<Stepper>
							<Step active={true}>
								<StepLabel>Create a room</StepLabel>
							</Step>
							<Step active={true}>
								<StepLabel>Select a local video</StepLabel>
							</Step>
							<Step active={true}>
								<StepLabel>Share room to friends</StepLabel>
							</Step>
						</Stepper>
					</div>
				</div>

				<div className="features">
					<h2>FEATURES</h2>
					<div className="cards">
						<Paper className="card">
							<SwapIcon />
							<div className="card-title">P2P Streaming</div>
							<div className="card-desc">None of video data would be uploaded</div>
						</Paper>
						<Paper className="card">
							<SyncIcon />
							<div className="card-title">Progress Syncing</div>
							<div className="card-desc">Operations will be applied to all when anyone plays / pauses / forwards / backwards the video</div>
						</Paper>
						<Paper className="card">
							<ForumIcon />
							<div className="card-title">Real-Time Communicating</div>
							<div className="card-desc">Comment anytime while watching</div>
						</Paper>
					</div>
				</div>

				<Dialog
					title="Join a Room"
					actions={actions}
					modal={false}
					open={this.state.joinDialogOpen}
					onRequestClose={this.closeJoinDialog}
					contentStyle={customContentStyle}
				>
					<TextField
						hintText="Room ID"
						errorText={this.state.joinDialogErrorText}
						onChange={this.setTargetRoom} />
					<br />
				</Dialog>
			</div>
		)
	}
}

export default connect(
	null,
	dispatch => bindActionCreators(userActions, dispatch)
)(Entry)