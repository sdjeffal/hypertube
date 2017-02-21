import Torrent from './torrent'

let t = new Torrent();
t.search('avengers').then(results => {
    //console.log(results)
}).catch(err => {
    //console.log(err);
});