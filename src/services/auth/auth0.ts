import Auth0 from "react-native-auth0"

const auth0 = new Auth0({
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN!,
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!,
})

export const loginWithAuth0 = async (): Promise<string> => {
  const credentials = await auth0.webAuth.authorize({
    scope: "openid profile",
  })

  // Decode the ID token payload to extract the GitHub access token.
  // Requires an Auth0 Action that sets the custom claim — see setup guide.
  const [, payload] = credentials.idToken.split(".")
  const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
  const githubToken = decoded["https://github.com/access_token"]

  if (!githubToken) {
    console.warn("[auth0] ID token claims present:", JSON.stringify(decoded))
    throw new Error("GitHub token not found. Ensure the Auth0 Action is configured correctly.")
  }

  return githubToken
}

export const logoutFromAuth0 = async (): Promise<void> => {
  await auth0.webAuth.clearSession()
}
