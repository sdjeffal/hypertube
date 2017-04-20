const lodash = require('lodash');

const parsingInputUpdate = function parsingInputUpdate(req){
	let fields = []
	if (req.body.email)
		fields.push('email')
	if (req.body.firstName)
		fields.push('firstName')
	if (req.body.lastName)
		fields.push('lastName')
	if (req.body.language)
		fields.push('language')
	if (req.body.password && lodash.isString(req.body.password))
		fields.push('password')
	if (req.file)
		fields.push('picturePath')
	return fields
}

module.exports = parsingInputUpdate