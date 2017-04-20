/**
 * Created by team on 2/27/17.
 */

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const Config = require("../config/config");
const xregexp = require('xregexp');


const userSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Username required.'],
		unique: true
	},
	loginInfo: {
		provider: {type: String, required: true},
		activated: {type: Boolean, required: true, default: false},
		externalId: {type: String},
		password: {type: String, required: true},
	},
	email: {
		type: String,
		validate: {
			validator: function(v) {
				return new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i').test(v)
			},
			message: '{VALUE} isn\'t a email address',
		},
		unique: true,
		sparse: true
	},
	picturePath: {
		type: String,
		unique: true
	},
	firstName: {
		type: String,
		validate: {
			validator: function(v) {
				return xregexp('^[\\p{L}]+$').test(v);
			},
			message: 'The firstname must contains letters'
		},
		required: [true, 'Firstname required.'],
	},
	lastName: {
		type: String,
		validate: {
			validator: function(v) {
				return xregexp('^[\\p{L}]+$').test(v);
			},
			message: 'The lastname must contains letters'
		},
		required: [true, 'The lastname required.'],
	 },
	hasLocalPicture: {type: Boolean, required: true},
	moviesViewed: [{movieDbId: Number, date: Date }],
	tvShowsViewed: [{movieDbId: Number, date: Date }],
	torrentsViewed: [{hash: String, date: Date }],
	language: {type: String, default: "en", length: 2},
});

userSchema.methods.validPassword = function validPassword (password) {
	return bcrypt.compareSync(password, this.loginInfo.password);
};

userSchema.statics.hashPassword = function hashPassword (password){
	return bcrypt.hashSync(password, Config.hash.salt);
};

userSchema.statics.randomPassword = function randomPassword(length = 16){
	function randomString(length = 16){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < length; i++ ){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
				if (i == length - 1)
					return text;
		}
	}
	return bcrypt.hashSync(randomString(length), Config.hash.salt);
};

userSchema.statics.serializeUser = function() {
	return function(user, cb) {
		cb(null, user.get("_id"));
	};
};

userSchema.statics.deserializeUser = function() {
	var self = this;

	return function(_id, cb) {
		self.findOne({_id: _id}, cb);
	};
};

userSchema.plugin(uniqueValidator, {
	type: 'exists', message: 'Error, {PATH} {VALUE} already exists'
})

mongoose.Promise = global.Promise;

var User = mongoose.model('User', userSchema);

module.exports = User;