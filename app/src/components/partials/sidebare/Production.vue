<template>
	<div>
		<div class="list-group">
			<a href="#" class="list-group-item" @click="affiche_anne(1890, 1899)">1890 - 1899</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1900, 1909)">1900 - 1909</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1910, 1919)">1910 - 1919</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1920, 1929)">1920 - 1929</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1930, 1939)">1930 - 1939</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1940, 1949)">1940 - 1949</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1950, 1959)">1950 - 1959</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1960, 1969)">1960 - 1969</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1970, 1979)">1970 - 1979</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1980, 1989)">1980 - 1989</a>
			<a href="#" class="list-group-item" @click="affiche_anne(1990, 1999)">1990 - 1999</a>
			<a href="#" class="list-group-item" @click="affiche_anne(2000, 2009)">2000 - 2009</a>
			<a href="#" class="list-group-item" @click="affiche_anne(2010, 2017)">2010 - 2017</a>
		</div>
	</div>	
</template>
<script>
 	import movies from '@/services/Search.js'
	export default{
		data(){
			return {
				movies,
				search:"",
			}
		},
		methods:{
			affiche_anne(i, j){
				movies.data.movies_list = [];
				movies.data.anne = {i, j};
				movies.data.page = 1;
				movies.data.anne.j += "-12-31";
				movies.data.anne.i += "-01-01";
				movies.search(this, movies);
			}
		}
	}
</script>
<style type="text/css">
	
</style>