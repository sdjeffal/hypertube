<template>
	<div class="container">
		<div class="row">
			<div class="col-md-offset-2 col-md-8">
				<h1> {{"Reset " + Version('password')}}</h1>
			</div>
		</div>
		<form @submit="resetPwd">
			<div class="row">
				<div class="col-md-offset-2 col-md-3">
					<div class="form-group">
						<label for="Password">{{Version('password')}}</label>
						<input type="password" class="form-control" id="password" :placeholder="Version('password')" v-model="password" @focus="etat.password = false" @blur="check_password()">
						<div class="alert alert-danger alert-dismissable fade in" v-show="etat.password">
							<a class="close" @click="etat.password = false" aria-label="close">&times;</a>
							{{Version(setErrorMessage('password'))}}
						</div>
					</div>
				</div>
				<div class="col-md-offset-1 col-md-3">
					<div class="form-group">
						<label for="Password">{{Version('password2')}}</label>
						<input type="password" class="form-control" id="password2" :placeholder="Version('password2')" v-model="password2" @focus="etat.password2 = false" @blur="check_password2()">
						<div class="alert alert-danger alert-dismissable fade in" v-show="etat.password2">
							<a class="close" @click="etat.password2 = false" aria-label="close">&times;</a>
							{{Version(setErrorMessage('password2'))}}
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-offset-2 col-md-2">
					<router-link :to="{name: 'Login'}"><button type="button" class="btn btn-block btn-large btn-github">{{Version('back')}}</button></router-link>
				</div>
				<div class="col-md-offset-3 col-md-2">
					<button type="submit" class="btn btn-block btn-large btn-github">{{Version('connect')}}</button>
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
	import app from '@/main.js'

	export default{
		data() {
			return {
				password : "",
				password2 : "",

				etat: {
					password : false,
					password2 : false,
				},

				valid : {
					password : false,
					password2 : false,
				},

				fileUploadFormData : true,
			}
		},
		
		methods : {
			Version(key) {
				return trad.getContent(message)[key]
			},

			setErrorMessage(key) {
				return trad.getErrorMessage(key, this)
			},

			check_password()
			{
				validator.securityPwd(this)
				validator.verifPwd(this)
			},

			check_password2() {
				validator.verifPwd(this)
			},


			resetPwd(e) {
				e.preventDefault()
				$(':focus').blur()
				if (this.valid.password && this.valid.password2)
					auth.resetPassword(this, app.$route.query.id)
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