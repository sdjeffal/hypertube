import Vue from 'vue'
import Router from 'vue-router'

import Edit from '@/components/EditProfile.vue'
import Login from '@/components/Login.vue'
import Signup from '@/components/Signup.vue'
import ForgottenPassword from '@/components/ForgottenPassword.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import MovieList from '@/components/MovieList.vue'
import MovieCard from '@/components/MovieCard.vue'
import Comments from '@/components/partials/comments/Comments.vue'
import TvCard from '@/components/TvCard.vue'
import Video from '@/components/video.vue'
import middleware from '@/services/Middleware.js'
import infiniteScroll from 'vue-infinite-scroll';
import OtherProfile from '@/components/OtherProfile.vue';

Vue.use(Router)
Vue.use(infiniteScroll)

export default new Router({

  mode: 'hash', //'hash'
  routes: [
  {
    path: '/',
    name: 'Main',
    component: MovieList,
    directives: {infiniteScroll},
    beforeEnter: middleware.showIfLoggued
  },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: middleware.showIfNotLoggued
  },

  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: middleware.showIfNotLoggued
  },

  {
    path: '/profile/forgottenPassword',
    name: 'ForgottenPassword',
    component: ForgottenPassword,
    beforeEnter: middleware.showIfNotLoggued
  },

  {
    path: '/profile/resetPassword',
    name: 'ResetPassword',
    component: ResetPassword,
    beforeEnter: middleware.showIfNotLoggued
  },

  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: Edit,
    beforeEnter: middleware.showIfLoggued
  },

  {
    path: '/MovieCard/:id',
    name: 'MovieCard',
    component: MovieCard,
    beforeEnter: middleware.showIfLoggued
  },
  {
    path: '/TvCard/:id',
    name: 'TvCard',
    component: TvCard,
    beforeEnter: middleware.showIfLoggued
  },

  {
    path: '/profile/:user_id',
    name: 'OtherProfile',
    component: OtherProfile,
    beforeEnter: middleware.showIfLoggued
  },
  {
    path: '/video/:hash',
    name: 'Video',
    component: Video,
    beforeEnter: middleware.showIfLoggued
  },
  {
    path: '*',
    redirect: '/'
  }
  ]
})