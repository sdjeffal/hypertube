<template>
	<router-link :to="{name: 'Main'}">
		<img id="logo" src="../../../assets/images/hyperteub-icon.png" @click="send_profile">
		<span @click="send_profile">Hyperteub</span>
	</router-link>
</template>
<script>
	import movies from '@/services/Search.js'
  	import SearchStore from '@/services/SearchStore.js'
	export default{
			data () {
				return {
					movies }
			},
			methods : {
				send_profile(){
					movies.data.genres = "";
					movies.data.imdb.i = "";
					movies.data.imdb.j = "";
					movies.data.anne.i = "";
					movies.data.anne.j = "";
					movies.data.sort = "";
					movies.data.page = 1;
					SearchStore.video_query = "";
					movies.data.movies_list= [];
					movies.search(this, movies);	

				}
			}
	}
</script>
<style scoped>
	#logo {
		width:40px;
		height:40px;
		filter: invert(100%);
		display: inline;
		margin-top: -8px;
	}
</style>