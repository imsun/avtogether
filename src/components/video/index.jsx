import './style.less'
import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { videoActions } from '../../actions'
import { broadcast, CHAT } from '../../helpers/messages'
import classNames from 'classnames'

import Paper from 'material-ui/Paper'
import Slider from 'material-ui/Slider'
import Popover from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import AvPlayIcon from 'material-ui/svg-icons/av/play-arrow'
import AvPauseIcon from 'material-ui/svg-icons/av/pause'
import FullscreenIcon from 'material-ui/svg-icons/navigation/fullscreen'
import ExitFullscreenIcon from 'material-ui/svg-icons/navigation/fullscreen-exit'
import VolumeUpIcon from 'material-ui/svg-icons/av/volume-up'
import VolumeOffIcon from 'material-ui/svg-icons/av/volume-off'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'

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

const fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen)
const isFullScreen = () => !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement)
const fullScreenChangeEvents = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange']

const initState = {
	textToBeSent: '',
	hideVideoControl: false,
	volumeBarOpen: false
}

class Video extends React.Component {
	constructor(props) {
		super(props)
		this.state = initState

		;[
			'onTextChange', 'send'
			, 'play', 'pause', 'togglePlay'
			, 'handleProgressBarChange', 'updateProgress', 'handleDocumentMouseUp'
			, 'toggleFullScreen', 'fullScreenChangeListener'
			, 'showVideoControl', 'flashVideoControl'
			, 'setHideVideoControlTimer', 'clearHideVideoControlTimer'
			, 'toggleMuted', 'openVolumeBar', 'closeVolumeBar'
			, 'handleVolumeChange'
		]
			.forEach(method => this[method] = this[method].bind(this))
		this.isSeeking = false
		if (fullScreenEnabled) {
			fullScreenChangeEvents.forEach(event => {
				document.addEventListener(event, this.fullScreenChangeListener)
			})
		}
		document.addEventListener('mouseup', this.handleDocumentMouseUp)
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
			if (!this.isSeeking && this.props.videoReady) {
				if (this.target.paused) {
					// hack to force loading unloaded frames while seeking
					this.target.play()
					this.target.pause()
				}
			}
		}
		if (this.props.fullScreen !== prevProps.fullScreen) {
			if (this.props.fullScreen) {
				this.setHideVideoControlTimer()
			} else {
				this.showVideoControl()
			}

		}
		if (this.props.muted !== prevProps.muted) {
			this.target.muted = this.props.muted
		}
		if (this.props.volume !== prevProps.volume) {
			this.target.volume = this.props.volume
		}
	}
	componentDidMount() {
		const target = this.target = this.refs.target
		this.fullScreenWrapper = this.refs.fullScreenWrapper

		target.addEventListener('durationchange', () => {
			console.log('duration change')
			this.props.set({
				duration: target.duration
			})
		})
		target.addEventListener('loadstart', () => {
			console.log('load start')
			if (target.getAttribute('src')) {
				this.props.pushStatus('loading video metadata...')
				// hack for firefox
				this.target.pause()
			}
			target.currentTime = this.props.currentTime
			this.props.set({
				videoReady: false
			})
		})
		target.addEventListener('loadedmetadata', () => {
			this.props.pushStatus('video metadata loaded.')
			this.props.pushStatus('loading video data...')
		})
		target.addEventListener('waiting', () => {
			if (target.getAttribute('src')) {
				this.props.set({
					isLoading: true
				})
			}
		})
		target.addEventListener('canplay', () => {
			this.props.set({
				isLoading: false
			})
		})
		target.addEventListener('loadeddata', () => {
			this.props.clearStatus()
			this.props.set({
				videoReady: true,
				realTime: this.target.currentTime
			})
			if (this.props.paused) {
				target.pause()
			} else {
				target.play()
			}
		})
		target.addEventListener('timeupdate', this.updateProgress)
		target.addEventListener('ended', () => {
			if (!target.loop) {
				this.props.set({
					currentTime: target.currentTime
				})
				this.props.set({
					currentTime: 0,
					paused: true
				})
			}
		})
		this.props.onLoad && this.props.onLoad(this)
	}
	componentWillUnmount() {
		this.reset()
		if (fullScreenEnabled) {
			fullScreenChangeEvents.forEach(event => {
				document.removeEventListener(event, this.fullScreenChangeListener)
			})
		}
	}
	reset() {
		this.target.src = ''
		this.target.load()
		if (this.updateTimer) {
			clearInterval(this.updateTimer)
			this.updateTimer = null
		}
		this.setState(initState)
		this.props.reset()
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
	handleProgressBarChange(e, currentTime) {
		this.props.set({
			realTime: currentTime
		})
		this.target.currentTime = currentTime
	}
	updateProgress() {
		const duration = this.target.duration || this.props.duration
		const realTime = this.target.currentTime
		if (this.props.videoReady) {
			this.props.set({ duration, realTime })
		}
	}
	handleDocumentMouseUp() {
		if (this.isSeeking) {
			this.isSeeking = false
			this.props.seek(this.props.realTime)
		}
	}
	play(time) {
		this.togglePlay(true, time)
	}
	pause(time) {
		this.togglePlay(false, time)
	}
	togglePlay(start = this.target.paused, time = this.target.currentTime) {
		this.props.set({
			paused: !start,
			currentTime: time
		})
	}
	toggleFullScreen() {
		if (!this.props.fullScreen) {
			if (this.fullScreenWrapper.requestFullscreen) this.fullScreenWrapper.requestFullscreen()
			else if (this.fullScreenWrapper.mozRequestFullScreen) this.fullScreenWrapper.mozRequestFullScreen()
			else if (this.fullScreenWrapper.webkitRequestFullScreen) this.fullScreenWrapper.webkitRequestFullScreen()
			else if (this.fullScreenWrapper.msRequestFullscreen) this.fullScreenWrapper.msRequestFullscreen()
		} else {
			if (document.exitFullscreen) document.exitFullscreen()
			else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
			else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen()
			else if (document.msExitFullscreen) document.msExitFullscreen()
		}
	}
	fullScreenChangeListener() {
		this.props.set({
			fullScreen: isFullScreen(),
			hideVideoControl: false
		})
	}
	showVideoControl() {
		this.clearHideVideoControlTimer()
		this.setState({
			hideVideoControl: false
		})
	}
	flashVideoControl() {
		if (!this.props.fullScreen) {
			return
		}
		this.setHideVideoControlTimer()
		this.setState({
			hideVideoControl: false
		})
	}
	setHideVideoControlTimer() {
		this.clearHideVideoControlTimer()
		if (this.props.fullScreen) {
			this.__hideVideoControlTimer = setTimeout(() => {
				if (this.props.fullScreen) {
					this.setState({
						hideVideoControl: true
					})
				}
			}, 1000)
		}
	}
	clearHideVideoControlTimer() {
		if (this.__hideVideoControlTimer) {
			clearTimeout(this.__hideVideoControlTimer)
		}
	}
	toggleMuted() {
		this.props.set({
			muted: !this.props.muted
		})
	}
	openVolumeBar() {
		if (!this.state.volumeBarOpen) {
			this.setState({
				volumeBarOpen: true
			})
		}
	}
	closeVolumeBar() {
		this.setState({
			volumeBarOpen: false
		})
	}
	handleVolumeChange(e) {
		this.props.set({
			volume: e.target.value
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
		const iconMedium = {
			width: 24,
			height: 24
		}
		return (
			<Paper className={classNames('video', {
				'full-screen': this.props.fullScreen,
				'hide-video-control': this.state.hideVideoControl
			})}>
				<div ref="fullScreenWrapper" className="full-screen-wrapper">
					<video
						ref="target"
						onTouchTap={this.flashVideoControl}
						onMouseMove={this.flashVideoControl}
					/>
					<CircularProgress
						className={classNames('video-loader', {
							hidden: !this.props.isLoading
						})}
					/>
					<ul className="video-status">
						{
							this.props.statusStack.map((status, index) => (
								<li key={`status${index}`}>{status}</li>
							))
						}
					</ul>
					<div
						className="text-sender"
						onMouseOver={this.showVideoControl}
					>
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
					<div
						className="control-bar"
						onMouseOver={this.showVideoControl}
					>
						<IconButton
							style={smallStyle}
							iconStyle={iconLarge}
							onTouchTap={() => this.togglePlay()}
							disabled={!this.props.videoReady}
						>
							{
								this.props.paused
									? <AvPlayIcon />
									: <AvPauseIcon />
							}
						</IconButton>
						<Slider
							className="progress-bar"
							min={0}
							max={this.props.duration || 1}
							value={this.props.duration > this.props.realTime ? this.props.realTime : 0}
							onChange={this.handleProgressBarChange}
							disabled={!this.props.videoReady}
							onMouseDown={() => this.isSeeking = true}
						/>
						<span className="video-time">
							{toHHMMSS(this.props.realTime)}/{toHHMMSS(this.props.duration)}
						</span>
						<div>
							<IconButton
								style={smallStyle}
								iconStyle={iconMedium}
								onTouchTap={this.toggleMuted}
								onMouseOver={this.openVolumeBar}
								onMouseLeave={this.closeVolumeBar}
							>
								{
									this.props.muted
										? <VolumeOffIcon />
										: <VolumeUpIcon />
								}
							</IconButton>
							<Paper
								className={classNames('volume-bar', {
									hidden: !this.state.volumeBarOpen
								})}
								onMouseOver={this.openVolumeBar}
								onMouseLeave={this.closeVolumeBar}
							>
								<input
									className="volume-slider"
									type="range"
									min="0"
									max="1"
									step="0.1"
									value={this.props.volume}
									disabled={this.props.muted}
									onChange={this.handleVolumeChange}
								/>
							</Paper>
						</div>
						{
							fullScreenEnabled && (
								<IconButton
									style={smallStyle}
									iconStyle={iconMedium}
									onTouchTap={this.toggleFullScreen}
								>
									{
										this.props.fullScreen
											? <ExitFullscreenIcon />
											: <FullscreenIcon />
									}
								</IconButton>
							)
						}
					</div>
				</div>
			</Paper>
		)
	}
}

Video.propTypes = {
	paused: PropTypes.bool,
	currentTime: PropTypes.number,
	onLoad: PropTypes.func
}

export default connect(
	state => state.video,
	dispatch => bindActionCreators(videoActions, dispatch)
)(Video)
