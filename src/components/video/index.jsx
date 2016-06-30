import './style.less'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { videoActions } from '../../actions'
import Room  from '../../helpers/room'
import { broadcast, CHAT } from '../../helpers/messages'

import Paper from 'material-ui/Paper'
import Slider from 'material-ui/Slider'
import IconButton from 'material-ui/IconButton'
import AvPlay from 'material-ui/svg-icons/av/play-arrow'
import AvPause from 'material-ui/svg-icons/av/pause'
import TextField from 'material-ui/TextField'

function toHHMMSS(secNum, spliter = ':') {
	if (isNaN(secNum)) {
		return `--${spliter}--`
	}
	const hours   = Math.floor(secNum / 3600)
	const minutes = Math.floor((secNum - hours * 3600) / 60)
	const seconds = Math.floor(secNum - hours * 3600 - minutes * 60)

	return hours > 0
		? [hours, minutes, seconds].map(time => time < 10 ? `0${time}` : time).join(spliter)
		: [minutes, seconds].map(time => time < 10 ? `0${time}` : time).join(spliter)
}

class Video extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			duration: 0,
			currentTime: 0,
			videoReady: false,
			textToBeSent: '',
			timer: null
		}

		;['onTextChange', 'send', 'play', 'pause', 'togglePlay', 'seek', 'setProgress', 'updateProgress']
			.forEach(method => this[method] = this[method].bind(this))
	}
	componentDidUpdate(prevProps) {
		if (this.props.paused !== prevProps.paused) {
			console.log('paused:', this.props.paused)
			if (this.props.paused) {
				this.target.pause()
			} else {
				this.target.play()
			}
		}
		if (this.props.currentTime !== prevProps.currentTime) {
			this.target.currentTime = this.props.currentTime
		}
	}
	componentDidMount() {
		const target = this.target = this.refs.target

		target.addEventListener('durationchange', () => {
			console.log('duration change')
			this.setState({
				duration: target.duration
			})
		})
		target.addEventListener('loadstart', () => {
			console.log('load start')
			target.currentTime = this.props.currentTime
			this.setState({
				videoReady: false
			})
		})
		target.addEventListener('loadeddata', () => {
			console.log('loaded data')
			let latestTime = this.state.currentTime
			this.setState({
				videoReady: true,
				currentTime: this.target.currentTime,
				timer: setInterval(() => {
					const currentTime = this.state.currentTime
					if (currentTime !== latestTime) {
						latestTime = currentTime
						Room.updateRemote({ currentTime })
					}
				}, 2000)
			})
		})
		target.addEventListener('timeupdate', this.updateProgress)
		target.addEventListener('play', () => {
			if (this.props.paused) {
				target.pause()
			} else {
				target.play()
			}
		})
		target.addEventListener('ended', () => {
			if (!target.loop) {
				this.props.setCurrentTime(target.currentTime)
				this.props.setCurrentTime(0)
				this.props.setPaused(true)
				this.props.onVideoStateChange && this.props.onVideoStateChange({
					ended: true
				})
			}
		})
		this.props.onLoad && this.props.onLoad(this)
	}
	componentWillUnmount() {
		if (this.state.timer) {
			clearInterval(this.state.timer)
		}
	}
	onTextChange(e, value) {
		this.setState({
			textToBeSent: value
		})
	}
	send() {
		if (this.state.textToBeSent) {
			broadcast(CHAT, this.state.textToBeSent)
			this.setState({
				textToBeSent: ''
			})
		}
	}
	setProgress(e, value) {
		this.seek(value)
	}
	updateProgress() {
		const duration = this.target.duration || this.state.duration
		const currentTime = this.target.currentTime
		if (this.state.videoReady) {
			this.setState({duration, currentTime})
		}
	}
	play(time) {
		this.togglePlay(true, time)
	}
	pause(time) {
		this.togglePlay(false, time)
	}
	seek(time) {
		this.props.setCurrentTime(time)
		this.props.onVideoStateChange && this.props.onVideoStateChange({
			currentTime: time
		})
	}
	togglePlay(start = this.target.paused, time = this.target.currentTime) {
		this.props.set({
			paused: !start,
			currentTime: time
		})
		this.props.onVideoStateChange && this.props.onVideoStateChange({
			paused: !start,
			currentTime: time
		})
	}
	render() {
		const smallStyle = {
			width: 30,
			height: 30,
			padding: 0
		}
		const iconLarge = {
			width: 30,
			height: 30
		}
		return (
			<Paper className="video">
				<video ref="target" />
				<div className="control-bar">
					<IconButton
						style={smallStyle}
						iconStyle={iconLarge}
						onTouchTap={() => this.togglePlay()}
						disabled={!this.state.videoReady}
					>
						{
							this.props.paused
								? <AvPlay />
								: <AvPause />
						}
					</IconButton>
					<Slider
						className="progress-bar"
						min={0}
						max={this.state.duration || 1}
						value={this.state.duration > this.state.currentTime ? this.state.currentTime : 0}
						onChange={this.setProgress}
						disabled={!this.state.videoReady}
					/>
					<span className="video-time">
						{toHHMMSS(this.state.currentTime)}/{toHHMMSS(this.state.duration)}
					</span>
				</div>
				<div className="text-sender">
					<TextField
						id="inputField"
						className="input-field"
						underlineShow={false}
						hintText="You can text here"
						onChange={this.onTextChange}
						value={this.state.textToBeSent}
						onKeyDown={e => { if (e.keyCode === 13) this.send() }}
					/>
					<a className="submit-button" onTouchTap={this.send}>SEND</a>
				</div>
			</Paper>
		)
	}
}

Video.propTypes = {
	paused: PropTypes.bool,
	currentTime: PropTypes.number,
	onLoad: PropTypes.func,
	onVideoStateChange: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
	set: state => dispatch(videoActions.set(state)),
	setCurrentTime: currentTime => dispatch(videoActions.seek(currentTime)),
	setPaused: paused => dispatch(videoActions.setPaused(paused))
})

export default connect(state => state.video, mapDispatchToProps)(Video)
