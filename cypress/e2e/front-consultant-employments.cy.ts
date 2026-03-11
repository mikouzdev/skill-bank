// consultant can add new employment
// consultant cant post without required fields filled

const newEmploymentCompany = "company abc";
const newEmploymentTitle = "developer";
const newEmploymentDescription = "123456";

const newEmploymentStart = "2003-03-03";
const newEmploymentEnd = "2004-03-03";

describe("Consultant employments", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[type="email"]').type("alice@demo.com");
    cy.get('input[type="password"]').type("hashed-password", { log: true });
    cy.contains("button", "sign in", { matchCase: false }).click();

    cy.contains("Edit profile", { matchCase: false, timeout: 10000 }).should("be.visible");
  });

  afterEach(() => {
    cy.visit("http://localhost:5173/logout");
  });

  it("creates new employment", () => {
    // listener for the submit POST request
    cy.intercept("POST", "/consultants/me/employments", (req) => {
      // to not respond with: 304 Not Modified
      delete req.headers["if-none-match"];
      delete req.headers["if-modified-since"];
    }).as("employmentPost");

    // navigate to profile editing from sidebar
    cy.contains("Edit profile").should("be.visible").click();

    // list of employments is visible
    cy.get('[data-cy="employment-list"]').should("be.visible");

    // click "Add position" button
    cy.get('[data-cy="add-position-button"]').should("be.visible").click();
    cy.get(`[data-cy="add-employment-form"]`).should("be.visible");

    // input employment info to form
    cy.get('input[name="employer"]').should("be.visible").type(newEmploymentCompany);
    cy.get('input[name="employer"]').should("have.value", newEmploymentCompany);

    cy.get('input[name="jobTitle"]').should("be.visible").type(newEmploymentTitle);
    cy.get('input[name="jobTitle"]').should("have.value", newEmploymentTitle);

    cy.get('textarea[name="description"]').should("be.visible").type(newEmploymentDescription);
    cy.get('textarea[name="description"]').should("have.value", newEmploymentDescription);

    // add skills
    cy.get('[data-cy="available-skill-chips"').should("be.visible");

    cy.get('[data-cy="available-skill-chips"] > :nth-child(1)').should("be.visible").click();
    cy.get('[data-cy="available-skill-chips"] > :nth-child(2)').should("be.visible").click();
    cy.get('[data-cy="available-skill-chips"] > :nth-child(3)').should("be.visible").click();

    // skills are added correctly
    cy.get('[data-cy="added-skill-chips"]').should("be.visible").children().should("have.length", 3);

    // set start and end date
    cy.get('[name="start"]').should("be.visible").type(newEmploymentStart);
    cy.get('[name="start"]').should("have.value", newEmploymentStart);

    cy.get('[name="end"]').should("be.visible").type(newEmploymentEnd);
    cy.get('[name="end"]').should("have.value", newEmploymentEnd);

    // submit and see if employment-list length grew
    cy.get('[data-cy="employment-list"]')
      .children()
      .its("length")
      .then((previousLength) => {
        cy.get('[data-cy="employment-submit-button"]').should("be.visible").click();

        // request responded with 201 Created
        cy.wait("@employmentPost").then(({ response }) => {
          expect(response.statusCode).to.eq(201);
        });

        cy.get('[data-cy="employment-list"]').children().should("have.length.greaterThan", previousLength);
      });
  });

  it("deletes employment", () => {
    // listener for delete request
    cy.intercept("DELETE", "/consultants/me/employments/*", (req) => {
      // to not respond with: 304 Not Modified
      delete req.headers["if-none-match"];
      delete req.headers["if-modified-since"];
    }).as("employmentDelete");

    cy.visit("http://localhost:5173/consultant/me/edit");

    // click last employments delete button
    cy.get('[data-cy="employment-list"]')
      .children()
      .its("length")
      .then((previousLength) => {
        cy.get('[data-cy="employment-list"]')
          .children()
          .last()
          .find('[data-cy="employment-delete-button"]')
          .should("be.visible")
          .click();

        cy.wait("@employmentDelete").then((response) => {
          expect(response.response.statusCode).to.eq(204);
        });

        // employment list length shrunk
        cy.get('[data-cy="employment-list"]').children().should("have.length.lessThan", previousLength);
      });
  });
});
