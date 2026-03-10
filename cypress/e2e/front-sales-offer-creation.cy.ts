describe("Consultant personal projects", () => {
  const offerName = "test offer";
  const offerDescription = "my offer description";
  const offerShortDescription = "my offer short description";
  const offerPassword = "12345678";

  let offerLink = "";

  afterEach(() => {
    cy.visit("http://localhost:5173/logout");
  });

  const loginAsSalesperson = () => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[type="email"]').type("test@demo.com");
    cy.get('input[type="password"]').type("hashed-password", { log: true });

    cy.contains("button", "sign in", { matchCase: false }).click();

    // listener for /auth/me to get customerId
    cy.intercept("GET", "/auth/me", (req) => {
      // to not respond with: 304 Not Modified
      delete req.headers["if-none-match"];
      delete req.headers["if-modified-since"];
    }).as("getAuthMe");

    cy.url().should("include", "/login");
    cy.get('[data-cy="salesperson-role-selector"]').should("be.visible").click();

    cy.contains("Create offer", { matchCase: false, timeout: 10000 }).should("be.visible");
  };

  it("creates a new offer", () => {
    loginAsSalesperson();

    cy.visit("http://localhost:5173/manage-offers/create");

    // form exists
    cy.url().should("include", "create");
    cy.get('[data-cy="offer-creation-form"]', { timeout: 10000 }).should("be.visible");

    cy.wait("@getAuthMe").then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property("customerId");

      const customerId = String(response.body.customerId);

      // offer customer id
      cy.get('input[name="customerId"]').should("be.visible").clear().type(customerId);
      cy.get('input[name="customerId"]').should("be.visible").should("have.value", customerId);
    });

    // offer name
    cy.get('input[name="name"]').should("be.visible").type(offerName);
    cy.get('input[name="name"]').should("be.visible").should("have.value", offerName);

    // offer description
    cy.get('textarea[name="description"]').should("be.visible").type(offerDescription);
    cy.get('textarea[name="description"]').should("be.visible").should("have.value", offerDescription);

    // offer short description
    cy.get('input[name="shortDescription"]').should("be.visible").type(offerShortDescription);
    cy.get('input[name="shortDescription"]').should("be.visible").should("have.value", offerShortDescription);

    // random password button
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").should("be.visible").click();
    cy.get('input[name="password"]').invoke("val").its("length").should("be.at.least", 8);
    cy.get('input[name="password"]').clear();

    // offer password
    cy.get('input[name="password"]').should("be.visible").type(offerPassword);
    cy.get('input[name="password"]').should("be.visible").should("have.value", offerPassword);
    cy.get('input[name="password"]').invoke("val").its("length").should("be.at.least", 8);

    cy.contains("button", "Create offer", { matchCase: false }).click();

    // generated offer link
    cy.get('[data-cy="generated-offer-link"]')
      .should("be.visible")
      .invoke("text")
      .then((link) => {
        offerLink = link;
      });
  });

  it("logs into offer page", () => {
    cy.visit(offerLink);

    cy.get('[name="password"]').should("be.visible").type(offerPassword);
    cy.get('[name="password"]').should("be.visible").should("have.value", offerPassword);

    cy.contains("button", "Sign in", { matchCase: false }).click();

    cy.url().should("include", "/customerOffer");
  });
});
