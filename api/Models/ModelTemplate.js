/**
 * Created by team on 2/27/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 ** Create the model schema, or how it's going to be stored in the database.
 ** For additional help, see : http://mongoosejs.com/docs/guide.html
 **/

const myModelSchema = new Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});

/**
 ** Here are two example of middleware
 ** For more documentation, see : http://mongoosejs.com/docs/middleware.html
 ** Note: The save middlewares won't be called if you use update, and vice versa
 **/

myModelSchema.pre('save', function(next) {
	// do whatever you want to happen before the save
	next();
});

myModelSchema.post('save', function(next) {
	// do whatever you want to happen after the save
	next();
});


myModelSchema.methods.findSimilarType = function findSimilarType (cb) {
	return this.model('Animal').find({ type: this.type }, cb);
};

mongoose.Promise = global.Promise

var MyModel = mongoose.model('MyModel', myModelSchema);

module.exports = MyModel;