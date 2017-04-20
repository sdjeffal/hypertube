/**
 * Created by team on 2/27/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 ** Create the model schema, or how it's going to be stored in the database.
 ** For additional help, see : http://mongoosejs.com/docs/guide.html
 **/

const VideoSchema = new Schema({
    //name: {type: String, required: true },
    torrentId: { type: Schema.Types.ObjectId, ref: 'Torrents', required: true },
	imdbId: {type: String}, // Identifiant IMDB
    filepath: {type: String, required: true },
	filename: {type: String, required: true },
    filelength: {type: Number, required: true },
    status: {type: String, required: true },
	movieDbId: {type: Number, required: true}, // Identifiant TheMovieDatabase
});

mongoose.Promise = global.Promise;

var Video = mongoose.model('Video', VideoSchema);

module.exports = Video;