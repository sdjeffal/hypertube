<template>
  <div>
   <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <logo-title class="navbar-brand"/>
        <div v-if="loggued.authenticated">
          <sandwich class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar"/>
        </div>
        <div v-else id="collapsed-lang" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <choose-language/>
        </div>
        
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <search v-if="Route()"/>
        <ul class="nav navbar-nav navbar-right">
          <my-profile v-if="loggued.authenticated"/>
          <choose-language/>
        </ul>
      </div>
    </div>
  </nav>
</div>
</template>

<script>
 import LogoTitle from "./partials/header/LogoTitle.vue"
 import Sandwich from "./partials/header/Sandwich.vue"
 import Search from "./partials/header/Search.vue"
 import MyProfile from "./partials/header/MyProfile.vue"
 import ChooseLanguage from "./partials/header/ChooseLanguage.vue"
 //store
 import auth from "../services/Auth.js"
 
 export default {
  data () {
    return {
      loggued: auth.user
    }
  },

  methods : {
      Route () {
        if (this.$route.name === 'Main')
          return true
        return false
      }
    },

  components: {
    LogoTitle,
    Sandwich, 
    Search,
    MyProfile,
    ChooseLanguage
  }
}
</script>

<style src="../../static/css/languages.css"></style>
<style scoped>
  #collapsed-lang {
    list-style-type: none;
  }
</style>