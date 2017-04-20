<template>
	<div class="notifications">
		<notification v-for="notification in notifications" :notification="notification" :key="notification.text" transition="fade">
		</notification>
	</div>
</template>


<script>
	import notification from "./partials/NotificationUniq.vue"
	import NotificationStore from "@/services/NotificationStore.js"


	export default {
		data () {
			return {
				notifications: NotificationStore.state
			}
		},
		
		components: {
			notification,
		}
	}
</script>

<style scoped>
	.notifications {
		position: fixed;
		right: 10px;
		top: 60px;
		width: 350px;
		z-index: 1;
	}
</style>