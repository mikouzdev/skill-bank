context("GET /skills", () => {
  it("gets a list of skills", () => {
    cy.request("GET", "/skills").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).length.to.be.greaterThan(1);
      response.body.forEach((element) => {
        expect(element).to.have.property('id');
        expect(element).to.have.property('categoryId');
        expect(element).to.have.property('name');
      });
    })
  })
  it("create a skill and a skill category, edit them and delete them", () => {
    cy.fixture('user.json').then(userData => {
        cy.request({
            method: "POST",
            url: "/auth/login",
            body: userData
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.token).to.not.be.null;
            expect(response.body).to.have.property("success", true);
            const token = response.body.token;
            cy.request({
                method: "GET",
                url: "/skills/categories",
                headers: {
                    Authorization: "Bearer " + token,
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).length.to.be.greaterThan(1);
                let categoryId = 0;
                response.body.forEach((element) => {
                    expect(element).to.have.property('id');
                    categoryId = element.id;
                    expect(element).to.have.property('name');
                    expect(element).to.have.property('skillTags');
                });
                cy.request({
                    method: "POST",
                    url: "/skills",
                    body: {
                        "categoryId": categoryId,
                        "name": "cypress"
                    },
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }).then((response) => {
                    expect(response.status).to.eq(201);
                    expect(response.body).to.not.be.null;
                    expect(response.body).to.have.property("id");
                    expect(response.body).to.have.property("categoryId", categoryId);
                    expect(response.body).to.have.property("name", "cypress");
                    const skillName = response.body.name;
                    cy.request({
                        method: "POST",
                        url: "/skills/categories",
                        body: {
                            "name": "Test category",
                            "skillTags": [
                                {
                                    "name": "testing"
                                }
                            ]
                        },
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(201);
                        expect(response.body).to.not.be.null;
                        expect(response.body).to.have.property("id");
                        const categoryId2 = response.body.id;
                        expect(response.body).to.have.property("skillTags");
                        expect(response.body).to.have.property("name", "Test category");
                        cy.request({
                            method: "PATCH",
                            url: "/skills/" + skillName,
                            body: {
                                "categoryId": categoryId2
                            },
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                            expect(response.body).to.have.property("categoryId", categoryId2);
                        })
                        cy.request({
                            method: "PUT",
                            url: "/skills/categories/" + categoryId2,
                            body: {
                                "name": "Edited test category"
                            },
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                            expect(response.body).to.have.property("name", "Edited test category");
                        })
                        cy.request({
                            method: "DELETE",
                            url: "/skills/" + skillName,
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(204);
                        })
                        cy.request({
                            method: "DELETE",
                            url: "/skills/categories/" + categoryId2,
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(204);
                        })
                    })
                })
            })    
        })
    })
  })
})