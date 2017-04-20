<template>
	<div>
		<div class="list-group">
			<a href="#" class="list-group-item" @click="affiche_IMBd(0, 2)">0 - 2</a>
			<a href="#" class="list-group-item" @click="affiche_IMBd(3, 5)">3 - 5</a>
			<a href="#" class="list-group-item" @click="affiche_IMBd(6, 8)">6 - 8</a>
			<a href="#" class="list-group-item" @click="affiche_IMBd(9, 10)">9 - 10</a>
		</div>
	</div>	
</template>
<script>
 	import movies from '@/services/Search.js'
	export default{
		data(){
			return {
				movies
			}
		},
		methods:{
			affiche_IMBd(i, j){
				movies.data.movies_list = [];
				movies.data.imdb = {i, j}
				movies.data.page = 1;
				movies.search(this, movies);
			}
		}
	}
</script>
<style type="text/css">
	
</style>