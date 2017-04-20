<template>
	<transition name="fade" enter-active-class="fadeInDown" leave-active-class="fadeOutDown">
		<div class="alert notification animated" :class="notification.type">
			<a class="close" @click="deleteNotif" aria-label="close">&times;</a>
			<p>
				{{Version(notification.text)}}
				{{username()}}
			</p>
		</div>
	</transition>
</template>

<script>
	import NotificationStore from "@/services/NotificationStore.js"
	import message from '@/lang/Auth.js'
	import trad from '@/services/LanguageStore.js'
	import user from "@/services/User.js"

	export default {
		props: ['notification'],

		methods : {
			Version(key) {
				return trad.getContent(message)[key]
			},

			deleteNotif() {
				NotificationStore.removeNotification(this.notification)
			},
			username() {
				if (this.notification.text === 'welcome')
					return user.data.username + " !"
			}
		}
	}
</script>

<style scoped>
	.notification p {
		margin-right: 20px;
	}
</style>

