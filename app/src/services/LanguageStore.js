export default {

  lang: {
    fr: false
  },

  changeLang()
  {
  	this.lang.fr = !this.lang.fr
  },

  getContent(trad)
  {
  	if (this.lang.fr)
  		return trad.fr
  	else
  		return trad.en
  },

  getErrorMessage(key, context)
  {
    switch (key) {

      case 'username':
      if (!context.username)
        return 'error_vide'
      else if (context.loginExists && context.fileUploadFormData)
        return 'UserExists'
      return 'noUserExists'
      break;

      case 'password':
      if (!context.password)
        return 'error_vide'
      return 'wrong_pwd_format'
      break;

      case 'lastName':
      if (!context.lastName)
        return 'error_vide'
      return 'only_letters'
      break;

      case 'firstName':
      if (!context.firstName)
        return 'error_vide'
      return 'only_letters'
      break;

      case 'email':
      if (!context.email)
        return 'error_vide'
      else if (!context.valid.email)
        return 'email_invalid'
      else
        return 'email_used'
      break;

      case 'password2':
      if (!context.password2)
        return 'error_vide'
      return 'different_pwd'
      break;

      case 'picturePath':
      if (!context.picturePath)
        return 'error_vide'
      return 'imgWrongFormat'
      break;
    }
  },

}