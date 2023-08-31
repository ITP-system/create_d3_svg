export default {
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "tsconfig.test.json",
    },
  },
};
