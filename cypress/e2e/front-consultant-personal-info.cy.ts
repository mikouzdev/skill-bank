describe("Consultant personal info", () => {
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

  it("changes the name and checks it's changed", () => {
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

    //cy.get('', "Descrition").clear().type(descriptionChanged);

    cy.contains("label", "Description")
      .should("be.visible")
      .invoke("attr", "for")
      .should("match", /\S+/)
      .then((id) => {
        cy.get(`#${id}`).should("exist").clear().type(descriptionChanged);
      });

    cy.contains("button", "apply edits", { matchCase: false })
      .should("exist")
      .should("be.visible")
      .then(($card) => {
        $card[0].style.outline = "3px solid red";
      })
      .as("applyEdits");

    // cy.wait(1000);
    cy.get("@applyEdits").click();
    //cy.wait(1000);

    cy.get("@applyEdits")
      .find('[role="progressbar"]', { timeout: 10000 })
      .should("not.exist");

    cy.visit("http://localhost:5173/consultant/me");

    //give some time to the page to load.
    cy.wait(1000);

    cy.contains(fullNameChanged, { timeout: 10000 })
      .should("be.visible")
      .as("name");
    cy.get("@name").then(($card) => {
      $card[0].style.outline = "3px solid red"; // acceptable linter error, Should faild at "be.visible"
    });

    cy.contains(titleChanged, { timeout: 10000 })
      .should("be.visible")
      .as("tittle");
    cy.get("@title").then(($card) => {
      $card[0].style.outline = "3px solid red"; // acceptable linter error, Should faild at "be.visible"
    });

    cy.contains(descriptionChanged, { timeout: 10000 })
      .should("be.visible")
      .as("description");
    cy.get("@description").then(($card) => {
      $card[0].style.outline = "3px solid red"; // acceptable linter error, Should faild at "be.visible"
    });

    cy.wait(500); //cy.pause();
  });

  it("Adds a new skill and checks it's been created", () => {
    cy.visit("http://localhost:5173/consultant/me/edit");

    cy.wait(1000);

    cy.contains("button", "add skill", { matchCase: false })
      .should("exist")
      .should("be.visible")
      .then(($button) => {
        $button[0].style.outline = "3px solid red";
      })
      .as("addSkill");

    //cy.pause();
    cy.wait(1000);
    cy.get("@addSkill").click();
    cy.wait(1000);

    cy.get('[role="dialog"]', { timeout: 4000 })
      .should("be.visible")
      .scrollIntoView(); // remove when in pipeline;

    cy.get('[role="dialog"]', { timeout: 4000 })
      .should("be.visible")
      .within(() => {
        //cy.contains("button", "Add Skill").click();

        cy.contains("Category").next().click();
        cy.contains("Category")
          .parent()
          .within(() => {
            cy.press(Cypress.Keyboard.Keys.DOWN);
            cy.press(Cypress.Keyboard.Keys.ENTER);
          });

        cy.contains("Skill").next().click();
        cy.contains("Skill")
          .parent()
          .within(() => {
            cy.press(Cypress.Keyboard.Keys.DOWN);
            cy.press(Cypress.Keyboard.Keys.ENTER);
          });

        cy.get('input[name="hover-feedback"][value="5"]').check({
          force: true,
        });

        cy.contains("button", "add skill", { matchCase: false }).click();
        cy.wait(500);

        cy.visit("http://localhost:5173/consultant/me");
        cy.wait(1000);

        cy.contains("css").scrollIntoView();
        cy.contains("css").then(($css) => {
          $css[0].style.outline = "3px solid red";
        });

        // cy.contains("css", { timeout: 10000 })
        //   .should("exist")
        //   .then(($css) => {
        //     $css[0].style.color = "red"; // acceptable linter error, Should faild at "be.visible"
        //   });
        cy.wait(500);
      });
  });
  it("shows the new skill and deletes it", () => {
    cy.visit("http://localhost:5173/consultant/me/edit");
    cy.contains("css").should("be.visible");

    cy.contains("css")
      .closest("div")
      .parent()
      .find("button")
      .first()
      .scrollIntoView()
      .click();
    cy.wait(500);
  });

  it("checks that external links visibility works as assumed", () => {
    cy.visit("http://localhost:5173/consultant/me/edit");
    cy.contains("label", "GitLab")
      .closest("form")
      .within(() => {
        cy.get('input[type="checkbox"]').uncheck({ force: true });
        cy.contains("button", "apply edits", { matchCase: false })
          .then(($button) => {
            $button[0].style.outline = "3px solid red";
          })
          .as("button");
        //cy.pause();
        cy.get("@button").click();
        cy.wait(1000);
      });
  });
});
