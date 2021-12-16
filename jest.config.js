module.exports = {
  coveragePathIgnorePatterns: ["/node_modules/", "/build/"],
  moduleFileExtensions: ["js", "ts", "tsx"],
  moduleDirectories: ["node_modules", "src"],
  setupFiles: [],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  testURL: "http://localhost/",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
