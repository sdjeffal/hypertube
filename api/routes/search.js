/**
 ** This file will handle routes on /search/
 ** This includes:  Display of the search page.
 **/

const   express = require('express'),
		Config = require('../config/config'),
		Auth = require('../middlewares/Auth'),
		imdb = require('imdb-api'),
		MovieDB = require('moviedb')(Config.apiKeys.theMovieDatabase.key);
		router= express.Router();

router.get('/list/:category/:title/:page', Auth.isLoggedIn,(req, res) => {
	function addSeen(movies){
		return new Promise((resolve, reject) => {
			let log;

			if (!movies || !movies.results || movies.results.length == 0){
				reject();
			}
			else {
				let i =  movies.results.length;
				if (req.params.category === `Movie` || req.params.category === `movie`){
					for (let movieKey in movies.results) {
						const movie = movies.results[movieKey];

						if ((log = req.user.moviesViewed.find((watched) => {
								return watched.movieDbId == movie.id;
							}))) {
							movie.seen = {seen: true, date: log.date};
							if (i - 1 == movieKey + 1)
								resolve(movies);
						}
						else {
							movie.seen = {seen: false};
							if (i - 1 == movieKey)
								resolve(movies);
						}
					}
				}
				else {
					for (let tvShowKey in movies.results) {
						const tvShow = movies.results[tvShowKey];

						if ((log = req.user.tvShowsViewed.find((watched) => {
								return watched.movieDbId == tvShow.id;
							}))) {
							tvShow.seen = {seen: true, date: log.date};
							if (i - 1 == tvShowKey + 1)
								resolve(movies);
						}
						else {
							tvShow.seen = {seen: false};
							if (i - 1 == tvShowKey)
								resolve(movies);
						}
					}
				}
			}
		});
	}

	let category;
	if (req.params.category === "movie" || req.params.category === "Movie")
		category = "Movie";
	else if (req.params.category === "tv" || req.params.category === "Tv")
		category = "Tv";
	else{
		console.log(`no category`);
	}

	let page = 1;
	if (req.params.page && req.params.page != 0)
		page = req.params.page;


	if (category && req.params.category){
		MovieDB['search' + category]({ query: decodeURIComponent(req.params.title), page: page }, (err, results) => {
			if (err) {
				console.log(err);
				res.send({"page": 1, results: [], message: "ZERO RESULTS", status: 'success'});
			}
			else {
				addSeen(results)
				.then((movies) => {
					res.send(movies);
				})
				.catch((error) => {
					if (error)
						console.log(error);
					res.send({"page": 1, results: [], message: "ZERO RESULTS", status: 'success'});
				})
			}
		});
	}
});

router.post('/list/:category/:page', Auth.isLoggedIn,(req, res) => {
	function addSeen(movies){
		return new Promise(function (resolve, reject) {
			let log;

			if (!movies || !movies.results || movies.results.length == 0){
				reject();
			}
			else {
				let i = movies.results.length;
				if (req.params.category === `Movie` || req.params.category === `movie`) {
					for (let movieKey in movies.results) {
						const movie = movies.results[movieKey];

						if ((log = req.user.moviesViewed.find(function (watched) {
								return watched.movieDbId == movie.id;
							}))) {
							movie.seen = {seen: true, date: log.date};
							if (i - 1 == movieKey + 1)
								resolve(movies);
						}
						else {
							movie.seen = {seen: false};
							if (i - 1 == movieKey)
								resolve(movies);
						}
					}
				}
				else {
					for (let tvShowKey in movies.results) {
						const tvShow = movies.results[tvShowKey];

						if ((log = req.user.tvShowsViewed.find(function (watched) {
								return watched.movieDbId == tvShow.id;
							}))) {
							tvShow.seen = {seen: true, date: log.date};
							if (i - 1 == tvShowKey + 1)
								resolve(movies);
						}
						else {
							tvShow.seen = {seen: false};
							if (i - 1 == tvShowKey)
								resolve(movies);
						}
					}
				}
			}
		});
	}

	let category;
	if (req.params.category === "movie" || req.params.category === "Movie")
		category = "Movie";
	else if (req.params.category === "tv" || req.params.category === "Tv")
		category = "Tv";
	else
		res.status(400).send({status: 'error', message: 'bad request'});

	let page = 1;
	if (req.params.page && req.params.page != 0)
		page = req.params.page;

	if (!req.body.voteAverage)
		req.body.voteAverage = {};
	if (!req.body.releaseDate)
		req.body.releaseDate = {};

	if (category){
		MovieDB['discover' + category]({
			page: page || 1,
			sort_by: req.body.sortBy || "",
			include_adult: req.body.adult || false,
			with_genres: req.body.genres || [],
			'vote_average.lte': req.body.voteAverage.lte || 10,
			'vote_average.gte': req.body.voteAverage.gte || 0,
			'release_date.lte': req.body.releaseDate.lte || `${new Date().toISOString().split('T')[0]}`,
			'release_date.gte': req.body.releaseDate.gte || '0000-01-01'
	}, (err, results) => {
			addSeen(results)
			.then(function(movies){
				res.send(movies);
			})
			.catch(function(error){
				res.send({"page": 1, results: [], message: "ZERO RESULTS", status: 'success'});
			})
		});
	}
});

router.get('/one/:category/:movieId', Auth.isLoggedIn, (req, res, next) => {
	let category;
	if (req.params.category === "movie" || req.params.category === "Movie")
		category = "movie";
	else if (req.params.category === "tv" || req.params.category === "Tv")
		category = "tv";
	else
		res.status(400).send({status: 'error', message: 'bad request'});

	function addCredits(details){
		return new Promise(function(resolve, reject){
			MovieDB[category + 'Credits']({id: req.params.movieId}, (err, credits) => {
				if (credits){
					let director;

					details.cast = credits.cast;
					if ((director = credits.crew.find(function(crewMember){
							return crewMember.job == "Director";
						}))){
						details.director = director;
						resolve(details);
					}
					else{
						resolve(details);
					}
				}
				else
					resolve(details);
			});
		})
	}

	function addSeen(details){
		return new Promise(function (resolve, reject) {
			let log;

			if (req.params.category === `Movie` || req.params.category === `movie`) {
				if ((log = req.user.moviesViewed.find(function (watched) {
						return watched.movieDbId == details.id;
					}))) {
					details.seen = {seen: true, date: log.date};
					resolve(details);
				}
				else {
					details.seen = {seen: false};
					resolve(details);
				}
			}
			else {
				if ((log = req.user.tvShowsViewed.find(function (watched) {
						return watched.movieDbId == details.id;
					}))) {
					details.seen = {seen: true, date: log.date};
					resolve(details);
				}
				else {
					details.seen = {seen: false};
					resolve(details);
				}
			}
		});
	}

	function getDetails() {
		return new Promise(function (resolve, reject) {
			MovieDB[category + 'Info']({id: req.params.movieId}, (err, details) => {
				if (details) {
					resolve(details);
				}
				else
					reject();

			})
		});
	}

	if (category) {
		getDetails()
			.then(addSeen)
			.then(addCredits)
			.then(function(details){
				res.send(details);
			})
			.catch(function(error){res.status(404).send({status: "error", message: "id not found"})})
	}
	else
		res.status(404).send({status: "error", message: "id not found"});
});

router.get('/genres/list/:category', Auth.isLoggedIn, (req, res) => {
	let category;
	if (req.params.category === "movie" || req.params.category === "Movie")
		category = "Movie";
	else if (req.params.category === "tv" || req.params.category === "Tv")
		category = "Tv";
	else
		res.status(400).send({status: 'error', message: 'bad request'});

	MovieDB[`genre${category}List`]((error, genres) => {
		if (error || genres.length === 0)
			res.send({results: [], message: "ZERO RESULTS", status: 'success'});
		else
			res.send(genres);
	});
});

module.exports = router;