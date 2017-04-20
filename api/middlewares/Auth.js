/**
 * Created by team on 3/14/17.
 */

const Auth = {
	isLoggedIn: function(req, res, next) {
		if (req.user)
			next();
		else
			res.status(200).send({status: 'unauthorized', message: "unauthorized"});
	}
};

module.exports = Auth;