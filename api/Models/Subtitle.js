
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 ** Create the model schema, or how it's going to be stored in the database.
 ** For additional help, see : http://mongoosejs.com/docs/guide.html
 **/

const SubtitleSchema = new Schema({
    filepath: {type: String, required: true},
    filename: {type: String, required: true},
    torrentId: {type: Schema.Types.ObjectId, required: true},
    videoId: {type: Schema.Types.ObjectId, default: null},
    language: {type: String, length: 2},
    status : {type: String, default: "not downloaded"}
});

var Subtitle = mongoose.model('Subtitle', SubtitleSchema);

module.exports = Subtitle;