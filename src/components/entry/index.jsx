import './style.less'
import React from 'react'
import { connect } from 'react-redux'
import Room from '../../helpers/room'
import { userActions } from '../../actions'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import {
	Step,
	Stepper,
	StepLabel,
} from 'material-ui/Stepper';
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
					<h1>AvTogether</h1>
					<p>Enjoy videos together with your friends.</p>
					<RaisedButton
						className="entry-button"
						secondary={true}
						onTouchTap={Room.create}
						label="New Room"
					/>
					<RaisedButton
						className="entry-button"
						labelColor={cyan500}
						onTouchTap={this.openJoinDialog}
						label="Join a Room"
					/>
				</div>
				<div className="info-cards">
					<Card>
						<CardHeader
							className="card-header"
							title="P2P Streaming"
						/>
						<Divider />
						<CardText>
							Videos are peer-to-peer streamed via WebRTC, and no data would be uploaded to server.
						</CardText>
					</Card>
					<Card>
						<CardHeader
							className="card-header"
							title="Progress Syncing"
						/>
						<Divider />
						<CardText>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</CardText>
					</Card>
					<Card>
						<CardHeader
							className="card-header"
							title="Real-time Group Chat"
						/>
						<Divider />
						<CardText>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</CardText>
					</Card>
					<Card>
						<CardHeader
							className="card-header"
							title="Free from Registration"
						/>
						<Divider />
						<CardText>
							The only thing you need is to set a name.
						</CardText>
					</Card>
				</div>

				<Stepper>
					<Step active={true}>
						<StepLabel>Create a room</StepLabel>
					</Step>
					<Step active={true}>
						<StepLabel>Select a local video (won't be uploaded)</StepLabel>
					</Step>
					<Step active={true}>
						<StepLabel>Send room ID or address to your friends</StepLabel>
					</Step>
				</Stepper>

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

const mapDispatchToProps = dispatch => ({
	setNameRequired: required => dispatch(userActions.setNameRequired(required))
})

export default connect(null, mapDispatchToProps)(Entry)