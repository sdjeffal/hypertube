import auth from "@/services/Auth.js"
import notif from "@/services/NotificationStore.js"

const API_URL = 'http://localhost:3000/'
const UPDATE_USER_URL = API_URL + 'users/me'
const OTHER_USER_URL = API_URL + 'users/' // :user_id



export default {

  data : {
    _id : "",
    username : "",
    lastName : "",
    firstName : "",
    picturePath : "",
    email : "",
    language : "",
    torrentsViewed : [],
    moviesViewed : [],
    loginInfo : {
      provider : ""
    }
  },

  populate (User) 
  {
    for (var prop in User)
    {
      if (User.hasOwnProperty(prop) && this.data.hasOwnProperty(prop))
        this.data[prop] = User[prop]
    }
    for (let key of ['lastName', 'firstName', 'email', 'username'])
    {
      if (User.hasOwnProperty(key))
        auth.user[key] = User[key]
    }
  },

  eraseUserData ()
  {
    for (let prop in this.data)
    {
      if (prop.constructor === Array)
        this.data[prop] = []
      else
        this.data[prop] = ""
    }
    for (let key of ['lastName', 'firstName', 'email'])
      auth.user[key] = ""
  },

  update (context)
  {
    //console.log("call a l'api pour update le user loggued")
    context.$http.put(UPDATE_USER_URL, context.fileUploadFormData).then(
      (res) => {
        if (res.body.fields.indexOf('language') === -1)
        {
          notif.showNotification(
            res.body.message,
          //res.body.status === "success" ? "alert-success" : "alert-danger",
          "alert-success",
          true
          )
        }
        context.fileUploadFormData = new FormData()
        context.picturePath = ""
        auth.getUserLogguedData()
        //context.$router.push({name: "Main"})
      },
      (res) => {
        //console.log('error' + res.body)
        notif.showNotification(
          res.body ? (res.body.err.message ? res.body.err.message : res.body.message) : "database error",
          "alert-danger",
          true
          )
        context.fileUploadFormData = new FormData()
        context.picturePath = ""
      })
  },

  getUserData(context, user_id)
  {
    context.$http.get(OTHER_USER_URL + encodeURIComponent(user_id)).then(
      (res) => {
        for (let prop in context.user)
        {
          context.user[prop] = res.body.user[prop]
        }
      },
      (res) => {
        notif.showNotification(
          res.body ? (res.body.err.message ? res.body.err.message : res.body.message) : "database error",
          "alert-danger",
          true
          )
        
      })
  },
}