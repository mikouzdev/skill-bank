context("POST /auth/login", () => {
  it("logs in and gets token, then logs out", () => {
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: {
        "email": "alice@demo.com",
        "password": "hashed-password"
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.token).to.not.be.null;
      expect(response.body).to.have.property("success", true);
      let token = response.body.token;
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
  it("logs in with wrong password and does not get token", () => {
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: {
        "email": "alice@demo.com",
        "password": "wrong-password"
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    })
  })
  it("logs in with wrong email and does not get token", () => {
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: {
        "email": "alisa@demo.com",
        "password": "hashed-password"
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    })
  })
})