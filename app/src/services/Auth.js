
import Vue from 'vue'
import router from "../router"
import userLogguedData from "@/services/User.js"
import LanguageStore from "@/services/LanguageStore.js"
import notif from "@/services/NotificationStore.js"

// URL and endpoint constants
const API_URL = 'http://localhost:3000/'
const LOGIN_URL = API_URL + 'auth/local/login'
const SIGNUP_URL = API_URL + 'auth/local/register'
const USER_DATA_URL = API_URL + 'users/me'
const LOGOUT_URL = API_URL + 'auth/logout'
const RESET_URL = API_URL + 'auth/local/reset'
const CHANGE_PWD = API_URL + 'auth/local/reset/' // :token


export default {


  user: {
    authenticated: false,
    lastName : "",
    firstName : "",
    email : "",
    username : ""
  },


  login(context)
  {
    context.$http.post(LOGIN_URL, {username : context.username, password : context.password}).then( 
      (res) => {
        context.$router.push({name: "Main"})
        setTimeout(() => {notif.showNotification(
          "welcome" ,
          "alert-success",
          true
          )}, 1000)
      },
      (res) => {
        notif.showNotification(
          res.body ? res.body.message : "database error",
          "alert-danger",
          true
          )
        if (res.body.message !== "user unconfirmed")
          context.password = ""
      })
  },

  signup(context)
  {
    //console.log("sign up")
    context.$http.post(SIGNUP_URL, context.fileUploadFormData).then(
      (res) => {
            //console.log("success")
            notif.showNotification(
              res.body.message,
              "alert-success",
              true
              )
            context.$router.push({name: "Main"})
            context.fileUploadFormData = new FormData()
          },
          (res) => {
            //console.log("error")
            //context.etat.formInvalid = true
            notif.showNotification(
              res.body ? res.body.message : "database error",
              "alert-danger",
              true
              )
            context.picturePath = ""
            context.fileUploadFormData = new FormData()
          })
  },

  newEmail(context)
  {
    //console.log("newEmail")
    context.$http.post(RESET_URL, {email : context.email}).then(
      res => {
        console.log(res.body)
        notif.showNotification(
          res.body.message,
          "alert-success",
          true
          )
      },
      res => {
        console.log(res.body)
        notif.showNotification(
          res.body ? res.body.message : "database error",
          "alert-danger",
          true
          )
      })
  },

  resetPassword(context, id)
  {
    //console.log("resetPassword")
    //console.log(id)
    context.$http.post(CHANGE_PWD + id, {password : context.password}).then(
      res => {
        //console.log(res.body)
        notif.showNotification(
          res.body.message,
          "alert-success",
          true
          )
        context.$router.push({ name: 'Login' })
      },
      res => {
        console.log(res.body)
        notif.showNotification(
          res.body ? res.body.message : "database error",
          "alert-danger",
          true
          )
      })
  },

  logout(context) {
    context.$http.get(LOGOUT_URL).then(
      (res) => {
        this.user.authenticated = false
        userLogguedData.eraseUserData()
        context.$router.push({ name: 'Login' })
      })
  },

  checkAuth() {
    // console.log("checkAuth : " + this.user.authenticated)      
    return this.user.authenticated
  },

  getUserLogguedData(next)
  {
    Vue.http.get(USER_DATA_URL).then(
      (res) => {
      if (res.body.status === 'unauthorized')
      {
        if (next)
               next({ name: 'Login' })
      }
      else
      {
        this.user.authenticated = true
        userLogguedData.populate(res.body.user)
        if(userLogguedData.data.language !== (LanguageStore.lang.fr ? "fr" : "en"))
        {
        //console.log("switch lang")
        LanguageStore.changeLang()
      }
      // console.log("getUserLogguedData : " + this.user.authenticated)
      // console.log(userLogguedData.data)
      if (next)
        next()}
    }).catch((err) => {})
    // (res) => {
    //   // console.log("getUserLogguedData : " + this.user.authenticated)
    //   if (next)
    //     next({ name: 'Login' })
    // })
  }
}