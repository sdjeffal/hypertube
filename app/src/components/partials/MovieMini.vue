<template>
<div class="col-sm-4 col-xs-4 thumb col-height ">

    <div class="img-overlay" v-if="id">

        <router-link class="thumbnail":to="{name: link, params: { id: id }} ">
            <span v-if="Movie.seen.seen === true" class="glyphicon glyphicon-eye-open seen"></span>

        <img :src="img_src" alt="cover" class="image">

        <div class="middle">
            <div class="text">{{Movie.original_title || Movie.name}}</div>
            <div class="text">{{Movie.vote_average}} <span class="hidden-xs glyphicon glyphicon-star icon-star"></span></div>
            <div class="text">{{Movie.release_date}}</div>
        </div>

        </router-link>
    </div>



</div>
</template>

<script>
	import SearchStore from '@/services/SearchStore.js'
    import error_img from "../../assets/images/img_error.jpg"
	export default {
		props: ['movie'],
		data () {
			return {
				Movie: this.movie,
                id: this.movie.id,
                link: 'MovieCard',
				img_size: 'https://image.tmdb.org/t/p/w342',
                img_id: '',
				img_src: ''
			}
		},
		created () {
			if(SearchStore.type === false)
            	this.link = 'TvCard';
            else
				this.link = 'MovieCard';
            this.img_id_check();
			this.concat_img();
		},
        methods:{

        	concat_img(){
				this.img_src = this.img_size.concat(this.img_id);
            },
            img_id_check(){
        		if(this.movie.poster_path){
					this.img_id = this.movie.poster_path;

                }

                else if(this.movie.backdrop_path){
                    this.img_id = this.movie.backdrop_path;
                }
                else{
                    this.img_size = '';
                    this.img_id = error_img;
                }

            },
            say: function(message){
            	console.log(message);
            }
        }
    }
</script>
<style scoped>
    .img-overlay{
        position: relative;
        width: 100%;

    }
    .image {
        opacity: 1;
        display: block;
        width: 100%;
        height: auto;
        transition: .5s ease;
        backface-visibility: hidden;
    }
    .img-overlay img {
        height: 30vw;
        max-height: 525px;
    }
    .seen{
        position: absolute;
        padding-top: 1em;
    }
    .middle {
        transition: .5s ease;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%)
    }

    .img-overlay:hover .image {
        opacity: 0.3;
    }

    .img-overlay:hover .middle {
        opacity: 1;
    }

    .text {
        font-weight: bold;
        color: black;
        font-size: 1.8vw;
        padding-bottom: 1em;

    }

    @media (max-width: 767px) {
 .text {
    font-size: 3vw;
 }
}
</style>