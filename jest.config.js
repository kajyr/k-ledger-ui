module.exports = {
  coveragePathIgnorePatterns: ["/node_modules/", "/build/"],
  moduleFileExtensions: ["js", "ts", "tsx"],
  moduleDirectories: ["node_modules", "frontend/src", "backend"],
  setupFiles: [],
  testMatch: ["**/*.test.{ts,tsx}"],
  testURL: "http://localhost/",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
