<template>
	<div class="container">
		<div class="row">
			<div class="col-md-offset-2 col-md-8">
				<h1> {{Version('email')}}</h1>
			</div>
		</div>
		<form @submit="sendEmail">
			<div class="row">
				<div class="col-md-offset-2 col-md-7">
					<div class="form-group">
						<input type="text" class="form-control" id="email" :placeholder="Version('emailInput')" @blur="check_email()" @focus="etat.email = false" v-model="email">
						<div class="alert alert-danger alert-dismissable fade in" v-show="etat.email">
							<a class="close" @click="etat.email = false" aria-label="close">&times;</a>
							{{Version(setErrorMessage('email'))}}
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


	export default{
		data() {
			return {
				email : "",

				etat: {
					email : false,
				},

				valid : {
					email : false,
				},
			}
		},
		
		methods : {
			Version(key) {
				return trad.getContent(message)[key]
			},

			setErrorMessage(key) {
				return trad.getErrorMessage(key, this)
			},

			check_email(){
				validator.emailValid(this)
			},

			sendEmail(e) {
				e.preventDefault()
				$(':focus').blur()
				if (this.valid.email)
					auth.newEmail(this)
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