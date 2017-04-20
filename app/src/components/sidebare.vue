<template>
	<div id="sidebare">
		 <div id="icon">
				<span class="glyphicon glyphicon-menu-right" @click="show_navbare" v-if="show"></span>
				<span v-else class="glyphicon glyphicon-menu-left" @click="show_navbare" ></span>

			</div>
		  <div id="slideout">

	    	<div id="slideout_inner" class="selectpicker">
	    		<select @change="sort" >
	    			<option value="0">{{Version('Sort')}}</option>
	    			<option value="1">{{Version('IMDb')}}</option>
	    			<option value="2">{{Version('Anne')}}</option>
	    			<option value="3">{{Version('Name')}}</option>
	    		</select><hr>
	    		<h3 @click="etat.categorie = !etat.categorie, end(etat.categorie, 1)">{{Version('Category')}}</h3><hr>
	    			<categorie v-show="etat.categorie" v-if="movies_search.data.movies"/>
	    			<categorie_tv v-else v-show="etat.categorie"/>
	    		<h3 @click="etat.production = !etat.production, end(etat.production, 2)" v-if="movies_search.data.movies">{{Version('Anne')}}</h3><hr v-if="movies_search.data.movies">
	    			<production v-show="etat.production" v-if="movies_search.data.movies"/>
	    		<h3 @click="etat.imdb = !etat.imdb, end(etat.imdb, 3)">{{Version('IMDb')}}</h3><hr>
	    			<imdb v-show="etat.imdb"/>
	    	</div>
		</div>


	</div>
</template>

<script>
	import message from '@/lang/Sidebare.js'
  	import trad from '@/services/LanguageStore.js'
	import Categorie from "./partials/sidebare/Categorie.vue"
	import Categorie_tv from "./partials/sidebare/Category_tv.vue"
	import Production from "./partials/sidebare/production.vue"
	import Imdb from "./partials/sidebare/Imdb.vue"
	import Search from "./partials/header/Search.vue"
 	import movies_search from '@/services/Search.js'

	export default{
		data() {
			return {
				show : true,
				etat:{
					open : true,
					close : false,
					sidebare : false,
					categorie: false,
					imdb: false,
					production: false,
				},
				movies_search
			}
		},
		components: {
			Categorie,
			Production,
			Imdb,
			Categorie_tv,
		},
		methods : {
			Version(key){
				return trad.getContent(message)[key]
			},
			sort(e)
			{
				movies_search.data.movies_list = [];
				movies_search.data.page = 1;
				if (e.target.value == 0)
					movies_search.data.sort = "";
				else if (e.target.value == 1)
					movies_search.data.sort = "vote_average.desc";
				else if (e.target.value == 2)
					movies_search.data.sort = "release_date.desc";
				else if (e.target.value == 3)
					movies_search.data.sort = "original_title.asc";
				movies_search.search(this, movies_search);
			},
			end(key, i){
				if (!key){
					if (i == 1 && movies_search.data.genres){
						movies_search.data.page = 1;
						movies_search.data.movies_list = [];
						movies_search.data.genres = "";
						movies_search.search(this, movies_search);
					}
					else if (i == 3 && movies_search.data.imdb.j)
					{
						movies_search.data.page = 1;
						movies_search.data.movies_list = [];
						movies_search.data.imdb.i = "";
						movies_search.data.imdb.j = "";
						movies_search.search(this, movies_search);

					}
					else if (i == 2 && movies_search.data.anne.j)
					{
						movies_search.data.page = 1;
						movies_search.data.movies_list = [];
						movies_search.data.anne.i = "";
						movies_search.data.anne.j = "";
						movies_search.search(this, movies_search);
					}
				}

			},
			show_navbare(){
				if (this.show == true){
					document.getElementById('slideout_inner').style.left = "0px";
					document.getElementById('icon').style.left = "220px";
					document.getElementById('icon').style.margin = "0";
				}
				else
				{
					document.getElementById('slideout_inner').style.left = "-250px";
					document.getElementById('icon').style.left = "0";
				}
				this.show = !this.show;
			},
			filtre(){
				if (this.selected == "Catégorie")
				{
					this.etat.imdb = false
					this.etat.anne = false
					this.etat.categorie = true;
				}
				if (this.selected == "Filtrer par")
				{
					this.etat.imdb = false
					this.etat.anne = false
					this.etat.categorie = false	;
				}
			},
		}
	}
</script>

<style type="text/css">
	h3{
		cursor:pointer;
	}
	#icon{
		color : white;
		font-size: 30px;
		cursor:pointer;
		position: fixed;
	    left: 0;
	    -webkit-transition-duration: 0.3s;
	    -moz-transition-duration: 0.3s;
	    -o-transition-duration: 0.3s;
	    transition-duration: 0.3s;
	}
	#sidebare{
		display : flex;
		position: absolute;
		z-index: 1;
	}
	#slideout_inner ul li{
		display : flex;
	}
#slideout {
	color: white; 
    position: fixed;
    left: 0;
    -webkit-transition-duration: 0.3s;
    -moz-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
}
#slideout_inner select{
	color: white;
	background: #222;
	border: none;
}
.list-group a{
	background: #222;
	color: white;
	border: none;
}
#slideout_inner {
	max-width: 217px;
    position: fixed;
    left: -250px;
    background: #222;
    border-radius: 3px;
    margin-top: -7px;
    -webkit-transition-duration: 0.3s;
    -moz-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
    height: 100%;
    overflow-y : auto;
    padding-bottom: 4vw;
}
#slideout_inner select{
	font-size: 23px;
	color: inherit;
	text-align: center;
}
</style>