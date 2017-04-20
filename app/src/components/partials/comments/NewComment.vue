<template>
	<form @submit="postComment" class="navbar-form navbar-center">
		<br />
		<div class="input-group">
			<input v-model="comment" type="text" :placeholder="Version('comment')" class="form-control" autocomplete="off">
			<a id="submit" class="input-group-addon" @click="postComment">
				{{Version('connect')}}
			</a>
		</div>
	</form>
</template>

<script>
	import message from '@/lang/Auth.js'
	import trad from '@/services/LanguageStore.js'
	import CommentStore from "@/services/CommentStore.js"
	import app from '@/main.js'

	export default {
		data () {
			return {
				comment : "",
			}
		},

		methods : {
			Version(key) {
				return trad.getContent(message)[key]
			},

			postComment(e) {
				e.preventDefault();
				$('#submit').css('background-color' ,'#3a3c3d')
				setTimeout(() => { $('#submit').css('background-color' ,'#292b2c')}, 100)
				if (this.comment)
					CommentStore.newComment(this, app.$route.params.hash)
			}
		}
	}
</script>

<style scoped>

	.input-group {
		/*background-color: #292b2c;*/
		border-color: #101010;
		border-radius: 10px 0 0 10px;
		color: white;
		width: 20vw;
		min-width: 280px;
		margin : 5px auto;
	}

	.input-group-addon {
		border: 1px solid #292b2c;
		background-color: #292b2c;
		background-image: none;
		border-radius: 0 10px 10px 0;
	}

	input {
		background-color: #292b2c;
		border-color: #292b2c;
		border-radius: 10px 0 0 10px;
		border-right: 1px solid #9d9d9d;
		color: white;
		width: 20vw;
	}

	a {
		color:#9d9d9d;
		cursor: pointer;
	}

	a:hover {
		text-decoration: none;
		color:white;
	}

	a:active {
		background-color: #3a3c3d;
	}	

	input:focus::placeholder { color:transparent; }

	/*.input-group {
		background-color: #292b2c;
		border-color: #101010;
		border-radius: 10px 0 0 10px;
		color: white;
		width: 20vw;
	}

	.input-group-addon {
		border: 1px solid #292b2c;
		background-color: #292b2c;
		background-image: none;
		border-radius: 0 10px 10px 0;
	}

	input {
		background-color: #292b2c;
		border-color: #292b2c;
		border-radius: 10px 0 0 10px;
		border-right: 1px solid #9d9d9d;
		width: 20vw;
	}
	
	#submit {
		color:#9d9d9d;
		cursor:pointer;
	}

	#submit:hover {
		text-decoration: none;
		color:white;
	}

	#submit:active {

		border: 1px solid lightblue;

	}*/
	
	input:focus::placeholder { color:transparent; }

</style>