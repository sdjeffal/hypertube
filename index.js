import Torrent from './Torrent'

let t = new Torrent();
t.search('naruto').then((str) => {console.log(str)}).catch((err) => {console.log(err)});