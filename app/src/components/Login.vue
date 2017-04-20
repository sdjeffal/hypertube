<template>
	<div class="container">
		<div class="row">
			<div class="col-md-offset-2 col-md-8">
				<h1>{{Version('connexion')}}<br/></h1>
			</div>
		</div>
		<div class="row">
			<div class="col-md-offset-2 col-md-3">
				<div class="form-group">
					<a class="btn btn-block btn-social btn-github" href="http://localhost:3000/auth/facebook">
						<span class="fa fa-facebook-square"></span>{{Version('facebook')}}
					</a>
				</div>
			</div>

			<div class="col-md-offset-1 col-md-3">
				<div class="form-group">
					<a class="btn btn-block btn-social btn-github" href="http://localhost:3000/auth/42"><img src="../assets/images/42.png">
						<span class=""></span>{{Version('school')}}
					</a>
				</div>
			</div>
		</div>
		<form @submit="connexion">
			<div class="row">
				<div class="col-md-offset-2 col-md-7">
					<div class="form-group">
						<label for="Login">{{Version('username')}}</label>
						<input type="text" class="form-control" id="login" :placeholder="Version('usernameInput')" @blur="check_login_filed()" @focus="etat.username = false" v-model="username">
						<div class="alert alert-danger alert-dismissable fade in" v-show="etat.username">
							<a class="close" @click="etat.username = false" aria-label="close">&times;</a>
							{{Version(setErrorMessage('username'))}}
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-offset-2 col-md-7">
					<div class="form-group">
						<label for="Password">{{Version('password')}}</label>
						<div class="input-group">
							<input type="password" class="form-control" id="password" :placeholder="Version('password')" v-model="password" @focus="etat.password = false">
							<router-link class="input-group-addon col-1 col-1" :to="{name: 'ForgottenPassword'}">forgotten password ?
							</router-link>
						</div>
						<div class="alert alert-danger alert-dismissable fade in " v-show="etat.password">
							<a class="close" @click="etat.password = false" aria-label="close">&times;</a>
							{{Version(setErrorMessage('password'))}}
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-offset-2 col-md-2">
					<router-link :to="{name: 'Signup'}"><button type="button" class="btn  btn-block btn-large btn-github">{{Version('signup')}}</button></router-link>
					<br />
				</div>
				<div class="col-md-offset-3 col-md-2">
					<button type="submit" class="btn  btn-block btn-large btn-github">{{Version('connect')}}</button>
				</div>
			</div>
		</form>
	</div>
</form>
</template>

<script >
	import message from '../lang/Auth.js'
	import trad from '@/services/LanguageStore.js'
	import auth from "../services/Auth.js"
	import validator from "../services/Validator.js"
	import notif from "@/services/NotificationStore.js"

	export default{
		data() {
			return {
				etat: {
					username : false,
					password : false,
				},
				username : "",
				password : "",
				loginExists : false,
				wrongPassword : false
			}
		},

		created: function () {
			if (this.$route.query.error)
				notif.showNotification(
					"OAuth failed",
					"alert-danger",
					true
					)
		},

		methods : {
			Version(key) {
				return trad.getContent(message)[key]
			},

			setErrorMessage(key) {
				return trad.getErrorMessage(key, this)
			},

			check_login_filed() {
				validator.loginExists(this, 'yes')
			},

			connexion(e, to, next) {
				e.preventDefault();
				$(':focus').blur()
				if (!this.username || !this.password || !this.loginExists)
				{
					if (!this.username || !this.loginExists)
						this.etat.username = true;
					if (!this.password)
						this.etat.password = true;
				}
				else
					auth.login(this)
			}
		}
	}
</script>
<style src="../../static/css/bootstrap-social.css"></style>
<style scoped>
	a {
		text-decoration: none;
	}
</style>