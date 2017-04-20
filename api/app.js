/**
 ** Includes our libraries and the config files
 **/
const   mongoose	= require('mongoose'),
		express  	= require('express'),
		cors 		= require('cors'),
		bodyParser  = require('body-parser'),
		cookieParser  = require('cookie-parser'),
		session = require('express-session'),
		MongoStore = require('connect-mongo')(session);
		cluster = require('cluster'),
		numCPUs = require('os').cpus().length,
		app      	= express(),
		Config		= require('./config/config'),
		rmcron = require('./helpers/cron'),
		passport = require('./config/PassportConfig');

app.use(session({
	secret: Config.session.secret,
	name: 'hypertube',
	maxAge: new Date(Date.now() + 3600000),
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	resave: false,
	autoRemove: 'native',
	saveUninitialized: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false, credentials: true}));
app.use(passport.initialize());
app.use(passport.session());

/**
 ** Allows Cross Origin Requests
 **/

app.use(cors({origin : `http://${Config.serverInfo.webAddress}:8080`, credentials: true}));

/**
 ** Defines the Routes static folder
 **/
app.use(express.static(__dirname + '/public'));

/**
 ** Defines all other express routes.
 **/
app.use('/auth', require('./routes/auth.js'));
app.use('/users', require('./routes/users.js'));
app.use('/movies', require('./routes/movies.js'));
app.use('/torrents', require('./routes/torrents.js'));
app.use('/comments', require('./routes/comments.js'));
app.use('/search', require('./routes/search.js'));

/** Start connection to mongoDB **/
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${Config.db.username}:${Config.db.password}@${Config.db.host}:${Config.db.port}/${Config.db.databaseName}`);

/** Allows for more precises error when promises are rejected **/

process.on('unhandledRejection', r => console.log(r));

/**
 ** Listens on the port
 **/

if (cluster.isMaster) {
	if (Config.hash.salt === "$2a$10$FvNsAwrkg2LXm89gCS3kfO")
		console.log("Don't forget to change the salt in the config before launching production");
	console.log(`Master ${process.pid} is running`);

	let workers = {};

	for (let i = 0; i < numCPUs; i++) {
		let worker = cluster.fork();
		workers[worker.process.pid] = worker;
	}
	cluster.on('exit', (worker, code, signal) => {
		console.log(`Slave #${worker.process.pid} died with error code ${code}`);
	});

	cluster.on('message', (worker, message) => {
		console.log(message.message);
		worker.send({message: `Server responded to worker #${worker.process.pid}'s ping.`});
		delete workers[worker.process.pid];
	});
	/**
	 ** starting cron delete a video dating lastSeen from more than a month
	 **/
	rmcron('*/2 * * * * *');
}
else {
	/**
	 ** Create the server instance same as before
	 **/

	let server = require('http').Server(app);

	/** Starts the server on this child **/
	server.listen(3000);

	process.on('message', (message) => {
		console.log(message.message);
	});

	process.send({message: `Slave #${process.pid} started.`});
}