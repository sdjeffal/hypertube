const API_URL = 'http://localhost:3000/'
const SEARCH_URL = API_URL + "search"

import load from "./Loading.js"
import SearchStore from '@/services/SearchStore.js'
export default{
	data : {
    movies : true,
    movies_list : [],
    genre : "",
    anne : {
    	i: "",
    	j: ""
    },
    imdb: {
    	i : "",
    	j : ""
    },
    page : 1,
    sort : "",
    category : "movie",

  },

  	search (that, context, category) {
  		that.$http.post(`http://localhost:3000/search/list/${encodeURIComponent(context.data.category)}/${encodeURIComponent(context.data.page)}`, {genres: context.data.genres, voteAverage: {gte: context.data.imdb.i, lte : context.data.imdb.j}, releaseDate:{gte: context.data.anne.i, lte : context.data.anne.j}, sortBy : context.data.sort}, {
            before(request) {
              if (that.previousRequest){
                that.previousRequest.abort();
              }
              that.previousRequest = request;
            }}).then((response) => {
			that.query = response.body.results;
			context.data.page++;
			that.busy = false;
      SearchStore.video_query = "";
			context.data.movies_list = context.data.movies_list.concat(that.query);
			for(var i= 0; i < context.data.movies_list.length; i++)
			{
				if (context.data.anne.i && context.data.anne.j)
				{
					if (parseInt(context.data.movies_list[i].release_date.substr(0,4)) < parseInt(context.data.anne.i.substr(0 ,4)) || parseInt(context.data.movies_list[i].release_date.substr(0,4)) > parseInt(context.data.anne.j.substr(0 ,4)))
					{
						context.data.movies_list.splice(i, 1)
						i = i - 1;
					}
				}
			}
		}, response => {});
  	},
}