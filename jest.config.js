module.exports = {
  coveragePathIgnorePatterns: ["/node_modules/", "/build/"],
  moduleFileExtensions: ["js", "ts", "tsx"],
  setupFiles: [],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  testURL: "http://localhost/",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
