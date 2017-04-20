<template>
	<div>
		<div class="list-group">
			<a href="#" class="list-group-item" @click="affiche_categorie(28)">Action</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(12)">{{Version('Adventure')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(16)">Animation</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(35)">{{Version('Comedy')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(80)">Crime</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(99)">{{Version('Documentary')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(18)">{{Version('Drama')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10751)">{{Version('Family')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(14)">{{Version('Fantasy')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(36)">{{Version('History')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(27)">{{Version('Horror')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10402)">{{Version('Music')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(9648)">{{Version('Mystery')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10749)">Romance</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(878)">Science Fiction</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10770)">{{Version('TV_Movie')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(53)">Thriller</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10752)">{{Version('War')}} </a>
			<a href="#" class="list-group-item" @click="affiche_categorie(37)">Western</a>
		</div>
	</div>	
</template>
<script>
	import message from '@/lang/Category.js'
  	import trad from '@/services/LanguageStore.js'
 	import movies from '@/services/Search.js'
  	export default{
		data(){
			return {
				trad,
				message,
				movies,
				search : "toto", count: 1
			}
		},
		methods:{
			affiche_categorie(id){
				movies.data.movies_list = [];
				movies.data.genres = id;
				movies.data.page = 1;
				movies.search(this, movies);
				
			},
			Version(key){
				return trad.getContent(message)[key]
			}
		}
	}
</script>
