<template>
	<div>
		<div class="container">
			<h1>{{user.username}}</h1>
			<div class="col-md-offset-2 col-md-3">
				<img :src="user.picturePath">
			</div>
			<div class="yolo col-md-offset-1 col-md-3">
				<span class="badge">{{Version('nom')}} : {{user.lastName}}</span>
				<br/>
				<span class="badge">{{Version('prenom')}} : {{user.firstName}}</span>
			</div>

		</div>
		<div class="container">
			<button v-if="!showComments"type="button" @click="loadUserComments()"class="btn btn-block btn-large btn-github">{{Version('SeeComments')}}</button>
			<br/>
			<comments v-if="showComments" />
			<p v-if="NoComments">{{Version('NoComments')}}</p>
		</div>
	</div>
</template>

<script >
	import message from '@/lang/Auth.js'
	import trad from '@/services/LanguageStore.js'
	import user from '@/services/User.js'
	import CommentStore from '@/services/CommentStore.js'
	import Comments from '@/components/partials/comments/Comments.vue'



	export default{
		data() {
			return {
				user : {
					firstName : "",
					lastName : "",
					username : "",
					picturePath : "",
				},
				showComments : false,
				NoComments : false,
			}
		},
		created () {
			user.getUserData(this, this.$route.params.user_id)
		},

		// destroyed () {
		// 	CommentStore.clearComments()
		// },

		computed : {
			
		},

		methods : {
			Version(key) {
				return trad.getContent(message)[key]
			},

			loadUserComments () {
				this.showComments = true,
				CommentStore.getUserComments(this, this.$route.params.user_id)
			},
		},

		components: {
			Comments,
		}
	}
</script>

<style scoped>
	img {
		width: 200px;
		height: 200px;
		border-radius: 40px;
		margin-top: 0px;
	}

	.yolo {
		margin-top: 30px;
	}

	.badge {
		margin: 20px auto;
	}

	button {
		margin: 50px auto;
		width: auto;
	}
</style>