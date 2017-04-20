<template>
    <div class="row justify-content-center movie-card-container">
        <div class="hero hidden-xs col-sm-12" :style="img_back">
           &nbsp;
       </div>
       <div class="col-xs-12">
        <router-link class="back" :to="{name: 'Main'}">
            <button type="button" class="btn btn-block btn-large btn-github">{{Version('back')}}</button>
        </router-link>
    </div>
    <div class="hidden-xs col-sm-8 col-sm-push-4">
        <h1 class="center-block">{{movie.original_title}}</h1>
        <h2 class="center-block">{{movie.tagline}}</h2>
    </div>
    <div class="col-xs-12 col-sm-pull-8 col-sm-4 col-md-3 col-md-offset-1 col-lg-2">
        <img :src="img_src" alt="cover" class="cover img-thumbnail" />
    </div>
    <div class="col-xs-12 col-sm-4 col-md-3 col-md-offset-1 col-lg-2 description">
        <p>&nbsp;</p>
        <p v-if="imdb_link">
            <a :href="imdb_link">
                <img src="../assets/images/logo-imdb.svg">
            </a>
            <span class="likes">{{movie.vote_average}}</span>
            <span class="hidden-xs glyphicon glyphicon-star icon-star"></span>
        </p>
        <p class="text-center"><strong>{{Version('released')}}</strong>{{movie.release_date}}</p>
        <p class="text-center"><strong>{{Version('runtime')}}</strong>{{movie.runtime}}mn</p>
        <p class="text-center"><strong>{{Version('genres')}}</strong></p>
        <div class="tag center-block" v-for="(id, index) in movie.genres">{{id.name}}</div>
    </div>

    <div class="col-xs-12 col-sm-8 col-lg-7 col-lg-offset-1 down">
        <div class="torrent-list" v-if="list_torrent">
            <div class="ui active dimmer tor" v-if="load">
                <div class="loader ui"></div>
            </div>
            <div class="torrent" v-for="(id, index) in movie.torrents">
                <router-link :to="{name: 'Video', params : {hash: id.hash}}"><div><strong>{{id.title}}</strong><br/> seed: {{id.seeders}}</div></router-link>
            </div>
            <div class="torrent" v-if="empty_torrent">
                <div>{{Version('torrent')}}</div>
            </div>
        </div>                        
    </div>
    <div class="col-xs-12">
        <blockquote><p>{{movie.overview}}</p></blockquote>
    </div>
    <div class="avatars col-xs-12" v-if="movie.cast">
        <p>{{Version('actors')}}</p>
        <span data-placement="top" v-for="(actor, index) in movie.cast">
            <img class="round-img" :title="actor.name" :src="concat_cast(actor.profile_path)" :alt="actor.name" />
        </span>
    </div>
    <div class="avatars col-xs-12" v-if="movie.director">
        <p>{{Version('director')}}</p>
        <img class="round-img" :title="movie.director.name" :src="concat_cast(movie.director.profile_path)" :alt="movie.director.name" />
    </div>
</div>
</template>
<script>
    import movies_search from "@/services/Search.js"
    import trad from '@/services/LanguageStore.js'
    import message from '../lang/MovieCard.js'
    export default {
      props: ['userId'],
      params: ['id'],
      data () {
         return {
            movie: '',
            movie_id: '',
            id: '',
            img_size: 'https://image.tmdb.org/t/p/w342',
            img_size_back: 'http://image.tmdb.org/t/p/w1280',
            img_size_cast: 'http://image.tmdb.org/t/p/w45/',
            imdb_link: '',
            img_id: '',
            img_id_back: '',
            img_src: '',
            img_back: '',
            img_cast: '',
            movies_search,
            load : false,
            list_torrent : true,
            torrent : '',
            hash: '',
            empty_torrent: false
        }
    },

    created () {
        this.movie_id = this.$route.params.id
        this.$http.get(`http://localhost:3000/search/one/${encodeURIComponent(movies_search.data.category)}/${encodeURIComponent(this.movie_id)}`).then((response) => {
            this.movie = response.body
            this.get_torent()
            this.img_id_check()
            this.concat_img()
        })
    },

    methods:{
     Version(key) {
        return trad.getContent(message)[key]
    },

    concat_img(){
        this.img_src = this.img_size.concat(this.img_id);
        if (this.movie.imdb_id)
            this.imdb_link = 'http://www.imdb.com/title/'.concat(this.movie.imdb_id);
        this.img_back = "background-image: url('" + this.img_size_back.concat(this.img_id_back) + "'); background-position: center top; background-repeat: no-repeat; background-color: transparent;";

    },

    concat_cast(cast_id){
        if(cast_id)
            return(this.img_size_cast.concat(cast_id));
        else
           return(this.img_size_cast.concat('/fW37Gbk5PJZuXvyZwtcr0cMwPKY.jpg'));
   },

   get_torent(){
    this.load = true;
    if (movies_search.data.category == "movie")
        var year = this.movie.release_date.substr(0,4)
    this.$http.get(`http://localhost:3000/movies/${encodeURIComponent(movies_search.data.category)}/${encodeURIComponent(this.movie.title)}/${encodeURIComponent(year)}/${encodeURIComponent(this.movie_id)}`).then((response) => {
        this.load = false;
        this.movie.torrents = response.body.torrents
        if (!response.body.torrents.length)
        {
            this.empty_torrent = true;
        }
        else
            this.hash = this.movie.torrents.hash
        this.$mount()
    }, response => { this.load = false; this.empty_torrent = true;})
},

img_id_check(){
    if(this.movie.poster_path){
       this.img_id = this.movie.poster_path;
       this.img_id_back = this.movie.backdrop_path;
   }

   else if(this.movie.backdrop_path){
       this.img_id = this.movie.backdrop_path;
   }
   else{
       this.img_id = '/q1i8QHiHZ1cukG5iOxai8pydmoa.jpg';

   }
   if(!(this.movie.backdrop_path)){
       this.img_id_back = '/lBVtKWWXH46r7oMLdfT3quioaVb.jpg';
   }
},

list(hash){
    this.load = true;
    this.$http.get(`http://localhost:3000/torrents/${encodeURIComponent(hash)}`).then((response)=>{
        this.torrent = response.body;
        this.load = false;
        this.list_torrent = false;
        if (!response.body.response.length)
        {
            this.empty_torrent = true;
        }
    })
},
},
}
</script>
<style scoped>
    .down {
        margin-top: 20px;
    }
    .movie-card-container {
        font: 14px/22px "Lato", Arial, sans-serif;
        
        margin: 0 auto;
        max-width: 1280px !important;
        background: #F0F0ED;
        border-radius: 5px;
        /*margin-left: 11vw;
        color: #A9A8A3;*/
    }
    .icon-star{
        color: #6ac045;
        /*margin-left: 10px;*/
        font-size: 1.1em;
    }
    .hero {
        max-width: inherit;
        height: 342px;
        margin:0;
        position: absolute;
        overflow: hidden;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    /*.hero:before {
        content:'';
        width:100%; height:100%;
        position:absolute;
        overflow: hidden;
        top:0; left:0;
        z-index:-1;
        transform: skewY(-2.2deg);
        transform-origin:0 0;
        //chrome antialias fix
        -webkit-backface-visibility: hidden;
    }*/
    .cover {
        margin: 0 auto;
    }
    .title1 {
        color: white;
        font-size: 44px;
        /*margin-bottom: 13px;*/
        position: relative;
        span {
            position: absolute;
            top: 3px;
            /*margin-left: 12px;*/
            background: #C4AF3D;
            border-radius: 5px;
            color: #544C21;
            font-size: 14px;
            /*padding: 0px 4px;*/
        }
    }
    .title2 {
        color: #C7C1BA;
        font-size: 23px;
        font-weight: 300;
        margin-bottom: 15px;
    }
    .description {
        color: #B1B0AC;
    }
    .tag {
        background: #ddd;
        border-radius: 10px;
        max-width: 150px;
    }
    .torrent-list{
        padding-bottom: 2em;
    }
    .torrent {
        background: white;
        border-radius: 10px;
        /*margin-right: 4px;
        margin-top: 4px;*/
        cursor: pointer;
        /*max-width: 500px;*/
        display: block;
        margin-right: auto;
        margin-left: auto;
        color: #B1B0AC;
        overflow-x: auto;
    }
    .torrent:hover {
        background: #ddd;
        color: #B1B0AC;
    }
    .avatars {
        /*margin-top: 23px;
        margin-bottom: 23px;*/
        img {
            cursor: pointer;
        }
        img:hover {
            opacity: 0.6;
        }
        span:hover {
            text-decoration: none;
        }
    }
    .round-img{
        width: 48px;
        height: 65px;
        -webkit-border-radius: 50%;
    }
    .ui.active.dimmer.tor{
        margin-top: 20px;
        background:  #F0F0ED;
    }
    a {
        text-decoration : none;
    }
    .glyphicon-menu-left{
        cursor:pointer;
    }
    .back {
        margin: 10px;
        float: left;
    }
    a, a:hover, a:active {
        color: #B1B0AC;
    }
</style>