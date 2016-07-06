import './style.less'
import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Room from '../../helpers/room'
import { broadcast, VIDEO_UPDATE } from '../../helpers/messages'
import { userActions } from '../../actions'

import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Video from '../video'
import Sidebar from '../sidebar'


class RoomComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isProcessingVideo: false
		}

		;['seed', 'onVideoLoad', 'onVideoStateChange']
			.forEach(method => this[method] = this[method].bind(this))
	}
	componentWillReceiveProps(newProps) {
		if (this.props.params.id !== newProps.params.id) {
			this.video.target.src = null
			this.video.reset()
			Room.leave()
				.then(() => Room.join(newProps.params.id))
		}
	}
	componentDidUpdate(prevProps) {
		if (this.props.torrents.length > 0 &&
			(prevProps.torrents.length <= 0
			|| prevProps.torrents[0].id !== this.props.torrents[0].id)) {
			this.load()
		}
	}
	componentDidMount() {
		this.props.setNameRequired(true)
		Room.join(this.props.params.id)
	}
	componentWillUnmount() {
		Room.leave()
	}
	load() {
		return Room.loadTorrent()
			.then(torrent => {
				torrent.files[0].renderTo(this.video.target)
			})
	}
	seed(e) {
		if (e.target.files.length <= 0) return
		this.setState({
			isProcessingVideo: true
		})
		Room.seed(e.target.files[0])
			.then(torrent => Room.addTorrent(torrent))
			.then(torrent => {
				torrent.files[0].renderTo(this.video.target)
				this.video.pause(0)
				this.setState({
					isProcessingVideo: false
				})
			})
			.catch(e => {
				this.setState({
					isProcessingVideo: false
				})
			})
	}
	onVideoLoad(video) {
		this.video = video
	}
	onVideoStateChange(state) {
		if (state.ended) {
			Room.updateRemote({ currentTime: 0 })
			Room.updateRemote({ paused: true })
		} else {
			Room.updateRemote(state)
				.then(() => broadcast(VIDEO_UPDATE, state))
		}
	}
	render() {
		return (
			<div className="room-page">
				<div className="video-banner">
					{(() => {
						if (this.state.isProcessingVideo) {
							return <span>Processing video...</span>
						} else {
							return this.props.torrents[0]
								? <span>Now is playing <b>{this.props.torrents[0].name}</b></span>
								: <span>No video available</span>
						}
					})()}
					<RaisedButton
						className="file-button"
						label="Choose a Video"
						labelPosition="before"
						onTouchTap={() => this.refs.fileInput.click()}
					/>
					<input
						ref="fileInput"
						type="file"
						onChange={this.seed}
						accept="video/mp4,video/x-m4v,video/*"
					/>
				</div>
				<div className="video-container">
					<Video onLoad={this.onVideoLoad} onVideoStateChange={this.onVideoStateChange}/>
					<Sidebar />
				</div>
			</div>
		)
	}
}

RoomComponent.propTypes = {
	id: PropTypes.string.isRequired,
	torrents: PropTypes.array.isRequired,
	messages: PropTypes.array.isRequired
}

export default connect(
	state => state.room,
	dispatch => bindActionCreators(userActions, dispatch)
)(RoomComponent)