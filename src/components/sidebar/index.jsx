import './style.less'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { roomActions, userActions } from '../../actions'
import { broadcast, computeColor, getViewersCount, CHAT } from '../../helpers/messages'

import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Divider from 'material-ui/Divider'
import ShareIcon from 'material-ui/svg-icons/social/share'

class Sidebar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			shareDialogOpen: false
		}
		;['toggleShareDialog']
			.forEach(method => this[method] = this[method].bind(this))
	}
	toggleShareDialog() {
		this.setState({
			shareDialogOpen: !this.state.shareDialogOpen
		})
	}
	componentWillUpdate(nextProps) {
		if (nextProps.messages.length !== this.props.messages.length) {
			const messageList = this.refs.messageList
			this.shouldScrollBottom = messageList.scrollTop + messageList.offsetHeight === messageList.scrollHeight
		}
	}
	componentDidUpdate(prevProps) {
		if (prevProps.messages.length !== this.props.messages.length && this.shouldScrollBottom) {
			const messageList = this.refs.messageList
			messageList.scrollTop = messageList.scrollHeight
		}
	}
	render() {
		return (
			<Paper className="sidebar">
				<span className="chat-info">
					<span className="viewers-count">Viewers: {this.props.viewersCount}</span>
					<FlatButton
						icon={<ShareIcon />}
						onTouchTap={this.toggleShareDialog}
					/>
				</span>
				<Divider />
				<ul ref="messageList" className="messages">
					{this.props.messages.map((message, index) => {
						return (
							<li key={index}>
								<span
									className="user-name"
									style={{ color: computeColor(message.user.id) }}
								>
									{message.user.name}
								</span>
								{message.text}
							</li>
						)
					})}
				</ul>
				<Dialog
					title="Share with Friends"
					actions={<FlatButton label="OK" primary={true} onTouchTap={this.toggleShareDialog} />}
					modal={false}
					open={this.state.shareDialogOpen}
					onRequestClose={this.toggleShareDialog}
				>
					<p>Share room ID <code>{this.props.id}</code></p>
					<p>or address of this page <a href={location.href}>{location.href}</a></p>
					<p>to invite your friends to join this room.</p>
					<br />
				</Dialog>
			</Paper>
		)
	}
}

Sidebar.propTypes = {
	id: PropTypes.string.isRequired,
	messages: PropTypes.array.isRequired,
	viewersCount: PropTypes.number.isRequired
}

const mapStateToProps = ({ room: { id, messages, viewersCount }}) => ({ id, messages, viewersCount })


export default connect(mapStateToProps)(Sidebar)