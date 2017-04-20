<template>
	<li class="dropdown">
		<a id="button" class="dropdown-toggle" data-toggle="dropdown" href="#">

			<img :src="getImage()">
			<span class="caret"></span>
		</a>
		<ul class="dropdown-menu">
			<li><router-link :to="{name: 'EditProfile'}"><span>{{ Version("edit_profile")}}</span></router-link></li>
			<!-- <li><router-link :to="{name: 'MyMovies'}"><span>{{ Version("my_movies")}}</span></router-link></li> -->
			<li><a @click="Logout()">{{ Version("logout") }}</a></li>

		</ul>
	</li>
</template>

<script>
	import message from '@/lang/MyProfile.js'

	import auth from '@/services/Auth.js'
	import user from '@/services/User.js'
	import trad from '@/services/LanguageStore.js'
	
	export default {
		data () {
			return {
				trad,
				message,
				user
			}
		},
		methods: {
			Logout() {
				auth.logout(this)
			},
			Version(key) {
				return trad.getContent(message)[key]
			},
			getImage() {
				if (user.data.picturePath)
					return user.data.picturePath
				else
					return "http://img.freepik.com/free-icon/user-image-with-black-background_318-34564.jpg?size=338c&ext=jpg"

			}
		}
	}

</script>

<style scoped>

	img {
		width: 25px;
		height: 25px;
		border-radius: 5px;
		margin-top: -3px;
	}
	#button:active, #button:focus {
		background-color: transparent;
		background-image: none;
	}
	.dropdown-menu {
		background-color: #292b2c;
	}
	.dropdown-menu li a {
		color: #9d9d9d;
		text-shadow: 0 -1px 0 rgba(0,0,0,.25);
	}
	.dropdown-menu > li > a:hover {
		color: white;
		background-color: #292b2c;
		background-image: none;
		cursor: pointer;
	}

	@media (max-width: 767px) {
		.dropdown {display: inline-block;}
	}
</style>