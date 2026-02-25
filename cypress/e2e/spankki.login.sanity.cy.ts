describe("See that all the necessary elements exists", () => {
  it("Checks that the elements are in place", () => {
    cy.visit("http://localhost:5173/login");
    //cy.get('input[type="email"]').type("alice@demo.com");
    cy.get('input[type="email"]').should("exist").should("be.visible");
    cy.get('input[type="password"]').should("exist").should("be.visible");
    cy.contains("button", "sign in", { matchCase: false })
      .should("exist")
      .should("be.visible");
  });
});
