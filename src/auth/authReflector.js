// Sign-in with AuthReflector (single sign-on for all our apps).
// The SDK is served by AuthReflector itself, so it always matches the server version.
import { useEffect, useState } from 'react'

const ISSUER = import.meta.env.VITE_AUTH_ISSUER ?? 'http://localhost:9000'
const CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID ?? 'pincode'

let clientPromise

// One client per page load (React StrictMode runs effects twice; a sign-in code may only be used once)
function getClient() {
  clientPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${ISSUER}/sdk/authreflector-web.js`
    script.onload = async () => {
      const auth = window.AuthReflector.create({ issuer: ISSUER, clientId: CLIENT_ID })
      try {
        await auth.init() // finishes a sign-in, or quietly signs in if already signed in at AuthReflector
        resolve(auth)
      } catch (error) {
        reject(error)
      }
    }
    script.onerror = () => reject(new Error('AuthReflector is not reachable'))
    document.head.appendChild(script)
  })
  return clientPromise
}

// status: 'loading' | 'signedIn' | 'signedOut' | 'unavailable'
export function useAuthReflector() {
  const [state, setState] = useState({ status: 'loading', user: null, auth: null })

  useEffect(() => {
    let active = true
    getClient()
      .then((auth) => {
        if (!active) return
        setState({ status: auth.user ? 'signedIn' : 'signedOut', user: auth.user, auth })
        auth.onChange((user) => active && setState({ status: user ? 'signedIn' : 'signedOut', user, auth }))
      })
      .catch(() => active && setState({ status: 'unavailable', user: null, auth: null }))
    return () => {
      active = false
    }
  }, [])

  return state
}
