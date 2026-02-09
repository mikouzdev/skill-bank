describe("See that consusltant login works", () => {
  it('Fills the login information and clicks "Sign in"', () => {
    cy.visit("http://localhost:5173/login");

    //    cy.get(".action-email").type("alice@demo.com");
    cy.get('input[type="email"]').type("alice@demo.com");
    cy.get('input[type="email"]').should("have.value", "alice@demo.com");

    cy.get('input[type="password"]').type("hashed-password");
    cy.get('input[type="password"]').should("have.value", "hashed-password");

    cy.contains("button", "sign in", { matchCase: false }).click();

    cy.url().should("include", "/me");
  });
});
