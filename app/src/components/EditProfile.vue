<template>
	<div class="container">
		<div class="row">
			<div class="col-md-offset-2 col-md-7">
				<h1>{{Version("modifier")}}<br/></h1>
			</div>
		</div>
		<form @submit="updateUser">
			<div class="row">
				<div class="col-md-offset-2 col-md-3">
					<div class="form-group">
						<label for="Nom">{{Version('nom')}}</label>
						<input type="text" class="form-control" id="nom" :placeholder="Version('nom')" v-model="lastName" @blur="check_name('lastName', lastName)" @focus="etat.lastName = false">
						<div class="alert alert-danger alert-dismissable fade in" v-show="etat.lastName">
							<a class="close" @click="etat.lastName = false" aria-label="close">&times;</a>
							{{Version(setErrorMessage('lastName'))}}
						</div>
					</div>
				</div>
				<div class="col-md-offset-1 col-md-3">
					<div class="form-group">
						<label for="Prenom">{{Version('prenom')}}</label>
						<input type="text" class="form-control" id="prenom" :placeholder="Version('prenom')" v-model="firstName" @blur="check_name('firstName',firstName)" @focus="etat.firstName = false">
						<div class="alert alert-danger alert-dismissable fade in" v-show="etat.firstName">
							<a class="close" @click="etat.firstName = false" aria-label="close">&times;</a>
							{{Version(setErrorMessage('firstName'))}}
						</div>
					</div>
				</div>
			</div>
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
			<div class="row" v-if="showEmail">
				<div class="col-md-offset-2 col-md-7">
					<div class="form-group">
						<label for="email">{{Version('email')}}</label>
						<input type="text" class="form-control" id="email" :placeholder="Version('emailInput')" @blur="check_email()" @focus="etat.email = false" v-model="email">
						<div class="alert alert-danger alert-dismissable fade in" v-show="etat.email">
							<a class="close" @click="etat.email = false" aria-label="close">&times;</a>
							{{Version(setErrorMessage('email'))}}
						</div>
					</div>
				</div>
			</div>
			<div class="row" v-if="showEmail">
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
				<div class="col-md-offset-2 col-md-7">
					<label>{{Version('photo')}}</label>
					<div class="input-group file">
						<label class="input-group-btn"> 
							<span class="btn  btn-github" @click="etat.picturePath = false">
								{{Version('upload')}}
								<input id="file" type="file" style="display: none;" accept=".png, .jpg, .jpeg, .gif, .bpm" @change="uploadPicture" ref="picturePath">
							</span>
						</label>
						<input type="text" v-model="picturePath" class="form-control" readonly id="input_file">
					</div>
					<div class="alert alert-danger alert-dismissable fade in" v-show="etat.picturePath">
						<a class="close" @click="etat.picturePath = false" aria-label="close">&times;</a>
						{{Version(setErrorMessage('picturePath'))}}
					</div>
				</div>
			</div>
			<br />
			<div class="row">
				<div class="col-md-offset-2 col-md-3">
					<router-link :to="{name: 'OtherProfile', params : {user_id : id}}"><button type="button" class="btn btn-block btn-large btn-github">{{Version('MyProfile')}}</button></router-link>
				</div>
				<div class="col-md-offset-2 col-md-2">
					<button type="submit" class="btn btn-block btn-large btn-github">{{Version('connect')}}</button>
				</div>
			</div>
		</form>
	</div>
</form>
</template>

<script >
	import message from '@/lang/Auth.js'
	import trad from '@/services/LanguageStore.js'
	import user from '@/services/User.js'
	import auth from '@/services/Auth.js'
	import validator from "@/services/Validator.js"
	import notif from "@/services/NotificationStore.js"

	export default{
		data() {
			return {
				lastName : user.data.lastName,
				firstName : user.data.firstName,
				username: user.data.username,
				email : user.data.email,
				password : "",
				password2 : "",
				picturePath: "",
				id : user.data._id,

				etat: {
					lastName : false,
					firstName : false,
					username  : false,
					email : false,
					password : false,
					password2 : false,
					picturePath : false,
				},

				valid : {
					lastName : false,
					firstName : false,
					email : false,
					password : false,
					password2 : false,
					picturePath : false,
				},

				emailExists : false,
				fileUploadFormData: new FormData(),
			}
		},

		computed : {
			showEmail : function () {
				if (user.data.loginInfo.provider === 'Local')
					return true
				return false
			}
		},

		methods : {
			Version(key) {
				return trad.getContent(message)[key]
			},

			setErrorMessage(key) {
				return trad.getErrorMessage(key, this)
			},

			check_name(key, str) {
				validator.onlyLetters(this, key, str)
			},

			check_login_filed() {
				validator.loginExists(this, 'no')
			},

			check_email(){
				validator.emailValid(this)
				validator.emailExists(this)
			},

			check_password()
			{
				validator.securityPwd(this)
				validator.verifPwd(this)
			},

			check_password2() {
				validator.verifPwd(this)
			},

			uploadPicture(e) {
				e.preventDefault();
				if (e.target.files)
				{
					this.picturePath = e.target.files[0].name
					validator.formatImg(this)
					if (this.valid.picturePath)
						this.fileUploadFormData.append('file', e.target.files[0])
				}
			},

			updateUser(e) {
				e.preventDefault()
				$(':focus').blur()
				let change = false
				if (validator.editValid(this))
				{
					for(let key in this.etat)
					{
						if (this[key] !== "" && key !== 'password2' && this[key] !== auth.user[key])
						{
							if (key !== 'picturePath')
							{
								//user.data[key] = this[key]
								this.fileUploadFormData.append(key, this[key])
							}
							change = true
						}
					}
					if (change)
						user.update(this)
					else
					{
						notif.showNotification(
							"noChange",
							"alert-info",
							true
							)
					}
				}
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