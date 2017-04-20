/**
 * Created by team on 3/3/17.
 */

/**
 ** Handles auth.
 **/
const   express = require('express'),
		router = express.Router(),
		passport = require('../config/PassportConfig'),
		Config = require("../config/config"),
		User = require("../Models/User"),
		nodeMailer = require('nodemailer'),
		multer  = require('multer'),
		upload = multer({ dest: "/tmp/" }),
		movePicture = require("../helpers/movePicture"),
		ActivationKey = require('../Models/ActivationKey');

router.get("/isLoggedIn", function(req, res, next){
	if (req.user)
		var result = true;
	else
		var result = false;
	res.send({result: result, user: req.user});
});

/**
 ** Pour se connecter avec facebook, aller sur l'url /auth/facebook
 **/

router.get('/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}));

router.get('/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: `http://${Config.serverInfo.webAddress}:8080/#/login?error=1`,
	}),
	function (req, res){
		res.redirect(`http://${Config.serverInfo.webAddress}:8080/`);
	}
);

router.post('/jwt', function(req, res, next){console.log(req.headers); next()}, passport.authenticate('jwt', { session: false }),
	function(req, res) {
		res.send(req.user);
	}
);

/**
 ** Pour se connecter avec 42, aller sur l'url /auth/42
 **/

router.get('/42', passport.authenticate('oauth2'));

router.get('/42/callback', passport.authenticate('oauth2', {
		failureRedirect: `http://${Config.serverInfo.webAddress}:8080/#/login?error=1`
	}),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect(`http://${Config.serverInfo.webAddress}:8080/`);
	}
);

router.post('/local/register', upload.single('file'), function (req, res, next) {
	function response(status = 200, message){
		res.status(status).send(message);
	}
	if (!req.body){
		response(400, {status: 'error', message: "no request"})
	}
	else if (!req.body.username)
		response(400, {status: 'error', message: "no username"});
	else if (!req.body.email)
		response(400, {status: 'error', message: "no email"});
	else if (!req.body.firstname)
		response(400, {status: 'error', message: "no firstname"});
	else if (!req.body.lastname)
		response(400, {status: 'error', message: "no lastname"});
	else if (!req.body.password)
		response(400, {status: 'error', message: "no password"});
	else if (!req.file)
		response(400, {status: 'error', message: "no picture"});
	else {
		const body = {
			username: req.body.username,
			loginInfo: {
				provider: "Local",
				activated: false,
				password: User.hashPassword(req.body.password),
			},
			hasLocalPicture: true,
			email: req.body.email,
			picturePath: "testPath",
			firstName: req.body.firstname,
			lastName: req.body.lastname,
			moviesViewed: [],
			torrentsViewed: [],
			language: req.body.language || 'en',
		};
		User.findOne({username: req.body.username}).exec()
			.catch(function(err){
				response(500, {status: 'error', message: err});
			})
			.then(function(user){
				if (!user){
					User.findOne({email: req.body.email}).exec()
					.then(function(user) {
						if (!user) {
							movePicture(req.file)
							.then(function (path) {
								body.picturePath = path;
								User.create(body).then((user) => {
									let transporter = nodeMailer.createTransport(Config.mails.config);
									ActivationKey.create({userId: user._id, usage: "confirm"}).catch((error) => {
										res.status(500).send({status: `error`, message: `database error`, error: error});
									})
									.then((activationKey) => {
										const mailOptions = Config.mails.confirmAccount(user, activationKey._id, `noreply@hyperteub.com`);

										transporter.sendMail(mailOptions, (error, info) => {
											if (error)
												response(500, {status: `error`, message: `sendmail failed`, error: error});
											else
												response(200, {status: 'success', message: "account created"});
										});
									})
									.catch((error) => {
										response(500, {status: 'error', message: err});
									});
								},
								(err) => {
									response(500, {status: 'error', message: err});
								});
							}).catch(function (err) {
								response(400, err);
							});
						}
						else
							response(400, {status: 'error', message: "email exists"});
					})
					.catch(function(err){
						response(500, {status: 'error', message: err})
					});
				}
				else
					response(400, {status: 'error', message: "username exists"});
			})
	}
});

/**
 ** Takes a body filled with {username: "myusername", password: "password"}
 **/

router.post('/local/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			res.status(401).send({status: 'error', message: err})
		}
		else if (!user) {
			res.status(401).send({status: 'error', message: 'no such user'});
		}
		else if (user.loginInfo.activated !== true || user.loginInfo.activated === false){
			res.status(401).send({status: 'error', message: 'user unconfirmed'});
		}
		else {
			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}
				else
					res.status(200).send({status: 'success', user: user})
			});
		}
	})(req, res, next);
});

router.post('/local/reset', (req, res, next) => {
	User.findOne({email: req.body.email, 'loginInfo.provider': "Local"})
	.catch((error) => {
		res.status(500).send({status: `error`, message: error});
	})
	.then((user) => {
		if (user){
			let transporter = nodeMailer.createTransport(Config.mails.config);
			ActivationKey.create({userId: user._id, usage: "reset"}).catch((error) => {
				res.status(500).send({status: `error`, message: `database error`, error: error});
			})
			.then((activationKey) => {
				const mailOptions = Config.mails.passwordReset(user, activationKey._id, `noreply@hyperteub.com`);

				transporter.sendMail(mailOptions, (error, info) => {
					if (error)
						res.status(500).send({status: `error`, message: `sendmail failed`, error: error});
					else
						res.send({status: `success`, message: `email sent`});
				});
			});
		}
		else
			res.status(404).send({status: `error`, message: `no such user`});
	});
});

router.post(`/local/reset/:key`, (req, res, next) => {
	ActivationKey.findOne({_id: req.params.key})
	.then((key) => {
		if (!key)
			res.status(404).send({status: `error`, message: `no such key`});
		else if (key.used !== false || key.usage !== "reset"){
			res.status(401).send({status: `error`, message: `key already used or misused`});
		}
		else {
			User.findOne({_id: key.userId})
			.catch((error) => {
				res.status(404).send({status: `error`, message: `no such user`, error: error})
			})
			.then((user) => {
				if (!user)
					res.status(404).send({status: `error`, message: `no such user`});
				else{
					user.loginInfo.password = User.hashPassword(req.body.password);
					user.save()
					.then((user) => {
						if (user)
							res.status(200).send({status: `success`, message: `password changed`, user: user});
						else
							res.status(500).send({status: `error`, message: `database error`});
					})
					.catch((error) => {
						res.status(500).send({status: `error`, message: `database error`, error: error});
					});
					key.used = true;
					key.save().catch(console.log);
				}
			});
		}
	})
	.catch((error) => {
		res.status(404).send({status: `error`, message: `no such key`, error: error});
	});
});

router.get(`/local/confirm/:key`, (req, res, next) => {
	ActivationKey.findOne({_id: req.params.key})
	.then((key) => {
		if (!key)
			res.status(404).redirect(`http://${Config.serverInfo.webAddress}:8080/`);
		else if (key.used !== false || key.usage !== "confirm"){
			res.status(401).redirect(`http://${Config.serverInfo.webAddress}:8080/`);
		}
		else {
			User.findOne({_id: key.userId})
			.then((user) => {
				if (!user)
					res.status(404).redirect(`http://${Config.serverInfo.webAddress}:8080/`);
				else{
					user.loginInfo.activated = true;
					user.save()
					.then((user) => {
						if (user)
							res.redirect(`http://${Config.serverInfo.webAddress}:8080/`);
						else
							res.redirect(`http://${Config.serverInfo.webAddress}:8080/`);
					})
					.catch((error) => {
						res.redirect(`http://${Config.serverInfo.webAddress}:8080/`);
					});
					key.used = true;
					key.save().catch(console.log);
				}
			})
			.catch((error) => {
				res.status(404).redirect(`http://${Config.serverInfo.webAddress}:8080/`);
			});
		}
	})
	.catch((error) => {
		res.status(404).redirect(`http://${Config.serverInfo.webAddress}:8080/`);
	});
});

router.get('/logout', function(req, res){
	req.logout();
	res.send({status: 'success'})
});

module.exports = router;