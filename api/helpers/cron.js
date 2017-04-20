const cron = require('node-cron')
const fse = require('fs-extra')
const Torrent = require('../Models/Torrent');
const Video = require('../Models/Video');
const User = require('../Models/User');
const Subtitle = require('../Models/Subtitle');
const path = require('path');

const rmcron = function (timing){
	cron.schedule(timing, function(){
		let dateParam = new Date()
		dateParam = new Date(dateParam.setMonth(dateParam.getMonth() - 1))
		const promiseFind = Torrent.find().where('lastSeen').lt(dateParam).exec()
		promiseFind.then((torrents) => {
			torrents.forEach( (torrent) => {
				Video.find({torrentId: torrent._id}, function (err, videos) {
					if (err) {console.log(err)}
					else{
						videos.forEach((video) => {
							video.remove().then((removed) => console.log(`video ${removed._id} removed`))
							.catch((err) => console.log(err))
						})
					}
				})
				Subtitle.find({torrentId: torrent._id}, function (err, subtitles) {
					if (err) {console.log(err)}
					else{
						subtitles.forEach((subtitle) => {
							subtitle.remove().then((removed) => console.log(`subtitle ${removed._id} removed`))
							.catch((err) => console.log(err))
						})
					}
				})
				fse.remove(path.join(Config.torrentEngineOpts.path, torrent.hash), (err) => {
					if (err) {console.log(err)}
			 		console.log('dir delete')
				})
				torrent.remove().then((removed) => console.log(`torrent ${removed._id} removed`))
				.catch((err) => console.log(err))
			})
		})
		.catch((err) => {
			console.log(err)
		})
	});
}

module.exports = rmcron