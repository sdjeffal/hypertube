import user from "@/services/User.js"
import notif from "@/services/NotificationStore.js"

const API_URL = 'http://localhost:3000/'
const COMMENT_TORRENT_URL = API_URL + 'comments/torrent/' // :hash
const COMMENT_USER_URL = API_URL + 'comments/user/' // :user_id

export default {
	
	state: [],

	addComment (comment) {
		this.state.push(comment)
	},

	addComment2 (comment) {
		this.state.unshift(comment)
	},

	newComment (context, hash)
	{
		context.$http.put(COMMENT_TORRENT_URL + encodeURIComponent(hash), {message : context.comment}).then(
			(res) => {
				this.addComment({message : {text :context.comment, time : Date.now()}, user : {profile_pic : user.data.picturePath, username : user.data.username, id : user.data._id}})
				context.comment = ""
			},
			(res) => {
				notif.showNotification(
					res.body ? (res.body.err.message ? res.body.err.message : res.body.message) : "database error",
					"alert-danger",
					true
					)
			})
	},

	clearComments() {
		this.state.length = 0
	},

	populate (context, hash)
	{
		context.$http.get(COMMENT_TORRENT_URL + encodeURIComponent(hash)).then(
			(res) => {
				for (let comment of res.body.comments)
				{
					this.addComment2({message : {text :comment.message, time : comment.createdAt}, user : {profile_pic : comment.user.picturePath, username : comment.user.username, id : comment.user._id}})
				}
			},
			(res) => {
				notif.showNotification(
					res.body ? (res.body.err.message ? res.body.err.message : res.body.message) : "database error",
					"alert-danger",
					true
					)
			})
	},

	getUserComments(context, user_id)
	{
		context.$http.get(COMMENT_USER_URL + encodeURIComponent(user_id)).then(
			(res) => {
				//console.log(res.body)
				if (res.body.comments.length)
				{
					for (let comment of res.body.comments)
					{
						this.addComment2({message : {text :comment.message, time : comment.createdAt}, user : {profile_pic : comment.user.picturePath, username : comment.user.username, id : comment.user._id}, torrentHash: comment.torrentHash})
					}
				}
				else
					context.NoComments = true

			},
		(res) => {
			notif.showNotification(
				res.body ? (res.body.err.message ? res.body.err.message : res.body.message) : "database error",
				"alert-danger",
				true
				)
		})
	},

}