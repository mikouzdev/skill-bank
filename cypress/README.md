# Cypress test suite

:warning: **Runnin any of the tests will reseed the main database** :warning:

This project uses Cypress as it's test environment. All the test has been written in E2E.

Please configure the `cypress/support/e2e.ts` file to your licking.

## Coverage

The tests cover some of the most pivotal path cases for the consultant and customer paths. There are no tests for admin and a few for the sales. The API tests are well covered.

## Cypress verision information

All the tests are tested with the followin cypress configuration:

> Cypress package version: 15.10.0
> Cypress binary version: 15.10.0
> Electron version: 37.6.0
> Bundled Node version:
> 22.19.0

## Installing Cypress.

This project uses pnpm.

Run command `pnpm add --save-dev cypress`. See more detailed installation instructions @[Official cypress installation guide](https://docs.cypress.io/app/get-started/install-cypress)

If you are using eslint it is highly recomended to add cypress eslint rules: `pnpm add -D eslint-plugin-cypress`.

## Running Cypress

:warning: Please note that every test run **reseeds the database**. There are no separate testing database.

Please note that the project uses pnpm instead of npm.

To manually start cypress use command `pnpm exec cypress open`.
To run cypress in headless patch mode use `pnpm cypress run`.
While all the current tests are healdess compatible and should be testable, it is recomended to use the manual runs for the tests starting with prefex `front`. There are more visual debug information available when running in visual mode.

Note: Before runing the test suite see that the back end is not sleeping, this may cause false fail. An usual indicator for false fail is that test `api-admin.spec.cy.ts` fails while other dependant of it do not. Consider the first test as a flaky one.

## Folder structure.

The project uses the recomended cypress structure and should be self mandatory. Note: The support folder holds the database seeding script.

```
C:.
├───e2e
├───fixtures
├───screenshots
└───support
```

## Conventions

There aren't any special conventions except with the tests naming. Test starting with api test apis and tests starting with front test frontend.
Cypress data indicator sare sparce.
