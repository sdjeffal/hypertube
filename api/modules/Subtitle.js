const   Config = require('../config/config.js'),
        fs = require('fs'),
        CP = require('child_process'),
        path = require('path');

const   ObjectId = require('mongoose').Types.ObjectId,
        SubtitleModel = require('../Models/Subtitle.js');

const   dCE = require('detect-character-encoding'),
        fileName = require('file-name'),
        Subtitle = require('../modules/Subtitle.js');

function add( fp, fn, torId )
{
    return new Promise((resolve, reject) => {
        SubtitleModel.create({ filepath: fp, filename: fn, torrentId: new ObjectId( torId ) }, function (err, sub) {
            if (err)
                reject(err)
            else
                resolve(sub)
        })
    })
}

function convert( subId, basepath )
{
    SubtitleModel.findOne({ _id: subId }, (err, sub) => {
        if (err)
            reject(err)
        else if (sub === null)
            reject(new Error('Subtitle not found'))
        setTimeout(() => {
            let fn = path.join(path.dirname(sub.filepath), fileName(sub.filepath) + '.vtt')
            // We have to know file's character encoding 
            let CE = dCE(fs.readFileSync(path.join(basepath, sub.filepath))).encoding
            try
            {
                let conv = CP.execFileSync('ffmpeg',['-sub_charenc',CE, '-i', path.join(basepath, sub.filepath), '-y' , path.join(basepath, fn)],
                 { 'env': process.env, 'stdio': '/dev/null' })
                if (conv.error)
                    console.log('Unable to convert subtitle file.', conv.error)
                else
                {
                    console.log(path.join(basepath, fn) + ' converted')
                    sub.filepath = fn
                    sub.filename = path.basename(fn)
                    sub.status = "downloaded"
                    sub.save()
                }
            } catch (Err)
            {
                sub.status = "error"
                sub.save()
            }
        }, 1000)
    })
}

function getList( videoId )
{
    return SubtitleModel.find({ videoId: videoId }).lean().exec()
}

function get( subId )
{
    return SubtitleModel.findOne({ _id: subId }).exec()
}

module.exports = {add, convert, get, getList}