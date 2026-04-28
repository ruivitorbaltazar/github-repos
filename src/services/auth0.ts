import Auth0 from "react-native-auth0"
import { Auth0IdTokenPayloadSchema } from "@/schemas/auth0"
import { parseOrThrow } from "@/schemas/parse"

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
  const decoded: unknown = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
  const { githubToken } = parseOrThrow(Auth0IdTokenPayloadSchema, decoded, "auth0/id-token")

  return githubToken
}

export const logoutFromAuth0 = async (): Promise<void> => {
  await auth0.webAuth.clearSession()
}
