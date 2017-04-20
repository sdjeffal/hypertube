<template>
	<div class="comments">
		<create-comment v-if="!User()" />
		<comment v-for="comment in comments" :comment="comment" :key="comment" transition="fade">
		</comment>
	</div>
</template>


<script>
	import comment from "./CommentUniq.vue"
	import createComment from "./NewComment.vue"
	import CommentStore from "@/services/CommentStore.js"
	import app from '@/main.js'


	export default {
		data () {
			return {
				comments: CommentStore.state
			}
		},

		methods : {
			User () {
				return (app.$route.params.user_id ? true : false)
			},
		},

		created () {
			CommentStore.clearComments()
			if (app.$route.params.hash)
				CommentStore.populate(this, app.$route.params.hash)
		},

		// destroyed () {
		// 	CommentStore.clearComments()
		// },
		
		components: {
			comment,
			createComment

		}
	}
</script>

<style scoped>
	.comments  {
		text-align: left;
	}
	.comments > form {
		text-align: center;
	} 
</style>