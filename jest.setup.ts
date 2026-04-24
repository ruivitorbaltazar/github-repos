jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

jest.mock("react-native-auth0", () => {
  return jest.fn().mockImplementation(() => ({
    webAuth: {
      authorize: jest.fn(),
      clearSession: jest.fn(),
    },
  }))
})
