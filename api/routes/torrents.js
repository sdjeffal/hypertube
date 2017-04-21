/**
 * Created by team on 3/16/17.
 */

const express = require('express')
const router = express.Router()
const Auth = require('../middlewares/Auth')
const Config = require('../config/config')
const Torrent = require('../modules/Torrent')
const TorrentModel = require('../Models/Torrent')
const Subtitle = require('../modules/Subtitle')
const Video = require('../modules/Video')
const mime = require('mime')
const pump = require('pump')
const VideoModel = require('../Models/Video.js')
const OS = require("opensubtitles-api")
const OpenSubtitles = new OS('OSTestUserAgentTemp')
const lodash = require("lodash")
const fs = require('fs')
const path = require('path')
const srtToVtt = require('srt-to-vtt')
const request = require('request');
const SubtitleModel = require('../Models/Subtitle')


router.get('/:hash', function(req, res) {
    Torrent(req.params.hash)
    .then( (videos) => {
        res.json( { response: videos } )
        res.end()
    })
    .catch( (err) => {
        console.log(err.message)
        res.status(404).end()
    })
});

router.get('/subtitles/:fileId', Auth.isLoggedIn, function(req, res) {
    //search video by videoId
    console.log('search subtitle in database');
    Subtitle.getList( req.params.fileId )
    .then( (sub) => {
        if (sub.length < 1){
            console.log(`no subtitle in database`);
            VideoModel.findOne({ _id: req.params.fileId }).exec().then((video) => {
                if (video){
                    //search torrent by video.torrentId
                    TorrentModel.findOne({ _id: video.torrentId }).exec().then((torrent) => {
                        if (torrent){
                            //search subtitle on opensubtitle by video.filename
                            console.log('search subtitle on opensubtitle');
            				OpenSubtitles.search({
            	                sublanguageid: 'all',
            	                filename: video.filename,
            	                limit: 'best',
            	                extensions: ['srt', 'vtt'],
            	                gzip: false
            	            }).then((subtitles) => {
                                if (subtitles){
                                    console.log('subtitles found on opensubtitle');
                                    //filter by language fr and en
                                    subtitles = lodash.pick(subtitles, ['fr', 'en'])
                					let promisesSubtitles = []
                                    //for each subtitle, create pormise: readstream, if .srt convert .vtt and writestream
                	                for (let subtitle in subtitles) {
                	                    if (subtitles.hasOwnProperty(subtitle)) {
                	                        let pathSubtitle = path.join(Config.torrentEngineOpts.path, torrent.hash, `${video.filename}.${subtitle}.vtt`);
                							promisesSubtitles.push(
                								new Promise((resolve, reject) => {
                									const readStream = request({url: subtitles[subtitle].url, encoding: null}).on('error', (err) => {resolve()})
                			                        if (path.extname(subtitles[subtitle].filename) == '.srt'){
                			                            readStream.pipe(srtToVtt()).on('error', (err) => {
                                                            console.log(err)
                                                            resolve()
                                                        })
                			                        }
                			                        if(path.extname(subtitles[subtitle].filename) == '.vtt' || path.extname(subtitles[subtitle].filename) == '.srt'){
                			                            readStream.pipe(fs.createWriteStream(pathSubtitle)).on('error', (err) => {
                                                            console.log(err)
                                                            resolve()
                                                        })
                			                            .on('close', () => {
                											subtitles[subtitle].videoId = video._id
                											subtitles[subtitle].torrentId = torrent._id
                											subtitles[subtitle].filename = `${video.filename}.${subtitle}.vtt`
                											subtitles[subtitle].filepath = pathSubtitle
                                                            subtitles[subtitle].language = subtitle
                                                            subtitles[subtitle].status = "downloaded"
                                                            console.log(`${subtitles[subtitle].filename} downloaded`);
                											resolve({[subtitle]: subtitles[subtitle]})
                			                            })
                			                        }
                								})
                							)
                	                    }
                	                }
                                    //execution sync all promiseSubtitle where download subtitles
                					Promise.all(promisesSubtitles).then(subtitles => {
                                        let promiseSave = []
                                        //remove value null or undefined
                						subtitles = lodash.compact(subtitles)
                                        subtitles.forEach((subtitle) => {
                                            //for each subtitle, save in database
                                            for (let language in subtitle) {
                                                if (subtitle.hasOwnProperty(language)) {
                                                    promiseSave.push(
                                                        new Promise((resolve, reject) => {
                                                            let subtitleModel = new SubtitleModel(subtitle[language])
                                                            subtitleModel.save()
                                                            .then(save => {
                                                                console.log(`subtitle ${save.filename} saved in databse`);
                                                                resolve(save)
                                                            })
                                                            .catch(err => {console.log(err)})
                                                        })
                                                    )
                                                }
                                            }
                                        })
                                        //execution sync all promiseSave where save subtitles in DB
                                        Promise.all(promiseSave).then(saves => {
                                            //after save, send all subtitles in response
                                            res.json({response: saves})
                    						res.end()
                                        }).catch( (err) => {
                        	                console.log(err)
                        	                res.status(404).end()
                        	            })
                					})
                                }
                                else {
                                    console.log(`the subtitles not found on opensubtitle.`)
                                    res.status(404).end()
                                }
            	            })
            	            .catch( (err) => {
            	                console.log(err.message)
            	                res.status(404).end()
            	            })
                        }
                        else{
                            console.log(`torrentId ${video.torrentId} not found in Database.`)
                            res.status(404).end()
                        }
        			}).catch( (err) => {
                        console.log(err.message)
                        res.status(404).end()
                    })
                }
                else{
                    console.log(`videoId: ${req.params.fieldId} not found in Database.`)
                    res.status(404).end()
                }
            })
            .catch( (err) => {
                console.log(err.message)
                res.status(404).end()
            })
        }
        else {
            console.log(`subtitle found in Database.`)
            res.json( { response: sub } )
            res.end()
        }
    })
    .catch( (err) => {
        console.log(err.message)
        res.status(404).end()
    })
})

router.get('/subtitles/:subId/sub.vtt', function(req, res) {
    Subtitle.get( req.params.subId )
    .then( (subtitle) => {
        TorrentModel.findOne({_id: subtitle.torrentId}).then((torrent) => {
            if (subtitle)
                res.sendFile(`${subtitle.filepath}`);
            else
                res.status(404).end()
        })
    })
    .catch( (err) => {
        console.log(err.message)
        res.status(404).end()
    })
})

router.get('/:hash/:fileId.:ext', Auth.isLoggedIn, function(req, res) {

    let options = {}
    if (req.headers.range)
    {
        let start = parseInt(req.headers.range.slice(req.headers.range.indexOf("bytes=")+6, req.headers.range.indexOf('-')))
        let end = parseInt(req.headers.range.slice(req.headers.range.indexOf('-')+1, req.headers.range.length))
        if (isNaN(end))
            end = -1
        else
            res.statusCode = 206
        options  = {'start': start, 'end': end}
    }
    Video(req.params.hash, req.params.fileId, req.params.ext, options)
    .then( ({header, stream}) => {
        //res.setHeader('Accept-Ranges', 'bytes')
        header.forEach((h) => {
            //console.log(h)
            res.setHeader(h.name, h.value)
        })

        TorrentModel.findOne({hash: req.params.hash}).then((torrent) => {
            torrent.lastSeen = Date.now();
            torrent.save().catch((err) => {console.log(err)})

            if (torrent.category === 'movies' && !req.user.moviesViewed.find((movie) => {return movie.movieDbId == torrent.movieDbId}))
                req.user.moviesViewed.push({movieDbId: torrent.movieDbId, date: Date.now()});
            else if (torrent.category === 'tv' && !req.user.tvShowsViewed.find((tv) => {return tv.movieDbId == torrent.movieDbId}))
	            req.user.tvShowsViewed.push({movieDbId: torrent.movieDbId, date: Date.now()});

            req.user.torrentsViewed.push({hash: torrent.hash, date: Date.now()});

            req.user.save().then((saved) => {req.user = saved;}).catch((err) => {console.log(err)})

        });

        stream.pipe(res)
        res.on('close', function() {
            stream.kill()
        })
    })
    .catch( (err) => {
        console.log(err)
        res.status(404).end()
    })
})

module.exports = router