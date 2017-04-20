<template>
	<div>
		<div class="list-group">
			<a href="#" class="list-group-item" @click="affiche_categorie(10759)">Action & {{Version('Adventure')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(16)">Animation</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(35)">{{Version('Comedy')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(80)">Crime</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(99)">{{Version('Documentary')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(18)">{{Version('Drama')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10751)">{{Version('Family')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10762)">{{Version('Kids')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(9648)">{{Version('Mystery')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10763)">{{Version('News')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10764)">{{Version('Reality')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(878)">Science Fiction & {{Version('Fantasy')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10766)">{{Version('Soap')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10767)">{{Version('Talk')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(10768)">{{Version('War')}} & {{Version('Politics')}}</a>
			<a href="#" class="list-group-item" @click="affiche_categorie(37)">Western</a>
		</div>
	</div>	
</template>
<script >
 	import movies from '@/services/Search.js'
	import message from '@/lang/Category.js'
  	import trad from '@/services/LanguageStore.js'
  	export default{
		data(){
			return {
				trad,
				message
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
