const   ObjectId = require('mongoose').Types.ObjectId,
        SubtitleModel = require('../Models/Subtitle.js');

function getList( videoId )
{
    return SubtitleModel.find({ videoId: videoId }).lean().exec()
}

function get( subId )
{
    return SubtitleModel.findOne({ _id: subId }).exec()
}

module.exports = {get, getList}