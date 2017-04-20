/**
 * Created by team on 2/25/17.
 */

/**
 **
 ** If the data you want to add fits in an existing category, put it in it, be it a string or an object with other
 ** properties.
 ** If not, create another category equal to an object with your data as a property;
 **
 **/
const os = require('os'),
	path = require('path');

const Config = {
	__dirname: __dirname + "/../",
	db: {
		username: "hypertube",
		password: "hypertube",
		databaseName: "hypertube",
		host: "localhost",
		port: "27017"
	},
	serverInfo: {
		webAddress: "localhost",
		url: "http://localhost:3000/"
	},
	pictures: {
		/** This is the path starting from the public directory **/
		path: `pictures/`,
		authorizedFileTypes: [".png", ".jpeg", ".bpm", ".jpg", '.gif']
	},
	hash: {
		salt: "$2a$10$FvNsAwrkg2LXm89gCS3kfO"
	},
	session: {
		secret: "GibMeStuff"
	},
	apiKeys: {
		theMovieDatabase: {
			key: "0c0f25c6f59e6aac5636d0c4899c81e5",
		},
		facebook: {
			id: "697366577108902",
			secret: "38ff702d61be320a6270414327d5b7c2",
		},
		school42: {
			id: "4ff6a3bcde6000cbfffb3fa5b3f22e3087afe0a8be1e4767a10e0e575775c39a",
			secret: "9a6209fa0dc8805864044ec275cada7fe660b4b24cb0b987472cb0d12a2a599d",
		},
	},
	mails: {
		config: {
			service: 'gmail',
			auth: {
				user: "matchaaaaaaaaaaa@gmail.com",
				pass: "matchamatcha"
			},
		},
		passwordReset(user, key, from){
			if (user.language === "fr") {
				return {
					from: `"Hyperteub" <${from}>`,
					to: user.email,
					subject: `Reinitialisation du mot de passe de votre compte`,
					text: `Merci d'ouvrir ce lien pour pouvoir acceder a votre compte : http://localhost:8080/#/profile/resetPassword?id=${key}`
				};
			}
			else {
				return {
					from: `"Hyperteub" <${from}>`,
					to: user.email,
					subject: `Password reset for your account`,
					text: `Pls click on the link to reset your password and go back to pirate movies : http://localhost:8080/#/profile/resetPassword?id=${key}`
				};
			}
		},
		confirmAccount(user, key, from){
			if (user.language === "fr") {
				return {
					from: `"Hyperteub" <${from}>`,
					to: user.email,
					subject: `Confirmation de votre compte`,
					text: `Merci d'ouvrir ce lien pour pouvoir valide votre compte : http://localhost:3000/auth/local/confirm/${key}`
				};
			}
			else {
				return {
					from: `"Hyperteub" <${from}>`,
					to: user.email,
					subject: `Confirm your account`,
					text: `Pls click on the link confirm your account : http://localhost:3000/auth/local/confirm/${key}`
				};
			}
		}
	},
	torrentEngineOpts: {uploads: 0, connections: 30, tmp: path.join(os.tmpdir(), path.sep), path: path.join('/tmp', os.userInfo().username, path.sep) }
};


module.exports = Config;