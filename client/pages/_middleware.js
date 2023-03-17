import {NextResponse} from 'next/server'
import jwt_decode from 'jwt-decode'

const middleware = (req) => {
  const {cookies} = req
  const authToken = cookies.jwt
  const url = req.url
  const currentUrl = req.nextUrl.clone()

  if (
    authToken &&
    jwt_decode(authToken)?.role === 'admin' &&
    !url.includes('/admin')
  ) {
    currentUrl.pathname = '/admin'
    return NextResponse.redirect(currentUrl)
  }

  if (url.includes('/admin')) {
    if (!authToken) {
      currentUrl.pathname = '/'
      return NextResponse.redirect(currentUrl)
    }
    try {
      jwt_decode(authToken)
      if (jwt_decode(authToken)?.role === 'admin') {
        return NextResponse.next()
      } else {
        currentUrl.pathname = '/'
        return NextResponse.redirect(currentUrl)
      }
    } catch (e) {
      currentUrl.pathname = '/'
      return NextResponse.redirect(currentUrl)
    }
  }

  if (url.includes('/profile')) {
    if (!authToken) {
      currentUrl.pathname = '/'
      return NextResponse.redirect(currentUrl)
    }
    try {
      jwt_decode(authToken)
      return NextResponse.next()
    } catch (e) {
      currentUrl.pathname = '/'
      return NextResponse.redirect(currentUrl)
    }
  }

  return NextResponse.next()
}

export default middleware
