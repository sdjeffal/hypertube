# Hypertube

Web app' for downloading/streaming torrents. Group project. I worked on the front part.


## Subject

Hypertube is the third 42's web project and last before intermediate internship.

__Grade: 125 / 100 (max)__

*French subject --> cf hypertube.fr.pdf*


## Stack
- Back:
	- Node.js express micro-framework
	- MongoDb with mongoose ORM
	- Torrent-stream
	- FFMPEG
	- API calls

- Front:
	- Vue.js 2 with webpack, vue-router and vue-resource
	- twitter bootstrap
	- jquery, moment.js, video.js ...

## Getting Started

Git clone parent repo 'portfolio' and open a terminal. 

Setup mongoDb :
```
mongod --dbpath "{mongoDB path}/.database"
mongo
use hypertube
db.createUser({user: "hypertube", pwd: "hypertube", roles: ["readWrite"]})
```

Setup Back server :
```
npm install hypertube/api
npm start hypertube/api

```

Setup Front server :
```
npm install hypertube/app
npm run dev hypertube/app

```

## Notes

- Team work
- API RESTful
- Single Page App' with Vue.js 2 
- Authentication and connexion system:
    - local
    - OAuth protocol for facebook and 42 
- Proper data validation for security concern
- Edit profile
- Browse other user's profile / your own
- Browse movies / TV shows
- Multiple torrent sources
- Torrent's file selection
- Downloading torrent
- Live encoding for video stream
- Stream video
- Link video to subtitle's torrent
- Comments system
- Search and filter movies / TV shows
- Seen / Unseen movie systems
- flash message system
- Emailing for account validation and forgotten password
- File uploading
- Responsive design
- POO
- Firefox and Chrome support
