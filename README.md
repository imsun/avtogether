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

	Video will be transfered via WebRTC. Only peers you connected to can access the video.

- ### Progress Syncing

	Operations will be applied to all when anyone plays / pauses / forwards / backwards the video.

- ### Real-Time Communicating

	You can comment anytime while watching.

## To Run

1. ### Create `src/config.js`
	
	**AvTogether** now is using [LeanCloud](https://leancloud.cn/) as the backend to save room information. So you need to create `src/config.js` to configure your LeanCloud as following:  

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

	Yout can run a dev server:

	```sh
	$ npm run dev
	```

	Or build it and run an http server:

	```sh
	$ npm run build
	$ http-server -p 8080
	```

## Use Your Own Tracker

By default **AvTogether** uses the following trackers:

- udp://tracker.openbittorrent.com:80
- udp://tracker.internetwarriors.net:1337
- udp://tracker.leechers-paradise.org:6969
- udp://tracker.coppersurfer.tk:6969
- udp://exodus.desync.com:6969
- wss://tracker.webtorrent.io
- wss://tracker.btorrent.xyz
- wss://tracker.openwebtorrent.com
- wss://tracker.fastcast.nz

But sometimes they are not accessiable, especially in China. You can run an [avtogether-tracker](https://github.com/imsun/avtogether-tracker) on your own server and add it to `src/config.js`:

```js
export default {
	torrent: {
		trackers: [
			'ws://your.tracker.address'
		]
	}
}
```

## License

MIT