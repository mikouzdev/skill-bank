// cypress/e2e/login.cy.ts
import users from "../fixtures/users.json";

type Users = {
  role: "admin" | "consult" | "sales";
  email: string;
  password: string;
  shouldEndUp: string;
};

describe("Login page", () => {
  describe("See that all the necessary elements exists", () => {
    it("Checks that the elements are in place", () => {
      cy.visit("http://localhost:5173/login");

      cy.get('input[type="email"]').should("exist").and("be.visible");
      cy.get('input[type="password"]').should("exist").and("be.visible");
      cy.contains("button", "sign in", { matchCase: false })
        .should("exist")
        .and("be.visible");
    });
  });

  describe("Role-based login works", () => {
    (users as Users[]).forEach((user) => {
      it(`logs in as ${user.role} and ends up to ${user.shouldEndUp}`, () => {
        cy.visit("http://localhost:5173/login");

        cy.get('input[type="email"]').type(user.email);
        cy.get('input[type="email"]').should("have.value", user.email);

        cy.get('input[type="password"]').type(user.password, { log: false });
        cy.get('input[type="password"]').should("have.value", user.password);

        cy.contains("button", "sign in", { matchCase: false }).click();

        cy.url().should("include", user.shouldEndUp);
      });
    });
  });
});
