import auth from '@/services/Auth.js' 

export default {

	showIfLoggued (to, from, next)
	{
		// console.log("-- > showIfLoggued")
		if (auth.checkAuth())
			next()
		else
			auth.getUserLogguedData(next)
	},

	showIfNotLoggued (to, from, next)
	{
		// console.log("--> showIfNotLoggued")
		if (auth.checkAuth()) 
			next({ name: 'Main' })
		else
			next()
	}
}

/// a recu un mail