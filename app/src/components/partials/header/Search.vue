<template>
  <div id="search-form" class="navbar-form navbar-center" role="form">

    <div id="search" class="input-group">
      <input v-model="SearchStore.video_query" id="search"  type="text" :placeholder="Version('placeholder')" class="form-control" autocomplete="off">
      <div class="input-group-addon">
        <li class="dropdown">
          <a v-model="SearchStore.type" id="button" class="dropdown-toggle" data-toggle="dropdown" href="#">
            <span v-if="movies_search.data.movies">{{Version('movies')}}</span>
            <span v-else>{{Version('TVshow')}}</span>
            <span class="caret"></span>
          </a>
          <ul class="dropdown-menu">
            <li @click="ChangeToMovie">{{Version('movies')}}</li>
            <li @click="ChangeToTVshow">{{Version('TVshow')}}</li>
          </ul>
        </li>
      </div>
    </div>

  </div>
</template>

<script>

  import message from '@/lang/Search.js'
  import movies_search from '@/services/Search.js'
  import trad from '@/services/LanguageStore.js'
  import SearchStore from '@/services/SearchStore.js'

  export default {
    data () {
      return {
        trad,
        message,
        video_query : "",

        movies : true,
        SearchStore,

        movies_search

      }
    },
    methods: {
      Version(key) {
        return trad.getContent(message)[key]
      },
      ChangeToMovie() {
        movies_search.data.movies = true;
        SearchStore.type = true;
        movies_search.data.category = "movie";
        movies_search.data.page = 1;
        movies_search.data.movies_list = [];
        movies_search.search(this, movies_search)
      },
      ChangeToTVshow() {
        movies_search.data.movies = false;
        SearchStore.type = false;
        movies_search.data.category = "tv";
        movies_search.data.page = 1;
        movies_search.data.movies_list = [];
        movies_search.search(this, movies_search)
      }
    }
  }
</script>

<style scoped>

  a {
    color:#9d9d9d;
  }

  a:hover, a:focus, a:active {
    text-decoration: none;
    color:white;
  }
  .dropdown-menu {
    background-color: #292b2c;
    min-width: 20px;
       border: 1px solid black;
  }

  .input-group-addon {
   border: 1px solid black;
   background-color: transparent;
   background-image: none;
   border-radius: 0 10px 10px 0;
 }

 .dropdown-menu > li {display: block; color: #9d9d9d;}

 .dropdown-menu > li:hover {
  color: white;
  background-color: #292b2c;
  background-image: none;
  cursor: pointer;
}

#search {
  background-color: #292b2c;
  border-color: #101010;
  border-radius: 10px 0 0 10px;
  color: white;
  width: 20vw;
}

#search-form {
  display:inline-block; 
}

input:focus::placeholder { color:transparent; }

@media (max-width: 767px) {
  #search-form {
    width: 100%;
  }
  #search {
    width: 100%;
  }
}


</style>

<!-- verifier que message est une string -->