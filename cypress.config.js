const { defineConfig } = require("cypress");
const clean = require('./cypress/tasks/clean');

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('before:spec', (results) => {
        clean
      })
    },
  },

});
