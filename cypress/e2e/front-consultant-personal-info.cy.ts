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
    // cy.get("@applyEdits").click();
    // cy.wait(1000);

    cy.get("@applyEdits")
      .find('[role="progressbar"]', { timeout: 10000 })
      .should("not.exist");

    cy.visit("http://localhost:5173/consultant/me");

    //give some time to the page to load.
    cy.wait(1000);

    cy.contains(fullNameChanged, { timeout: 10000 })
      .should("be.visible")
      .then(($card) => {
        $card[0].style.outline = "3px solid red"; // acceptable linter error, Should faild at "be.visible"
      });

    cy.contains(titleChanged, { timeout: 10000 })
      .should("be.visible")
      .then(($card) => {
        $card[0].style.outline = "3px solid red"; // acceptable linter error, Should faild at "be.visible"
      });

    cy.contains(descriptionChanged, { timeout: 10000 })
      .should("be.visible")
      .then(($card) => {
        $card[0].style.outline = "3px solid red"; // acceptable linter error, Should faild at "be.visible"
      });
    cy.pause();
  });
});
