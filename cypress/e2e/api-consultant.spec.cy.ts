context("GET /consultants", () => {
  it("gets a list of consultants", () => {
    cy.request("GET", "/consultants").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).length.to.be.greaterThan(1)
      let consultantExampleId = 0;
      response.body.forEach((element) => {
        expect(element).to.have.property('id')
        if (consultantExampleId === 0) {
          consultantExampleId = element.id
        }
        expect(element).to.have.property('userId')
        expect(element).to.have.property('description')
        expect(element).to.have.property('roleTitle')
        expect(element).to.have.property('profilePictureUrl')
      });
      if(consultantExampleId !== 0) {
        cy.request({
          method: "GET",
          url: "/consultants/" + consultantExampleId
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.not.be.null;
          expect(response.body).to.have.property("id");
          expect(response.body).to.have.property("userId");
          expect(response.body).to.have.property("description");
          expect(response.body).to.have.property("roleTitle");
          expect(response.body).to.have.property("profilePictureUrl");
          expect(response.body).to.have.property("user");
        })
      }
    })
  })
  it("logs in as consultant edit data", () => {
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: {
        "email": "test@demo.com",
        "password": "hashed-password"
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.token).to.not.be.null;
      expect(response.body).to.have.property("success", true);
      const token = response.body.token;
      cy.request({
        method: "PUT",
        url: "/consultants/me",
        body: {
          "description": "I have edited my consultant data.",
          "roleTitle": "Fullstack Developer",
        },
        headers: {
          Authorization: "Bearer " + token,
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.not.be.null;
        expect(response.body).to.have.property("description", "I have edited my consultant data.");
        expect(response.body).to.have.property("roleTitle", "Fullstack Developer");
        cy.request({
          method: "POST",
          url: "/auth/logout",
          headers: {
            Authorization: "Bearer " + token,
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.not.be.null;
          expect(response.body).to.have.property("success", true);
        })
      })
    })
  })
  it("find a consultant with search", () => {
    cy.request({
      method: "GET",
      url: "/consultants/search",
      qs: {
        parameter: "Test"
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).length.to.be.greaterThan(0)
      response.body.forEach((element) => {
        expect(element).to.have.property('id')
        expect(element).to.have.property('userId')
        expect(element).to.have.property('description')
        expect(element).to.have.property('roleTitle')
        expect(element).to.have.property('profilePictureUrl')
      });
    })
  })
  it("find a consultant with filter", () => {
    cy.request({
      method: "GET",
      url: "/consultants/filter",
      qs: {
        parameter: "I have edited my consultant data"
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).length.to.be.greaterThan(0)
      response.body.forEach((element) => {
        expect(element).to.have.property('id')
        expect(element).to.have.property('userId')
        expect(element).to.have.property('description')
        expect(element).to.have.property('roleTitle')
        expect(element).to.have.property('profilePictureUrl')
      });
    })
  })
  it("find a consultant with jsonfilter", () => {
    cy.request({
      method: "POST",
      url: "/consultants/jsonFilter",
      body: {
        filter_skills: [
          {
            "skill": "java",
            "proficiency": 3,
            "range": "GREATER"
          }
        ],
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).length.to.be.greaterThan(0)
      response.body.forEach((element) => {
        expect(element).to.have.property('id')
        expect(element).to.have.property('userId')
        expect(element).to.have.property('description')
        expect(element).to.have.property('roleTitle')
        expect(element).to.have.property('profilePictureUrl')
      });
    })
  })
})
