describe("Consultant personal projects", () => {
  //const fullName = "Alice Consultant";
  const fullNameChanged = "Malice Constitution";
  //const title = "Senior Backend Engineer";
  const titleChanged = "Junior World Autocrat";

  //   const description = "";
  const descriptionChanged = "Charming supreme ruler";

  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[type="email"]').type("alice@demo.com");
    cy.get('input[type="password"]').type("hashed-password", { log: true });
    cy.contains("button", "sign in", { matchCase: false }).click();

    cy.contains("Edit profile", { matchCase: false, timeout: 10000 }).should(
      "be.visible",
    );
  });

  afterEach(() => {
    cy.visit("http://localhost:5173/logout");
  });

  it("checks that the full name has been changed", () => {
    cy.visit("http://localhost:5173/consultant/me/edit");

    cy.contains("label", "Full name")
      .parent()
      .find("input")
      .clear()
      .type(fullNameChanged);

    cy.contains("label", "Title")
      .parent()
      .find("input")
      .clear()
      .type(titleChanged);

    cy.get('[data-cy="description"]').clear().type(descriptionChanged);
  });
});
