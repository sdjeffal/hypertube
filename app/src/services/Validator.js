import auth from "@/services/Auth.js"
import notif from "@/services/NotificationStore.js"

export default {

  loginExists(context, want_to) {
    if (context.username)
      context.$http.post('http://localhost:3000/users/usernameExists', {username : context.username}).then(
        (response) => {
          if (want_to === 'yes')
          {
            if (response.body.message === "username not exists")
            {
              context.etat.username = true
              context.loginExists = false
            }
            else
              context.loginExists = true
          }
          else if (want_to === 'no')
          {
            if (response.body.message === "username exists")
            {
              context.etat.username = true;
              context.loginExists = true
            }
            else
              context.loginExists = false
          }
        },
        (response) => {
          if (!response.body)
            notif.showInternalErrorNotification()
        })
  },

  onlyLetters(context, key, str) {
    context.etat[key] = /[^a-zàâçéèêëîïôûùaüæœ-]/i.test(str)
    context.valid[key] = !context.etat[key]
  },

  emailValid(context) {
    if (context.email)
    {
      let reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i')
      context.etat.email = !reg.test(context.email)
      context.valid.email = !context.etat.email
    }
  },

  emailExists(context) {
    if (context.email && context.valid.email && context.email !== auth.user.email)
      context.$http.post('http://localhost:3000/users/emailExists', {email : context.email}).then(
        (response) => {
          if (response.body.message === "email exists")
          {
            context.etat.email = true
            context.emailExists = true
          }
          else
           context.emailExists = false
       },
       (response) => {
        if (!response.body)
          notif.showInternalErrorNotification()
      })
  },

  securityPwd(context) {
    let reg = new RegExp('(?=(.*[a-z]){4,})(?=(.*[0-9]){1,})')
    if (context.password && !reg.test(context.password))
    {
      context.etat.password = true
      context.valid.password = false
    }
    else
      context.valid.password = true

  },

  verifPwd(context) {
    if (context.password && !context.etat.password && context.password2 && context.password !== context.password2)
    {
      context.etat.password2 = true
      context.valid.password2 = false
    }
    else if (context.etat.password || !context.password)
      context.password2 = ""
    else
      context.valid.password2 = true

  },

  formatImg(context) {
    let reg = new RegExp((/\.(gif|jpe?g|png|bpm)$/i))
    context.etat.picturePath = !reg.test(context.picturePath)
    context.valid.picturePath = !context.etat.picturePath
    //console.log("context.etat.picturePath : ", context.etat.picturePath)
  },

  signupValid(context) {
    var validForm = true
    for(let key in context.etat)
    {
      if (context[key] === "")
      {
        context.etat[key] = true
        validForm = false
      }
    }
    for(let key in context.valid)
    {
      if (context.valid[key] === false)
      {
        context.etat[key] = true
        validForm = false
      }
    }
    if (context.emailExists)
    {
      context.etat.email = true
      validForm = false
    }
    if (context.loginExists)
    {
      context.etat.username = true
      validForm = false
    }
    return validForm
  },

  editValid(context) {
    let validForm = true
    for(let key of ['lastName', 'firstName', 'username', 'email'])
    {
      if (context[key] === "" && context[key] !== auth.user[key])
      {
        context.etat[key] = true
        validForm = false
      }
    }
    for(let key of ['password', 'password2', 'picturePath'])
    {
      if (context[key] === "")
        context.valid[key] = true
    }
    if (context.password2 === "" && context.password !== "")
      context.valid.password2 = false
    for(let key in context.valid)
    {
      if (context.valid[key] === false && context[key] !== auth.user[key])
      {
        context.etat[key] = true
        validForm = false
      }
    }
    if (context.emailExists)
    {
      context.etat.email = true
      validForm = false
    }
    return validForm
  }
}