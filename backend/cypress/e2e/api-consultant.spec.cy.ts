context("GET /consultants", () => {
  it("gets a list of consultants", () => {
    cy.request("GET", "/consultants").then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).length.to.be.greaterThan(1)
      response.body.forEach((element: any) => {
        expect(element).to.have.property('id')
        expect(element).to.have.property('userId')
        expect(element).to.have.property('description')
        expect(element).to.have.property('roleTitle')
        expect(element).to.have.property('profilePictureUrl')
      });
    })
  })
})