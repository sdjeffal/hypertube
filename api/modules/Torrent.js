/**
 ** Requirements
 **/
const   Config = require('../config/config.js'),
        fs = require('fs'),
        path = require('path');

/**
 ** Database requirements
 **/
const   ObjectId = require('mongoose').Types.ObjectId,
        TorrentModel = require('../Models/Torrent.js'),
        VideoModel = require('../Models/Video.js'),
        SubtitleModel = require('../Models/Subtitle.js');
/**
 ** External dependencies
 **/
const   torrentStream = require('torrent-stream'),
        Subtitle = require('../modules/Subtitle.js'),
        isVideo = require('is-video'),
        isSubtitle = require('is-subtitle'),
        pump = require('pump'),
        fileName = require('file-name'),
        mime = require('mime');


function _getVideos( torId )
{
    return VideoModel.find({ torrentId: torId }, {torrentId: 0, name: 0, filepath: 0}, {sort: {filelength: -1}}).lean().exec()
}

var Torrent = function ( TorrentHash )
{
    let EngineConf = Object.assign({}, Config.torrentEngineOpts)
    return new Promise(
        function( resolve , reject )
        {
            TorrentModel.findOneAndUpdate( { hash: TorrentHash }, { lastSeen: new Date() }, (err, tor) => {
                if (err)
                    reject(new Error(err))
                else if (tor == null)
                    reject(new Error('Torrent not found : ' + TorrentHash))
                else if (tor.nbVideo !== null)
                {
                    console.log('Torrent already loaded : ' + tor.nbVideo + ' videos')
                    resolve(_getVideos(tor._id))
                }
                else   // If torrent was never fetched
                {
                    console.log('Initializing torrent ' + TorrentHash)
                    tor.nbVideo = 0
                    // Arrays of promises
                    let Videos = []
                    let Subtitles = []

                    let SubtitlesToConvert = []
                    // Fetching torrent files
                    EngineConf.path = path.join(EngineConf.path, TorrentHash)
                    var e = torrentStream( tor.magnet, EngineConf)
                    e.on('ready', function()
                    {
                        console.log('Torrent ' + TorrentHash + ' ready for file fetching')
                        e.files.forEach( function(file)
                        {
                            if (file.length < 100)
                                console.log('File too short : ', file.name)
                            else if (isVideo(file.name))
                            {
                                file.deselect()
                                console.log(file.name + ' recognized as video')
                                // Incrementing torrent video counter
                                tor.nbVideo = tor.nbVideo + 1
                                tor.save()
                                // Adding founded video to database
                                Videos.push(
                                    new Promise((resolve,reject) => {
                                        VideoModel.create({
                                            torrentId: tor._id,
                                            filepath: file.path,
                                            filename: file.name,
                                            filelength: file.length,
                                            movieDbId: tor.movieDbId,
                                            status: 'not downloaded'
                                        })
                                        .then( (res) => resolve(res) )
                                        .catch( (err) => reject(err) )
                                    })
                                )
                            }
                            else
                                console.log(file.name + ' not recognized')
                        })
                        if (Videos.length)
                        {
                            Promise.all(Videos).then( () => {

                                linkSubtitleToVideo(tor._id)

                                console.log('Torrent\'s files fetching completed')
                                resolve(_getVideos(tor._id))
                            }, (err) => {
                                console.log('Error adding videos to torrent ' + TorrentHash)
                                reject(new Error(err))
                            })
                        }
                        else
                        {
                            e.destroy()
                            resolve([])
                        }
                    })
                    .on('download', (pcs) => {
                        console.log('Downloading ' + pcs + ' of unknow subtitle')
                    })
                    .on('error', function(err)
                    {
                        tor.nbVideo = null
                        tor.save()
                        e.destroy()
                        console.log('Error fetching file in torrent ' + TorrentHash)
                        reject(new Error(err))
                    })
                }
            })
        }
    )
}

module.exports = Torrent;