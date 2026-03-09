describe("Consultant personal projects", () => {
  const offerName = "test offer";
  const offerDescription = "my offer description";
  const offerShortDescription = "my offer short description";
  const offerPassword = "12345678";

  const customerId = "1"; // set before running test

  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[type="email"]').type("sally@demo.com");
    cy.get('input[type="password"]').type("hashed-password", { log: true });
    cy.contains("button", "sign in", { matchCase: false }).click();

    cy.contains("Create offer", { matchCase: false, timeout: 10000 }).should("be.visible");
  });

  afterEach(() => {
    cy.visit("http://localhost:5173/logout");
  });

  it("creates a new offer", () => {
    cy.visit("http://localhost:5173/manage-offers/create");

    cy.url().should("include", "create");

    // offer name
    cy.get('input[name="name"]').should("be.visible").type(offerName);
    cy.get('input[name="name"]').should("be.visible").should("have.value", offerName);

    // offer description
    cy.get('textarea[name="description"]').should("be.visible").type(offerDescription);
    cy.get('textarea[name="description"]').should("be.visible").should("have.value", offerDescription);

    // offer short description
    cy.get('input[name="shortDescription"]').should("be.visible").type(offerShortDescription);
    cy.get('input[name="shortDescription"]').should("be.visible").should("have.value", offerShortDescription);

    // offer password
    cy.get('input[name="password"]').should("be.visible").type(offerPassword);
    cy.get('input[name="password"]').should("be.visible").should("have.value", offerPassword);
    cy.get('input[name="password"]').invoke("val").its("length").should("be.at.least", 8);

    // random password button
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").should("be.visible").click();
    cy.get('input[name="password"]').invoke("val").its("length").should("be.at.least", 8);

    // offer customer id
    cy.get('input[name="customerId"]').should("be.visible").clear().type(customerId);
    cy.get('input[name="customerId"]').should("be.visible").should("have.value", customerId);

    cy.contains("button", "Create offer", { matchCase: false }).click();
    cy.wait(1000);

    // check for snackbar alert
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should("be.visible").should("contain", "Offer created succesfully");
  });
});
