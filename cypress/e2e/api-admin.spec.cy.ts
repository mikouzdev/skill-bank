context("GET admin/users", () => {
  it("logs in as admin and gets all users, posts a new user, updates it and deletes it", () => {
    cy.request({
      method: "POST",
      url: "/auth/login",
      body: {
        email: "admin@admin.com",
        password: "hashed-password",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.equal(null);
      expect(response.body).to.have.property("success", true);
      const token = response.body.token;
      cy.request({
        method: "GET",
        url: "/admin/users",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).length.to.be.greaterThan(1);
        response.body.forEach((element: string) => {
          expect(element).to.have.property("id");
          expect(element).to.have.property("name");
          expect(element).to.have.property("email");
          expect(element).to.have.property("createdAt");
          expect(element).to.have.property("roles");
        });
      });
      cy.request({
        method: "POST",
        url: "/admin/users",
        body: {
          name: "Test User",
          password: "unhashedtestpassword",
          email: "testi@hotmail.com",
          roles: [
            {
              role: "CONSULTANT",
            },
            {
              role: "SALESPERSON",
            },
          ],
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.not.equal(null);
        const userId = response.body.id;
        expect(response.body).to.have.property("name", "Test User");
        expect(response.body).to.have.property("email", "testi@hotmail.com");
        expect(response.body.roles[0]).to.have.property("role", "CONSULTANT");
        expect(response.body.roles[1]).to.have.property("role", "SALESPERSON");
        cy.request({
          method: "PUT",
          url: "/admin/users/" + userId,
          body: {
            name: "Edited Test User",
            email: "testi@gmail.com",
            roles: [
              {
                role: "SALESPERSON",
              },
            ],
          },
          headers: {
            Authorization: "Bearer " + token,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.not.equal(null);
          expect(response.body).to.have.property("name", "Edited Test User");
          expect(response.body).to.have.property("email", "testi@gmail.com");
          expect(response.body.roles[0]).to.have.property(
            "role",
            "SALESPERSON",
          );
        });
        cy.request({
          method: "DELETE",
          url: "/admin/users/" + userId,
          headers: {
            Authorization: "Bearer " + token,
          },
        }).then((response) => {
          expect(response.status).to.eq(204);
        });
      });
    });
  });
});
