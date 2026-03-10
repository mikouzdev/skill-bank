before(function () {
  cy.exec("cd backend && pnpm run db:seed", { timeout: 20000 }).its("stdout")
  .should("contain", "Seed complete!");
  cy.log("Reseed successful");
})