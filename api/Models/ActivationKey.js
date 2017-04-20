/**
 * Created by team on 3/25/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 ** Create the model schema, or how it's going to be stored in the database.
 ** For additional help, see : http://mongoosejs.com/docs/guide.html
 **/

const activationKeySchema = new Schema({
	userId: {type: Schema.Types.ObjectId, required: true},
	createdAt: { type: Date, default: Date.now },
	usage: {type: String, required: true},
	used: {type: Boolean, default: false}
});

mongoose.Promise = global.Promise;
var ActivationKey = mongoose.model('ActivationKey', activationKeySchema);

module.exports = ActivationKey;