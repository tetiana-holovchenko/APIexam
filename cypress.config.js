const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportHeight: 1080,
    viewportWidth: 1920,
    watchForFileChanges: false,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
