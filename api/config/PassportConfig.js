const   User = require('../Models/User'),
		Config = require('../config/config');

var     passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		FacebookStrategy = require('passport-facebook').Strategy,
		util = require('util'),
		OAuth2Strategy = require('passport-oauth2'),
		JwtStrategy = require('passport-jwt').Strategy,
		ExtractJwt = require('passport-jwt').ExtractJwt,
		request = require('request');



passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	},
	function(username, password, done) {
		User.findOne({
			username: username,
			'loginInfo.provider': "Local",
		}).select({
			_id: 1,
			'loginInfo.password':1,
			'loginInfo.activated':1
		}).exec(function(err, user){
			if (err) {
				return done(err);
			}
			else if (!user) {
				return done(null, false, {username: false});
			}
			else if (!user.validPassword(password)) {
				return done(null, false, {username: true, passport: false});
			}
			else
				return done(null, user);
		});
	}
));

passport.use(new JwtStrategy({
		jwtFromRequest: ExtractJwt.fromHeader("authorization"),
		secretOrKey: Config.session.secret,
	}, function(jwt_payload, done) {
		console.log(jwt_payload);
		User.findOne({id: jwt_payload.sub}, function(err, user) {
			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		})
	}
));

passport.use(new OAuth2Strategy({
		authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
		tokenURL: 'https://api.intra.42.fr/oauth/token',
		clientID: Config.apiKeys.school42.id,
		clientSecret: Config.apiKeys.school42.secret,
		callbackURL: `http://${Config.serverInfo.webAddress}:3000/auth/42/callback`
	},
	function(accessToken, refreshToken, profile, done) {
		request.get('https://api.intra.42.fr/v2/me', {form:{
			access_token: accessToken,
		}}, function(err, httpResponse, body){
			body = JSON.parse(body);

			User.findOne({'loginInfo.externalId': body.id, 'loginInfo.provider': "42School"}).exec(function (err, user){
				if (user)
					done(null, user);
				else {
					let data = {
						username: body.login,
						loginInfo: {
							provider: "42School",
							activated: true,
							externalId: body.id,
							password: User.randomPassword(16),
						},
						hasLocalPicture: false,
						lastName: body.last_name,
						firstName: body.first_name,
						picturePath: body.image_url,
					};
					if (body.email)
						data.email = body.email;
					User.create(data).then(function (user){
						if (user)
							done(null, user);
						else
							return done(null, false, {error: error});
					})
					.catch(function (error){
						return done(null, false, {error: error});
					});
				}
			});
		});
	}
));

passport.use(new FacebookStrategy({
		clientID: Config.apiKeys.facebook.id,
		clientSecret: Config.apiKeys.facebook.secret,
		profileFields: ["id", "birthday", "displayName","first_name", "last_name", "email", "gender", "picture.width(200).height(200)"],
		callbackURL: `http://${Config.serverInfo.webAddress}:3000/auth/facebook/callback`
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOne({'loginInfo.externalId': profile._json.id, 'loginInfo.provider': "Facebook"}).exec(function (err, user){
			let data = {
				username: profile.name.givenName + profile.name.familyName,
				loginInfo: {
					provider: "Facebook",
					activated: true,
					externalId: profile._json.id,
					password: User.randomPassword(16),
				},
				hasLocalPicture: false,
				lastName: profile.name.familyName,
				firstName: profile.name.givenName,
				picturePath: profile.photos[0].value,
			};
			if (profile.emails && profile.emails[0] && profile.emails[0].value)
				data.email = profile.emails[0].value;
			if (user){
				done(null, user);
			}
			else{
				const   User = require('../Models/User');
				User.create(data)
				.then(function (user){
					if (user)
						done(null, user);
					else
						return done(null, false, {error: error});
				})
				.catch(function (error){
					return done(null, false, {error: error});
				});
			}
		});
	}
));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

module.exports = passport;