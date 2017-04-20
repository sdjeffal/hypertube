<template>

	<li class="dropdown">
		<a id="button" class="dropdown-toggle" data-toggle="dropdown" href="#">
			<span v-if="lang.fr" class="lang-sm" lang="fr"></span>
			<span v-else class="lang-sm" lang="en"></span>
			<span class="caret"></span>
		</a>
		<ul class="dropdown-menu">
			<li @click="changeToFr"><span class="lang-sm" lang="fr"></span> fr</li>
			<li @click="changeToEn"><span class="lang-sm" lang="en"></span> en</li>
		</ul>

	</li>
</template>

<script>
	import moment from "moment"
	import trad from "@/services/LanguageStore.js"
	import user from "@/services/User.js"
	import auth from "@/services/Auth.js"
	
	export default {
		data () {
			return {
				lang : trad.lang,
				fileUploadFormData: new FormData(),
			}
		},

		methods: {
			changeToFr() {
				if (this.lang.fr == false)
				{
					trad.changeLang()
					this.changeUserLang()
					moment.locale('fr')
				}
			},

			changeToEn() {
				if (this.lang.fr == true)
				{
					trad.changeLang()
					this.changeUserLang()
					moment.locale('en')
				}
			},

			changeUserLang() {
				if (auth.user.authenticated)
				{
					this.fileUploadFormData.append('language', (trad.lang.fr ? "fr" : "en"))
					user.update(this)
				}

			},
		}
	}
</script>

<style scoped>

	#button:active, #button:focus {
		background-color: transparent;
		background-image: none;
	}

	.dropdown-menu {
		background-color: #292b2c;
		min-width: 67px;
	}

	.dropdown-menu > li {display: block; margin: 0 11px; color: #9d9d9d;}

	.dropdown-menu > li:hover {
		color: white;
		background-color: #292b2c;
		background-image: none;
		cursor: pointer;
	}

	@media (max-width: 767px) {
		li {display: inline-block;}

	}

</style>