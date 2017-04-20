/**
 * Created by team on 3/16/17.
 */

const   express = require('express'),
		router = express.Router(),
		Auth = require('../middlewares/Auth'),
		Comment = require('../Models/Comment'),
		User = require('../Models/User');


function getAllAuthors(comments) {
	return new Promise((resolve, reject) => {
		const refilledComments = [];
		for (let commentKey = 0; commentKey < comments.length; commentKey++){
			const refilledComment = {
				userId: comments[commentKey].user_id,
				torrentHash: comments[commentKey].torrentHash,
				message: comments[commentKey].message,
				createdAt: comments[commentKey].createdAt
			};
			User.findOne({_id: comments[commentKey].userId}).select({_id: 1, username: 1, picturePath: 1, firstName: 1, lastName: 1})
			.then((user) => {
				if (user)
					refilledComment.user = user;
				else
					refilledComment.user = {
						username: "Anonymous"
					};
			})
			.catch((err) => {
				console.log(err);
				refilledComment.user = {
					username: "Anonymous"
				};
			})
			.then(() => {
				refilledComments.push(refilledComment);
				if (refilledComments.length === comments.length) {
					refilledComments.sort((a, b) => {
						return new Date(b.createdAt) - new Date(a.createdAt);
					});
					resolve(refilledComments);
				}
			});
		}
	});
}

router.get('/', Auth.isLoggedIn, (req, res, next) => {
	Comment.find({}).exec(null)
		.then((comments) => {
			if (comments.length > 0){
				getAllAuthors(comments).then((refilledComments) => {
					res.send({status: 'success', message:'OK' , comments: refilledComments});
				})
				.catch((err) => {
					console.log(err);
					res.status(400).send({status: 'error', message: err});
				});
			}
			else
				res.send({status: 'success', message:'ZERO RESULTS' , comments: comments});
		},
		(err) => {
				res.status(400).send({status: 'error', message: err});
		});
});

router.get('/user/:userId', Auth.isLoggedIn, (req, res, next) => {
	Comment.find({userId: req.params.userId}).exec()
		.then((comments) => {
			if (comments.length > 0){
				getAllAuthors(comments).then((refilledComments) => {
					res.send({status: 'success', message:'OK' , comments: refilledComments});
				})
				.catch((err) => {
					console.log(err);
					res.status(400).send({status: 'error', message: err});
				});
			}
			else
				res.send({status: 'success', message:'ZERO RESULTS' , comments: comments});
		},
		(err) => {
				res.status(400).send({status: 'error', mes7sage: err});
		});
});

router.get('/torrent/:torrentHash', Auth.isLoggedIn, (req, res, next) => {
	Comment.find({torrentHash: req.params.torrentHash}).exec()
		.then((comments) => {
			if (comments.length > 0){
				getAllAuthors(comments).then((refilledComments) => {
					res.send({status: 'success', message:'OK' , comments: refilledComments});
				})
				.catch((err) => {
					console.log(err);
					res.status(400).send({status: 'error', message: err});
				});
			}
			else
				res.send({status: 'success', message:'ZERO RESULTS' , comments: comments});
		},
		(err) => {
			res.status(400).send({status: 'error', message: err});
		});
});

/**
 ** Creates a comment
 ** {message: "My very long torrent comment"}
 **/

router.put('/torrent/:torrentHash', Auth.isLoggedIn, (req, res, next) => {
	if (req.params.torrentHash.length == 40){
		Comment.create({userId: req.user._id, torrentHash: req.params.torrentHash, message: req.body.message})
			.then(() => {
				res.send({status: 'success', message: 'comment created'})
			},
			(err) => {
				res.status(400).send({status: 'error', message: err})
			});
	}
});

module.exports = router;