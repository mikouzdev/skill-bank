context("GET /sales/1/lists", () => {
    it("logs in as test user and gets all sales lists of the first sales person, then posts a new sales list, edits it and deletes it", () => {
        cy.fixture('user.json').then(userData => {
            cy.request({
                method: "POST",
                url: "/auth/login",
                body: {
                    "email": "cuno@demo.com",
                    "password": "hashed-password"
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.token).to.not.be.null;
                expect(response.body).to.have.property("success", true);
                const token = response.body.token;
                cy.request({
                    method: "GET",
                    url: "/sales/1/lists",
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).length.to.be.greaterThan(0);
                    response.body.forEach((element) => {
                        expect(element).to.have.property('id');
                        expect(element).to.have.property('salespersonId');
                        expect(element).to.have.property('customerId');
                        expect(element).to.have.property('listPosition');
                        expect(element).to.have.property('description');
                        expect(element).to.have.property('shortDescription');
                        expect(element).to.have.property('isReviewDone');
                        expect(element).to.have.property('salesListItems');
                    });
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
                    cy.request({
                        method: "POST",
                        url: "/auth/login",
                        body: userData
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.token).to.not.be.null;
                        expect(response.body).to.have.property("success", true);
                        const token2 = response.body.token;
                        cy.request({
                            method: "GET",
                            url: "/auth/me",
                            headers: {
                                Authorization: "Bearer " + token2,
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                            expect(response.body).to.not.be.null;
                            const consultantId = response.body.consultantId;
                            const customerId = response.body.customerId;
                            cy.request({
                                method: "POST",
                                url: "/sales/1/lists",
                                body: {
                                    "customerId": customerId,
                                    "description": "test description",
                                    "isReviewDone": false,
                                    "shortDescription": "test short description",
                                    "salesListItems": [
                                        {
                                            "consultantId": consultantId,
                                            "isHidden": false,
                                            "isAccepted": false,
                                            "salesNote": "test note"
                                        }
                                    ],
                                },
                                headers: {
                                    Authorization: "Bearer " + token2,
                                }
                            }).then((response) => {
                                expect(response.status).to.eq(201);
                                expect(response.body).to.not.be.null;
                                const listId = response.body.id;
                                expect(response.body).to.have.property("description", "test description");
                                expect(response.body).to.have.property("shortDescription", "test short description");
                                expect(response.body).to.have.property("isReviewDone", false);
                                expect(response.body.salesListItems[0]).to.have.property("salesNote", "test note");
                                cy.request({
                                    method: "PUT",
                                    url: "/sales/1/lists/" + listId,
                                    body: {
                                        "isReviewDone": true,
                                        "description": "edited test description",
                                        "salesListItems": [
                                            {
                                                "consultantId": consultantId,
                                                "isAccepted": true,
                                                "salesNote": "edited test note"
                                            },
                                        ],
                                    },
                                    headers: {
                                        Authorization: "Bearer " + token2,
                                    }
                                }).then((response) => {
                                    expect(response.status).to.eq(200);
                                    expect(response.body).to.not.be.null;
                                    expect(response.body).to.have.property("description", "edited test description");
                                    expect(response.body).to.have.property("isReviewDone", true);
                                    expect(response.body.salesListItems[0]).to.have.property("salesNote", "edited test note");
                                    expect(response.body.salesListItems[0]).to.have.property("isAccepted", true);
                                })
                                cy.request({
                                    method: "DELETE",
                                    url: "/sales/1/lists/" + listId,
                                    headers: {
                                        Authorization: "Bearer " + token2,
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
})