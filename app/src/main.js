import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import router from './router'
import load from './services/Loading.js'
Vue.config.productionTip = false;


Vue.use(VueResource)
Vue.http.options.credentials = true
Vue.http.interceptors.push((request, next) =>{
	if (!request.url.includes("usernameExists") 
		&& !request.url.includes("emailExists")
		&& !request.url.includes("users")
		&& !request.url.includes("auth/local/login")
		&& !request.url.includes("movies/movie")
		&& !request.url.includes("movies/tv")
		&& !request.url.includes("comments")
		&& !request.url.includes("torrents/")
		)
	{
		load.data.loading = true;
		next((response)=> {
			load.data.loading = false;
		})
	}
	else
		next()	
})

export default new Vue({

	el: '#app',
	router,
	template: '<App/>',
	components: { App }
})