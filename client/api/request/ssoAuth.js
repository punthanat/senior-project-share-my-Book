const googleLogin = async () => {
  return window.open(`${process.env.NEXT_PUBLIC_API_URL}/google`, '_self')
}
/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  googleLogin,
}
