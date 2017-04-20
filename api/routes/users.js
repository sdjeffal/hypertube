/**
 ** This file will handle routes on /users
 ** This includes:  Display of an user profile, display of all users if necessary.
 ** All load/save/create/updates
 **/
const express = require('express');
const User = require('../Models/User');
const Auth = require('../middlewares/Auth');
const Config = require("../config/config");
const multer = require('multer');
const upload = multer({dest: "/tmp/"});
const movePicture = require("../helpers/movePicture");
const lodash = require('lodash');
const fse = require('fs-extra');
const nodePath = require('path');
const parsingInputUpdate = require("../helpers/parsingInputUpdate")

let router = express.Router()

router.get('', Auth.isLoggedIn, (req, res) => {

    const promiseFind = User.find().exec()
    let message

    promiseFind.then((users) => {
        if (users.length > 0)
            message = 'OK'
        else {
            message = 'ZERO RESULTS'
            res.status(404)
        }
        res.json({users: users, message: message, status: 'success'})
    }).catch((err) => {
        res.status(500).json({message: 'Internal Server Error', err: err, status: 'error'})
    })
})

router.get('/me', Auth.isLoggedIn, function(req, res) {
    res.send({status: "success", user: req.user})
})

router.put('/me',
/**Auth.isLoggedIn,**/
upload.single('file'), (req, res) => {

    let user = req.user;
    let validation = true;

    if (!user) {
        res.status(404).json({message: 'user not found', status: 'error'})
    } else {
        user.email = req.body.email || user.email
        user.firstName = req.body.firstName || user.firstName
		user.lastName = req.body.lastName || user.lastName
		user.username = req.body.username || user.username
		user.language = req.body.language || user.language
		user.loginInfo.password = (req.body.password && lodash.isString(req.body.password)) ? User.hashPassword(req.body.password) : user.loginInfo.password
		if (req.file){
			movePicture(req.file)
			.then((path) => {
				if (user.hasLocalPicture && user.picturePath && lodash.isString(user.picturePath)){
					let obj = nodePath.parse(user.picturePath)
					let oldPath = nodePath.join(Config.__dirname, "public", Config.pictures.path, obj.base)
					fse.remove(oldPath, (err) => {
						if (err)
							res.status(500).json({message: 'error deleting old picture', err: err ,status: 'error'})
					})
				}
				user.picturePath = path
				user.hasLocalPicture = true
				user.save().then(() => {
					let fields = parsingInputUpdate(req)
					res.json({message: 'updated', fields: fields, status: 'success'})
				})
				.catch((err) => {
					if (err.name && err.name === 'ValidationError')
						res.status(400).json({message: err.name, err: err.errors, status: 'error'})
					else
						res.status(500).json({message: 'Internal Server Error' , err: err, status: 'error'})
				})
			})
			.catch((err) => {
				res.status(500).json({message: 'error upload picture', err: err ,status: 'error'})
			})
		}
		else{
			user.save()
			.then((save) => {
				let fields = parsingInputUpdate(req)
				res.json({message: 'updated', fields: fields, status: 'success'})
			})
			.catch((err) => {
				if (err.name && err.name === 'ValidationError')
					res.json({message: err.name, err: err.errors, status: 'error'})
				else
					res.status(500).json({message: 'Internal Server Error' , err: err, status: 'error'})
			})
		}
	}
})

router.get('/:id', Auth.isLoggedIn, (req, res) => {

    let message
    const params = (req.user._id.toString() !== req.params.id)
        ? '-email -loginInfo.password'
        : '-loginInfo.password'
    const promiseFind = User.findById(req.params.id).select(params).exec()

    promiseFind.then((user) => {
        if (user)
            message = 'OK'
        else {
            message = 'ZERO RESULTS'
            res.status(404)
        }
        res.json({user: user, message: message, status: 'success'})
    }).catch((err) => {
        res.status(500).json({message: 'Internal Server Error', err: err, status: 'error'})
    })
})

router.post('/emailExists/', (req, res) => {

    const promiseFind = User.findOne({email: req.body.email}).exec()

    promiseFind.then((user) => {
        if (user)
            res.json({message: 'email exists', status: 'error'})
        else
            res.json({message: 'email not exists', status: 'success'})
    }).catch((err) => {
        res.status(500).json({message: 'Internal Server Error', err: err, status: 'error'})
    })
})

router.post('/usernameExists/', (req, res) => {

    const promiseFind = User.findOne({username: req.body.username}).exec()

    promiseFind.then((user) => {
        if (user)
            res.json({message: 'username exists', status: 'error'})
        else
            res.json({message: 'username not exists', status: 'success'})
    }).catch((err) => {
        res.status(500).json({message: 'Internal Server Error', err: err, status: 'error'})
    })
})

module.exports = router
