/**
 * Created by team on 2/27/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 ** Create the model schema, or how it's going to be stored in the database.
 ** For additional help, see : http://mongoosejs.com/docs/guide.html
 **/

const commentSchema = new Schema({
	userId: {type: Schema.Types.ObjectId, required: true},
	torrentHash: {type: String, required: true, maxlength: 40},
	message: {type: String, required: true, maxlength: 500},
	createdAt: { type: Date, default: Date.now }
});

/**
 ** Here are two example of middleware
 ** For more documentation, see : http://mongoosejs.com/docs/middleware.html
 ** Note: The save middlewares won't be called if you use update, and vice versa
 **/

commentSchema.pre('save', function(next) {
	// do whatever you want to happen before the save
	next();
});

mongoose.Promise = global.Promise;

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;