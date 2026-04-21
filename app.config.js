export default {
  expo: {
    name: "pink-room-repo-browser",
    slug: "pink-room-repo-browser",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    scheme: "dev.pinkroom.repobrowser",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "dev.pinkroom.repobrowser",
    },
    android: {
      package: "dev.pinkroom.repobrowser",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-secure-store",
      ["react-native-auth0", {
        domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN ?? "",
      }],
    ],
  },
}
