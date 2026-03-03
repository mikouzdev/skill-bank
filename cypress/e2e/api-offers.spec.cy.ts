context("GET /sales/1/offers", () => {
    it("logs in as test user and gets all offer pages of the first sales person, then posts a new offer page, edits it and deletes it", () => {
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
                method: "GET",
                url: "/sales/1/offers",
                headers: {
                    Authorization: "Bearer " + token,
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).length.to.be.greaterThan(1)
                response.body.forEach((element) => {
                    expect(element).to.have.property('id')
                    expect(element).to.have.property('salespersonId')
                    expect(element).to.have.property('customerId')
                    expect(element).to.have.property('description')
                    expect(element).to.have.property('name')
                    expect(element).to.have.property('shortDescription')
                    expect(element).to.have.property('consultantPages')
                });
                cy.request({
                    method: "GET",
                    url: "/auth/me",
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.not.be.null;
                    const userId = response.body.id;
                    const consultantId = response.body.consultantId
                    const customerId = response.body.customerId;
                    cy.request({
                        method: "POST",
                        url: "/sales/1/offers",
                        body: {
                            "customerId": customerId,
                            "description": "test description",
                            "name": "test name",
                            "shortDescription": "test short description",
                            "consultantPages": [
                                {
                                    "consultantId": consultantId,
                                    "showInfo": true,
                                    "isAccepted": true,
                                    "customerReview": "test review"
                                }
                            ],
                            "password": "testpassword"
                        },
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(201);
                        expect(response.body).to.not.be.null;
                        let offerId = response.body.id;
                        expect(response.body).to.have.property("name", "test name");
                        expect(response.body).to.have.property("description", "test description");
                        expect(response.body).to.have.property("shortDescription", "test short description");
                        expect(response.body.consultantPages[0]).to.have.property("customerReview", "test review");
                        cy.request({
                            method: "PUT",
                            url: "/sales/1/offers/" + offerId,
                            body: {
                                "name": "edited test name",
                                "description": "edited test description",
                                "consultantPages": [
                                    {
                                        "consultantId": consultantId,
                                        "customerReview": "edited test review"
                                    },
                                ],
                            },
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                            expect(response.body).to.not.be.null;
                            expect(response.body).to.have.property("name", "edited test name");
                            expect(response.body).to.have.property("description", "edited test description");
                            expect(response.body.consultantPages[0]).to.have.property("customerReview", "edited test review");
                        })
                        cy.request({
                            method: "DELETE",
                            url: "/sales/1/offers/" + offerId,
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(204);
                        })
                        cy.request({
                            method: "DELETE",
                            url: "/admin/users/" + userId,
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