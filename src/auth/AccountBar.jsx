import { useAuthReflector } from './authReflector'

// Small bar above the card: who is signed in, or a button to sign in with AuthReflector.
// The pincode finder works either way (it's a public site); signing in is optional.
export function AccountBar() {
  const { status, user, auth } = useAuthReflector()

  if (status === 'loading' || status === 'unavailable') return null

  return (
    <div className="account-bar">
      {status === 'signedIn' ? (
        <>
          <span>
            Signed in as <strong>{user.name ?? user.email}</strong>
          </span>
          <button className="link-button" onClick={() => auth.signOut()}>
            Sign out
          </button>
        </>
      ) : (
        <button className="link-button" onClick={() => auth.signIn()}>
          Sign in with AuthReflector
        </button>
      )}
    </div>
  )
}
