/**
 * Created by team on 3/22/17.
 */

const   path = require('path'),
		Config = require('../config/config.js'),
		fileSystem = require('fs'),
		mv = require('mv');


/**
 ** @param fileInfo (This is req.file, just pass it as a param)
 ** @returns {Promise} =>   resolve takes a path string "http://localhost:3000/pictures/rgjrijgrgiggrrg.png"
 **                         reject takes an error object {status: error, message: "error message"}
 **/

function movePicture(fileInfo){
	function randomName(){
		function generateRandomString(length) {
			let text = "";
			const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for(let i = 0; i < length; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
				if (i == length - 1)
					return text + path.extname(fileInfo.originalname);
			}
		}
		function checkString(string){
			return fileSystem.existsSync("." + Config.pictures.path + string);
		}

		let string = "";
		while (string == "" || checkString(string) == false){
			string = generateRandomString(20);
			if (checkString(string) == false)
				return string;
		}
	}

	return new Promise(function(resolve, reject){
		const   newPath = Config.__dirname + "/public/" + Config.pictures.path,
				newFileName = randomName();
		if (fileInfo.size <= 0 || fileInfo.size > 2097152)
			reject({status: 'error', message: "file too big"});
		else if (!Config.pictures.authorizedFileTypes.includes(path.extname(fileInfo.originalname)))
			reject({status: 'error', message: "wrong file format"});
		else {
			mv(fileInfo.path, newPath + newFileName, function(err) {
				if (err){
					reject({status: 'error', message: err});
				}
				else {
					resolve(`${Config.serverInfo.url}${Config.pictures.path}${newFileName}`);
				}
			});
		}
	});
}

module.exports = movePicture;