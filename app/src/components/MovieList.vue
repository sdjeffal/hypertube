<template>
	<div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
	    <sidebar class="side"/>

	    <div class="row row-eq-height" v-model="movies" :movies="movies">


	        <movie-mini add key with v-for="movie in movies.data.movies_list" :movie=movie> movie</movie-mini>

	    </div>
	   <br><br> <div class="no_film" v-if="no_film">
			<p>{{Version('torrent')}}</p>
        </div>
	</div>
</template>
<script>
	import MovieMini from "./partials/MovieMini.vue"
	import SearchStore from '@/services/SearchStore.js'
	import movies from "@/services/Search.js"
	import loading from "@/services/Loading.js"
	import sidebar from './sidebare.vue'
    import trad from '@/services/LanguageStore.js'
    import message from '../lang/MovieCard.js'
	export default {
		data () {
			return {
				busy: false,
                count: 0,
                query: '',
                SearchStore,
                search: 'b',
                movies,
                no_film: false
			}
		},
        watch:{
			SearchStore: {
				deep: true,
				handler: function(val, oldVal){

                    this.empty()
					this.SearchQuery()
					this.count = 1;
				}
			}
        },
		components: {
			MovieMini,
    		sidebar
		},
		methods:{
			Version(key) {
			    return trad.getContent(message)[key]
			},
			empty: function(){
				movies.data.movies_list = [];
			},
			SearchQuery: function() {
				if (SearchStore.video_query) {
					movies.data.genres = "";
					movies.data.anne.i = "";
					movies.data.anne.j = "";
					movies.data.imdb.i = "";
					movies.data.imdb.j = "";

					this.$http.get(`http://localhost:3000/search/list/${movies.data.category}/${encodeURIComponent(SearchStore.video_query)}/${this.count}`, {
						before(request) {
							if (this.previousRequest){
								this.previousRequest.abort();
							}
							this.previousRequest = request;
						}
					}).then((response) => {
						this.no_film = false;
						this.query = response.body.results;
						movies.data.movies_list = response.body.results
						if (!response.body.results.length)
						{
							this.no_film = true;
						}
					}, response => {
					});
				}
				else
				{
					this.no_film = false;
					movies.data.page = 1
					this.count = 1;
					movies.search(this, movies);
				}
			},
			loadMore: function() {
				if (SearchStore.video_query)
				{
					this.busy = true;
					this.count++;
					this.no_film = false;
					if (this.query.length > 0)
					{
						this.$http.get(`http://localhost:3000/search/list/${movies.data.category}/${encodeURIComponent(SearchStore.video_query)}/${this.count}`).then((response) => {
							this.query = response.body.results;
							this.busy = false;
							movies.data.movies_list = movies.data.movies_list.concat(this.query);
						})
					}
				}
				else
					movies.search(this, movies);
			}
        }


    }
</script>
<style scoped>
	.row{
		padding-left: 20px;
	}
	.no_film{
		font-size: 5vw;
	}
</style>
