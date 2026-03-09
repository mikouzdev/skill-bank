import { defineConfig } from "cypress";
// import clean from "./cypress/tasks/clean";
// import cleanSkills from "./cypress/tasks/cleanSkills";
// import dotenvPlugin from "cypress-dotenv";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3000",
    //How to get these directly from .env file?
    // env: {
    //   POSTGRES_USER: "pguser",
    //   POSTGRES_PASSWORD: "pgpass",
    //   POSTGRES_DB: "spankki",

    //   PGADMIN_DEFAULT_EMAIL: "example@example.com",
    //   PGADMIN_DEFAULT_PASSWORD: "example",
    //   PGADMIN_CONFIG_SERVER_MODE: "False",
    //   PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED: "False"
    // },
    setupNodeEvents(on, config) {
      // const updatedConfig = dotenvPlugin(config, null, true);
      // // implement node event listeners here
      // on("task", {
      //   clean, cleanSkills
      // });
      // return updatedConfig;
    },
  },

});
