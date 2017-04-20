
const   TorrentModel = require('../Models/Torrent'),
        VideoModel = require('../Models/Video'),
        path = require('path'),
        fs = require('fs'),
        sPT = require('stream').Passthrough,
        Config = require('../config/config');
const   pump = require('pump'),
        isVideo = require('is-video'),
        isSubtitle = require('is-subtitle'),
        fileName = require('file-name'),
        mime = require('mime'),
        TorrentStream = require('torrent-stream'),
        ffmpeg = require('fluent-ffmpeg');

function isExtAvailable( ext )
{
    if (ext === "mp4" || ext === "webm")
        return true;
    return false;
}

function streamToMP4(source)
{
    let cmd = ffmpeg(source)
        .on('start', function(commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .audioCodec('libmp3lame')
        .audioChannels(2)
        .videoCodec('libx264')
        .outputOptions(['-movflags frag_keyframe','-frag_duration 5000','-preset fast', '-crf 0','-threads 0'])
        .on('error', (err, stdout, stderr) => {
            console.log('Streaming interrupted')
        })
        .format('mp4')
    return cmd
}

function streamToWebM(source)
{
    let cmd = ffmpeg(source)
        .on('start', function(commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .audioCodec('libvorbis')
        .audioChannels(2)
        .videoCodec('libvpx')
        .outputOptions(['-b:v 2000k', '-crf 18','-threads 0'])
        .on('error', (err, stdout, stderr) => {
            console.log('Streaming interrupted')
        })
        .format('webm')
    return cmd
}

var Video = function ( TorrentHash, fileId, ext, opts )
{
    let EngineConf = Object.assign({}, Config.torrentEngineOpts)
    EngineConf.path = path.join(EngineConf.path, TorrentHash)
    let headers = [{name:'Transfer-Encoding', value:'chunked'}, {name:'Content-Type', value: mime.lookup(ext)}]
    return new Promise((resolve, reject) => {
        TorrentModel.findOne({ hash: TorrentHash }, (err, tor) => {
            if (err)
                reject(new Error(err))
            else if (tor === null)
                reject(new Error('Torrent not found : ' + TorrentHash))
            else if (!isExtAvailable(ext))
                reject(new Error('Format unavailable'))
            else
            {
                let requestedFile = path.join(EngineConf.path, fileId + '.' + ext)
                let filestat = (fs.existsSync(requestedFile)) ? fs.statSync(requestedFile) : null ;

                VideoModel.findOne( { torrentId: tor._id, _id: fileId }, (err, vid) => {
                    if (err)
                        reject( new Error(err))
                    else if (vid === null)
                        reject(new Error('Video not found : ' + fileId))
                    else if (vid.status === "downloaded" && filestat !== null && filestat.size > 0)
                    {
                        // Converted file exist already
                        opts.end = filestat.size-1
                        headers[headers.length] = {name:'Accept-Range', value: 'bytes'}
                        headers[headers.length] = {name:'Content-Range', value: 'bytes ' + opts.start + '-' + opts.end + '/' + filestat.size}
                        resolve({'header': headers, 'stream': fs.createReadStream(requestedFile, opts)})
                    }
                    else if (vid.status === "downloaded")
                    {
                        console.log('Original video file exist but need to be converted')
                        let originalFile = path.join(EngineConf.path, vid.filepath)
                        if (ext === 'mp4')
                        {
                            headers[headers.length] = {name:'Accept-Range', value: 'none'}
                            headers[headers.length] = {name:'Content-Range', value: 'bytes 0-'}
                            resolve({'header': headers, 'stream': streamToMP4(originalFile)})
                        }
                        else if (ext === 'webm')
                        {
                            headers[headers.length] = {name:'Accept-Range', value: 'none'}
                            headers[headers.length] = {name:'Content-Range', value: 'bytes 0-'}
                            resolve({'header': headers, 'stream': streamToWebM(originalFile)})
                        }
                    }
                    else
                    {
                        console.log('Video need to be downloaded')
                        headers[headers.length] = {name:'Accept-Range', value: 'none'}
                        headers[headers.length] = {name:'Content-Range', value:'bytes 0-'}
                        let e = TorrentStream(tor.magnet, EngineConf)
                        let DL = new Promise((resolve, reject) => {
                            e.on('ready', () => {
                                e.files.forEach((tfile) => {
                                    if (tfile.name == vid.filename)
                                    {
                                        if (opts.end == -1)
                                            opts.end += tfile.length
                                        let streamFile = tfile.createReadStream(opts)
                                        if (path.extname(vid.filename) == ext)
                                            resolve({'header': headers, 'stream': streamFile})
                                        else if (ext === 'mp4')
                                            resolve({'header': headers, 'stream': streamToMP4(streamFile)})
                                        else if (ext === 'webm')
                                            resolve({'header': headers, 'stream': streamToWebM(streamFile)})
                                    }
                                    else
                                        tfile.deselect()
                                })
                            })
                            .on('download', (pcs) => {
                                console.log('Downloading ' + pcs + ' of ' + vid.filename)
                            })
                            .on('idle', () => {
                                console.log('Download finished of ' + vid.filename)
                                vid.status = "downloaded"
                                vid.save()
                            })
                            .on('error', (err) => {
                                console.log(err)
                                reject(new Error(err))
                            })
                        })
                        DL.then(resolve)
                        .catch(reject)
                    }
                })
            }
        })
    })
}

module.exports = Video;