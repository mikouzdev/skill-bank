# Cypress test suite

:warning:
**Runnin any of the tests will reseed the main database.**

This project uses Cypress as its test environment. All the tests have been written in E2E including API tests.

You may want to study `cypress/support/e2e.ts` file for seeding before running any of the tests.

## Prerequisites

Before running the Cypress test suite, make sure that:

- the backend server is running
- the database connection is working
- the backend is fully awake and not in sleep mode

## Coverage

The tests cover some of the most pivotal use cases for the consultant and customer paths. There are no tests for admin and a few for the sales. The API tests are well covered.

## Cypress verision information

All the tests are tested with the following Cypress configuration:

- Cypress package version: `15.10.0`
- Cypress binary version: `15.10.0`
- Electron version: `37.6.0`
- Bundled Node version:
- `22.19.0`

## Installing Cypress.

This project uses pnpm.

Run command `pnpm add --save-dev cypress`. See more detailed installation instructions @[Official cypress installation guide](https://docs.cypress.io/app/get-started/install-cypress)

If you are using eslint it is highly recommended to add Cypress eslint rules: `pnpm add -D eslint-plugin-cypress`.

## Running Cypress

There is no separate testing database.

To manually start cypress use command `pnpm exec cypress open`.
To run cypress in headless patch mode use `pnpm cypress run`.
While all the current tests are headless compatible and should be testable, it is recommended to use the manual runs for the tests starting with a prefex `front`. There is more visual debug information available when running in visual mode.

Note: Before running the test suite see that the backend is not sleeping, this may cause a false fail. A usual indicator for false fail is that the test `api-admin.spec.cy.ts` fails while other dependants of it do not. Consider the first test as a flaky one.

## Folder structure.

The project uses the recommended Cypress folder structure and should be self mandatory. Note: The `support` folder holds the database seeding script.

```
C:.
├───e2e
├───fixtures
├───screenshots
└───support
```

## Conventions

There aren't any special conventions except with the tests' naming. Test starting with `api` test apis and tests starting with `front` test frontend.
Cypress data and test attributes are sparse.
