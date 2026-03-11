context("GET /consultants/{consultantId}/sections", () => {
    it("logs in as test user, gets all page sections, gets one page section, edits it, posts a comment on it, updates comment, deletes comment", () => {
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
                    url: "/auth/me",
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.not.be.null;
                    const consultantId = response.body.consultantId;
                    cy.request({
                        method: "GET",
                        url: "/consultants/" + consultantId + "/sections",
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).length.to.be.greaterThan(0);
                        response.body.forEach((element) => {
                            expect(element).to.have.property('id');
                            expect(element).to.have.property('consultantId');
                            expect(element).to.have.property('name');
                            expect(element).to.have.property('visibility');
                            expect(element).to.have.property('comments');
                        });
                    })
                    cy.request({
                        method: "GET",
                        url: "/consultants/" + consultantId + "/sections/GENERAL",
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.not.be.null;
                        expect(response.body).to.have.property("id");
                        expect(response.body).to.have.property("consultantId");
                        expect(response.body).to.have.property("name", "GENERAL");
                        expect(response.body).to.have.property("visibility");
                        expect(response.body).to.have.property("comments"); 
                    })
                    cy.request({
                        method: "PUT",
                        url: "/consultants/me/sections/GENERAL",
                        body: {
                            "name": "GENERAL",
                            "visibility": "LIMITED"
                        },
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.not.be.null;
                        expect(response.body).to.have.property("id");
                        expect(response.body).to.have.property("consultantId");
                        expect(response.body).to.have.property("name", "GENERAL");
                        expect(response.body).to.have.property("visibility", "LIMITED");
                    })
                    cy.request({
                        method: "POST",
                        url: "/consultants/" + consultantId + "/sections/GENERAL/comments",
                        body: {
                            "content": "test text"
                        },
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(201);
                        expect(response.body).to.not.be.null;
                        expect(response.body).to.have.property("id");
                        const commentId = response.body.id;
                        expect(response.body).to.have.property("pageSectionId");
                        expect(response.body).to.have.property("userId");
                        expect(response.body).to.have.property("userRole");
                        expect(response.body).to.have.property("createdAt");
                        expect(response.body).to.have.property("updatedAt");
                        expect(response.body).to.have.property("listPosition");
                        expect(response.body).to.have.property("replyToId");
                        expect(response.body).to.have.property("content", "test text");
                        cy.request({
                            method: "PUT",
                            url: "/comments/" + commentId,
                            body: {
                                "content": "text test"
                            },
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                            expect(response.body).to.not.be.null;
                            expect(response.body).to.have.property("id");
                            expect(response.body).to.have.property("pageSectionId");
                            expect(response.body).to.have.property("userId");
                            expect(response.body).to.have.property("userRole");
                            expect(response.body).to.have.property("createdAt");
                            expect(response.body).to.have.property("updatedAt");
                            expect(response.body).to.have.property("listPosition");
                            expect(response.body).to.have.property("replyToId");
                            expect(response.body).to.have.property("content", "text test");
                        })
                        cy.request({
                            method: "DELETE",
                            url: "/comments/" + commentId,
                            headers: {
                                Authorization: "Bearer " + token,
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(204);
                        })
                    })
                    cy.request({
                        method: "GET",
                        url: "/comments",
                        headers: {
                            Authorization: "Bearer " + token,
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).length.to.be.greaterThan(0);
                        response.body.forEach((element) => {
                            expect(element).to.have.property("id");
                            expect(element).to.have.property("pageSectionId");
                            expect(element).to.have.property("userId");
                            expect(element).to.have.property("userRole");
                            expect(element).to.have.property("createdAt");
                            expect(element).to.have.property("updatedAt");
                            expect(element).to.have.property("listPosition");
                            expect(element).to.have.property("replyToId");
                            expect(element).to.have.property("content");
                        });
                    })
                })
            })
        })
    })
})