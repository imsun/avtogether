<h1 align="center">
  <br>
  <a href="http://avt.imsun.net"><img src="http://avt.imsun.net/assets/avt-logo.png" alt="AvTogether" width="200"></a>
  <br>
  AvTogether
  <br>
  <br>
</h1>

This is an experimental project to share local videos with your friends via WebRTC, based on [WebTorrent](https://webtorrent.io/).

[Check out this site](http://avt.imsun.net)

## Features

- ### P2P Streaming

	Videos will be transferred between peers via WebRTC. 

- ### Progress Syncing

	Operations, such as plays / pauses / forwards / backwards, can be synchronized between clients simultaneously.

- ### Real-Time Communicating

	You can comment anytime while watching.

## To Run

1. ### Create `src/config.js`
	
	**AvTogether** uses [LeanCloud](https://leancloud.cn/) as the backend to save room information. To setup your own server, you may want to modify `src/config.js`:  

	```js
	export default {
		leancloud: {
			appId: '', // `appId` from LeanCloud
			appKey: '', // `appKey` from LeanCloud  
			region: '' // 'cn' or 'us'
		}
	}
	```
1. ### Run it

	To run a dev server for debugging purpose:

	```sh
	$ npm run dev
	```

	To run a production server:

	```sh
	$ npm run build
	$ http-server -p 8080
	```

## Use Your Own Tracker

A tracker is a special type of server which is used to assist in the communication between peers. By default **AvTogether** uses the following trackers:

- udp://tracker.openbittorrent.com:80
- udp://tracker.internetwarriors.net:1337
- udp://tracker.leechers-paradise.org:6969
- udp://tracker.coppersurfer.tk:6969
- udp://exodus.desync.com:6969
- wss://tracker.webtorrent.io
- wss://tracker.btorrent.xyz
- wss://tracker.openwebtorrent.com
- wss://tracker.fastcast.nz

To add a custom tracker server you may modify the `src/config.js`:

```js
export default {
	torrent: {
		trackers: [
			'ws://your.tracker.address'
		]
	}
}
```

You are able to run a tracker on your own server. Please refer to [avtogether-tracker](https://github.com/imsun/avtogether-tracker).

## License

MIT
