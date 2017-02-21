'use strict'

const imdb = require('imdb-api');
const yify = require('yify-search');
const PirateBay = require('thepiratebay');
const parser = require('torrent-name-parser');
const lodash = require('lodash');

export default class Torrent {

    constructor() {
        this.site = undefined;
        this.title = undefined;
        this.magnet = undefined;
        this.cover = undefined;
        this.rating = undefined;
        this.category = undefined;
        this.genre = undefined;
        this.year = undefined;
        this.summury = undefined;
        this.language = undefined;
        this.producer = undefined;
        this.director = undefined;
        this.actor = undefined;
        this.duration = undefined;
        this.quality = undefined;
        this.resolution = undefined;
        this.seeder = undefined;
        this.peer = undefined;
        this.size = undefined;
        this.api = undefined;
    }

    search(name) {
        let promisePirate = new Promise((resolve, reject) => {
            PirateBay.search(name)
            .then(results => {
                if (!lodash.isEmpty(results)){
                    let movies = [];
                    lodash.forEach(results, (value) => {
                        let movie = new Torrent
                        let info = undefined
                        info = parser(value.name)
                        movie.title = info.title
                        movie.quality = info.quality
                        movie.resolution = info.resolution
                        movie.language = info.language
                        movie.category = value.subcategory.name
                        movie.seeder = value.seeders
                        movie.peer = value.leechers
                        movie.magnet = value.magnetLink
                        movie.size = value.size
                        movie.api = value
                        movie.site = 'thepiratebay';
                        imdb.get(movie.title)
                        .then(result => {
                            movie.cover = result.poster
                            movie.year = result.year
                            movie.rating = result.rating
                            movie.genre = result.genres
                            movie.director = result.director
                            movie.actor = result.actors
                            movie.summary = result.plot
                            movie.duration = result.runtime
                        })
                    })
                }
            })
            .catch(err => {reject(err)})
        })

        let promiseYifi = new Promise((resolve, reject) => {
            yify.search(name, (error, results) => {
                if(error)
                    reject(error)
                else
                    resolve(results)
            })
        })

        return Promise.all([promisePirate, promiseYifi])
        .then(results => {

            if (!lodash.isEmpty(results[0]) && !lodash.isEmpty(results[1])){
                console.log('torrent found on piratebay and yify');
            }
            else if (!lodash.isEmpty(results[0])){
                console.log('torrent found only on piratebay');

            }
            else if (!lodash.isEmpty(results[1])){
                console.log('torrent found only on yify');

            }
            else{
                console.log('no torrent found');
            }
            return results
        })
        .catch(err => {
            return err
        })
    }
}
