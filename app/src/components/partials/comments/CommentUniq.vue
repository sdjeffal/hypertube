<template>
	<transition name="fade" enter-active-class="fadeInDown" leave-active-class="fadeOutDown">
		<div class="comment animated">
			<router-link :to="{name : 'OtherProfile', params : {user_id : comment.user.id}}">
				<img :src="comment.user.profile_pic">
				<span>{{comment.user.username}}</span>
			</router-link>
			<span style="font-style:italic;">{{getTimeFromNow()}}</span>
			<router-link v-if="User()" :to="{name : 'Video', params : {hash : comment.torrentHash}}">
				<span class="badge" style="font-style:italic;">{{ Version("torrents") }}</span>
			</router-link>
			<p>{{comment.message.text}}</p>
		</div>
	</transition>
</template>

<script>
	import CommentStore from "@/services/CommentStore.js"
	import moment from "moment"
	import app from '@/main.js'
	import trad from '@/services/LanguageStore.js'
	import message from '@/lang/MyProfile.js'

	export default {
		props: ['comment'],

		methods : {
			Version(key) {
				return trad.getContent(message)[key]
			},

			getTimeFromNow() {
				return moment(this.comment.message.time).fromNow()
			},

			User () {
				return (this.$route.params.user_id ? true : false)
			},
		}
	}
</script>

<style scoped>
	.comment {
		border: 1px solid #292b2c;
		background-color: #292b2c;
		background-image: none;
		border-color: #101010;
		border-radius: 10px;
		color: white;
		width: 20vw;
		min-width : 280px;
		margin : 5px auto;
	}

	img {
		width: 20px;
		height: 20px;
		border-radius: 4px;
		margin-top: 0px;
	}

	.badge:hover {
		background-color: #9d9d9d;
	}

	p {
		text-align: right;
		margin-right: 5px;
		word-wrap: break-word;
	}
</style>

