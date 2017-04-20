/**
 ** This file will handle routes on /movies/
 ** This includes:  Display of a movie.
 **                 All search is to be done in /search/. All DB queries have to be done trough sockets.
 **/

const express = require('express');
const router = express.Router();
const pirateBay = require('thepiratebay');
const extraTorrentApi = require('extratorrent-api').Website
const extraTorrent = new extraTorrentApi();
const isohuntApi = require('isohunt-api');
const lodash = require('lodash');
const bytes = require('bytes');
const parseTorrent = require('parse-torrent');
const Torrent = require('../Models/Torrent');
const Auth = require('../middlewares/Auth');
const htmlEntities = require('../helpers/htmlEntities');
const torrentSizeMax = '2147483648';
const torrentSeedMin = 15;

router.get('/:category/:title/:year/:movieDbId', Auth.isLoggedIn, (req, res) => {

	const year = (new RegExp("^\\d\\d\\d\\d$", "g").test(req.params.year)) ? req.params.year : null;
	const title = (year) ? `${decodeURIComponent(req.params.title)} ${year}` : `${req.params.title}`;
	const movieDbId = (new RegExp("^\\d+$", "g").test(req.params.movieDbId)) ? req.params.movieDbId : null;
	const regexSize = new RegExp(/(GB|MB|KB|TB){1}/i)
	const regexHash = new RegExp(/^([a-f]|\d){40}$/i)

	if (!movieDbId){
		return res.status(301).json({message: 'ValidationError', err: 'movieDbId isn\'t valid', status: 'error'})
	}
	const promiseExtratorrent = new Promise((resolve, reject) => {
		console.log('promiseExtratorrent');

		let category = (req.params.category == 'tv') ? 'tv' : 'movies'
		extraTorrent.search({
			with_words: title,
			page: 1,
			category: category
		})
		.then((results) => {
			if (results.total_results == 0)
				resolve([])
			else{
				let torrents = []
				results.results.forEach((result) => {
					if (parseInt(result.seeds) >= torrentSeedMin && result.magnet && typeof result.size === 'string'){
						let val = parseFloat(result.size)
						let unit = regexSize.exec(result.size)
						val = (typeof val === 'number' && !isNaN(val) && unit[0] && unit[0] !== 'undefined') ? bytes.parse(val + unit[0]) : null;
						if (val && val <= torrentSizeMax){
							let torrent = {}
							torrent.category = category
							torrent.movieDbId = req.params.movieDbId
							torrent.title = result.title
							torrent.magnet = htmlEntities(result.magnet)
							torrent.hash = parseTorrent(result.magnet).infoHash
							torrent.seeders = parseInt(result.seeds)
							torrent.leechers = result.leechers
							torrent.provide = 'extraTorrent'
							if (regexHash.test(torrent.hash))
								torrents.push(torrent)
						}
					}
				})
				resolve(torrents)
			}
		})
		.catch((err) => {
			err.where = 'promise ExtraTorrent';
			console.log(`ExtraTorrent is down`);
			resolve([]);
		})
	})

	const promiseIsohunt = new Promise((resolve, reject) => {
		console.log('promiseIsohunt');

		let torrents = []
		let category = (req.params.category == 'tv') ? 'tv' : 'movies'

		isohuntApi.search(title, {category: category})
		.then((torrentList) => {
			let promiseMagnet = []
			torrentList.forEach(torrentInfo => {
				if (torrentInfo.infoUrl && parseInt(torrentInfo.seeders) >= torrentSeedMin && typeof torrentInfo.size === 'string' && bytes.parse(torrentInfo.size) <= torrentSizeMax){
					promiseMagnet.push(
						new Promise((resolve, reject) => {
							isohuntApi.getMagnetUrl(torrentInfo.infoUrl)
							.catch((err) => {
								err.where = 'promise Magnet isohunt'
								reject(err)
							})
							.then(magnet => {
								if (magnet){
									let torrent = {}
									torrent.movieDbId = req.params.movieDbId
									torrent.title = torrentInfo.title
									torrent.category = category
									torrent.seeders = parseInt(torrentInfo.seeders)
									torrent.leechers = '?'
				            		torrent.magnet = htmlEntities(magnet)
									torrent.provide = 'isohunt'
									torrent.hash = parseTorrent(magnet).infoHash
									if (regexHash.test(torrent.hash))
										resolve(torrent)
									else
										resolve(null)
								}
								else{
									resolve(null)
								}
			        		})
						})
					)
				}
    		});
			Promise.all(promiseMagnet).then((results) => {
				results = lodash.compact(results);
				resolve(results);
			}).catch((err) => {reject(err)});
		})
		.catch((err) => {
			err.where = 'promise Isohunt';
			console.log(`Isohunt is down`);
			resolve([]);
		});
	})

	const promisePiratebay = new Promise((resolve, reject) => {
		console.log('promisePiratebay');
		let category = (req.params.category == 'tv') ? 205 : 201
		pirateBay.search(title, {
			category: category,
			orderBy: 'seeds',
			sortBy: 'desc'
		})
		.then((results) => {
			let torrents = []
			for (result of results) {
				if (typeof result.size === 'string' && parseInt(result.seeders) >= torrentSeedMin) {
					result.size = result.size.replace('i', '');
					let val = parseFloat(result.size)
					let unit = regexSize.exec(result.size)
					val = (typeof val === 'number' && !isNaN(val) && unit[0] && unit[0] !== 'undefined') ? bytes.parse(val + unit[0]) : null;
					if (val && val <= torrentSizeMax){
						let torrent = {}
						torrent.movieDbId = req.params.movieDbId
						torrent.title = result.name
						torrent.category = (req.params.category == 'tv') ? 'tv' : 'movies'
						torrent.magnet = htmlEntities(result.magnetLink)
						torrent.hash = parseTorrent(result.magnetLink).infoHash
						torrent.seeders = parseInt(result.seeders)
						torrent.leechers = parseInt(result.leechers)
						torrent.provide = 'thepiratebay'
						if (regexHash.test(torrent.hash))
							torrents.push(torrent)
					}
				}
			}
			resolve(torrents)
		})
		.catch((err) => {
			err.where = 'promise Piratebay';
			console.log(`Thepiratebay is down`);
			resolve([]);
		})
	})

	Promise.all([promiseExtratorrent, promisePiratebay, promiseIsohunt])
		.then((results) => {
			const nbrTorrentMax = 5
			results = lodash.flatten(results)
			if (results.length > 0){
				//filter hash uniq
				results = lodash.uniqBy(results, 'hash')
				//filter by language
				let resultsWithLanguage = lodash.filter(results, (e) => {
					let pos = -1;
					if (req.user.language == 'fr')
					    pos = new RegExp(/([^a-z])(FR|FRENCH|VF|TRUEFRENCH){1}([^a-z])/i).test(e.title)
					else
						pos = new RegExp(/([^a-z])(EN|ENGLISH){1}([^a-z])/i).test(e.title)
					return pos;
				})
				// console.log('resultsWithLanguage');
				// resultsWithLanguage.forEach((e) => console.log(e.title))
				if (resultsWithLanguage.length > 0 && resultsWithLanguage.length < nbrTorrentMax){
					results = lodash.difference(results, resultsWithLanguage)
					results = lodash.orderBy(results, ['seeders'], ['desc'])
					results = resultsWithLanguage.concat(results);
				}
				else if (resultsWithLanguage.length >= nbrTorrentMax){
					results = resultsWithLanguage;
				}
				// console.log('results');
				//results.forEach((e) => console.log(e.title))
				//sorting by seeders
				results = lodash.orderBy(results, ['seeders'], ['desc'])
				//limit array torrents at nbrTorrentMax
				if (results.length > nbrTorrentMax)
					results.length = nbrTorrentMax;
				// for each result, it search if torrent exists in db else it insert
				let promisesFind = []
				for (const result of results){
					promisesFind.push(
						new Promise((res, rej) => {
							Torrent.findOne({'hash': result.hash}).exec()
							.then((torrent) => {
								if (torrent)
									res(result)
								else{
									torrent = new Torrent(result)
									torrent.save()
									.then((saved) => {res(result)})
									.catch((err) => {rej(err)})
								}
							})
							.catch((err) => {rej(err)})
						})
					)
				}
				Promise.all(promisesFind).then((results) => {
					res.json({message: 'OK', torrents: results, status: 'success'})
				}).catch((err) => {
					err.where = 'promisesFind'
					res.status(500).json({message: 'Internal Server Error', err: err, status: 'error'})
				})
			}
			else
				res.json({message: 'ZERO RESULTS', torrents: results, status: 'success'})
		})
		.catch((err) => {
			res.status(500).json({message: 'Internal Server Error', err: err, status: 'error'})
		})
})

module.exports = router