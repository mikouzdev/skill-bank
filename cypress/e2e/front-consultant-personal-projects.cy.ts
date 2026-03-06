describe("Consultant personal projects", () => {
  const name = "test project";
  const description = "My project description";
  const projectUrl = "https://www.example.com";
  const date = "2021-12-01";
  const projectName = "Example";

  beforeEach(() => {
    // cy.request({
    //   method: "POST",
    //   url: "/auth/login",
    //   body: { email: "alice@demo.com", password: "hashed-password" },
    // }).then((res) => {
    //   expect(res.status).to.eq(200);
    //   window.localStorage.setItem("authToken", res.body.token);
    // });

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

  it("adds a new personal project", () => {
    cy.visit("http://localhost:5173/consultant/me/edit");
    cy.contains("Edit profile", {
      matchCase: false,
      timeout: 10000,
    }).click();

    cy.url().should("include", "edit");

    cy.contains("button", "add project", { matchCase: false }).click();

    cy.get('[role="dialog"]', { timeout: 4000 }).should("be.visible");

    cy.get('[role="dialog"]', { timeout: 4000 })
      .should("be.visible")
      .within(() => {
        cy.get('input[name="name"]').should("be.visible").type(name);

        cy.get('textarea[name="description"]')
          .should("be.visible")
          .type(description);

        cy.get('textarea[name="description"]')
          .should("be.visible")
          .should("have.value", description);

        cy.contains("react", { matchCase: false }).should("be.visible");
        cy.contains("React", { matchCase: false }).click();
        cy.contains("html", { matchCase: false }).should("be.visible");
        cy.contains("html", { matchCase: false }).click();
        cy.contains("css", { matchCase: false }).should("be.visible");
        cy.contains("css", { matchCase: false }).click();

        cy.contains("vue", { matchCase: false }).should("be.visible");
        cy.contains("vue", { matchCase: false }).click();

        cy.contains(".MuiDivider-root", "Added Skills")
          .next()
          .contains(".MuiChip-root", "vue", { matchCase: false })
          .as("vueChip");

        // remove when in pipeline
        cy.get("@vueChip").then(($chip) => {
          $chip[0].style.outline = "3px solid red"; // remove when in pipeline
        }); // remove when in pipeline
        cy.wait(1000); // remove when in pipeline

        cy.get("@vueChip").find(".MuiChip-deleteIcon").click();

        cy.contains("label", "Start Date")
          .parent()
          .find("input")
          .clear()
          .type(date);

        cy.get('input[name="url"]').should("be.visible").type(projectUrl);

        cy.get('input[name="label"]').should("be.visible").type(projectName);

        cy.contains("button", "Submit", { matchCase: false }).click();
        cy.wait(1000); // remove when in pipeline
      });
  });

  it("check the project is visible in profile page", () => {
    cy.visit("http://localhost:5173/consultant/me/");

    cy.contains(name, { matchCase: false, timeout: 10000 })
      .should("be.visible")
      .closest(".MuiPaper-root, .MuiCard-root")
      .scrollIntoView() // remove when in pipeline
      .should("be.visible")
      .then(($card) => {
        // remove when in pipeline
        $card[0].style.outline = "3px solid red"; // remove when in pipeline
      }); // remove when in pipeline

    cy.wait(1000); // remove when in pipeline
    //cy.pause();
  });

  it("deletes a personal project", () => {
    cy.visit("http://localhost:5173/consultant/me/edit");

    cy.contains(name, { matchCase: false, timeout: 10000 })
      .should("be.visible")
      .closest(".MuiPaper-root, .MuiCard-root")
      .scrollIntoView() // remove when in pipeline
      .should("be.visible")
      .then(($card) => {
        $card[0].style.outline = "3px solid red";
      })
      .as("projectCard");

    cy.get("@projectCard")
      .contains("button", "delete", { matchCase: false })
      .click();
    cy.wait(1000); // remove when in pipeline
  });

  it("checks that the project has been deleted", () => {
    cy.visit("http://localhost:5173/consultant/me/");

    // there has to be a better way to do this
    // this part is evaluated too fast, before the site has been fully rendered.
    //cy.document().its("readyState").should("eq", "complete");
    cy.wait(1000);
    cy.contains(name, { matchCase: false, timeout: 10000 }).should("not.exist");
  });
});
