/**
 * Created by team on 2/27/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 ** Create the model schema, or how it's going to be stored in the database.
 ** For additional help, see : http://mongoosejs.com/docs/guide.html
 **/

const torrentSchema = new Schema({
    movieDbId: {type: Number, required: true}, // Identifiant IMDB
	category: {type: String, required: true},
	magnet: {type: String, required: true, unique: true},
	hash: {type: String, required: true, unique: true, length: 40},
    nbVideo: {type: Number, default: null},
	lastSeen: {type: Date, default: Date.now},
});

mongoose.Promise = global.Promise;

var Torrent = mongoose.model('Torrent', torrentSchema);

module.exports = Torrent;