'use strict'

const imdb = require("imdb-api");
const yify = require('yify-search');
const PirateBay = require('thepiratebay');
const parser = require('torrent-name-parser');

export default class Torrent{

    constructor(){
        this.torrent = undefined;
        this.site = undefined;
        this.title = undefined;
        this.magnet = undefined;
        this.cover = undefined;
        this.rating = undefined;
        this.genre = undefined;
        this.year = undefined;
        this.summury = undefined;
        this.language = undefined;
        this.producer = undefined;
        this.director = undefined;
        this.actor = undefined;
        this.duration = undefined;
        this.quality = undefined;
        this.seeder = undefined;
        this.peer = undefined;
        this.size = undefined;
        this.type = undefined;
        this.imdb = undefined;
        this.info = undefined;
    }

    search(name){
        return new Promise((resolve, reject) => {
            PirateBay.search(name)
            .then(results => {
                resolve(results)
            })
            .catch(err => {eject(err)})
        })
        // yify.search(name, (error, results) => {
        //     for(let r in results){
        //     }
        //     movies = results;
        // })
        // PirateBay.search(name)
        // .then(results => {
        //     if (results){
        //         for(let r in results){
        //             let movie = parser(results[r].name);
        //             movie = imdb.getReq({ name: movie.title}).then(things => {console.log(things)}).catch(err => console.log(err))
        //             results[r].imdb = movie
        //         }
        //         console.log(results);
        //         return results;
        //     }
        // })
        // .catch(err => console.log(err))
    }
}