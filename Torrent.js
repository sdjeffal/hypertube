'use strict'

const imdb = require("imdb-api");
const yify = require('yify-search');
const PirateBay = require('thepiratebay');
const parser = require('torrent-name-parser');

export default class Torrent {

    constructor() {
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

    search(name) {

        let promisePirate = new Promise((resolve, reject) => {
            PirateBay.search(name)
            .then(results => {
                resolve(results)
            })
            .catch(err => {reject(err)})
        })



        return Promise.all([promisePirate, promiseYifi]).then(results => {return results}).catch(err => {return err})
    }
}
