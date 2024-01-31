describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:8100/')

    cy.wait(2000)

    cy.get('#open-topicModal').click()

    cy.get('ion-input[label="Name"]').type("TOPIC TEST")

    cy.wait(1000)

    cy.get('ion-button[ng-reflect-strong="true"]').click()

    cy.get('ion-label').contains("TOPIC TEST")
  })
})
