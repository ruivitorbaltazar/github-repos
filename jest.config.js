module.exports = {
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["babel-jest", { presets: ["babel-preset-expo"] }],
  },
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "src/(contexts|screens|services/auth)/.*\\.test\\.[jt]sx?$",
  ],
}
