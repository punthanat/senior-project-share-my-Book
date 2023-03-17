import regex from './regex'

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    ? true
    : false
}

export const validateTel = (tel) => {
  return tel.match(/^([0-9]){10,10}$/) ? true : false
}

export const validatePassword = (password) => {
  return regex.passwordRegex.test(password) ? true : false
}
