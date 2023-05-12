describe('Tests the application works', () => {
  it('Visits the website', () => {
    // Standard load of the website
    cy.visit('http://localhost:3000/')
    cy.contains('City')

    // Types in Odense and searches for it
    cy.get('#cityName').type('Odense')
    cy.get('#cityName').should('have.value', 'Odense')
    cy.get('#displayButton').click()
    cy.contains("Odense")
    

    // Checks to see that data is being displayed

    cy.contains("Average Temperature")
    cy.get('#avgTemp').should('exist')

    cy.contains("Total Precipitation")
    cy.get('#totPrec').should('exist')

    cy.contains("Max Wind Speed")
    cy.get('#maxWind').should('exist')

    cy.contains("Average Humidity")
    cy.get('#avgHumi').should('exist')
  })
  
})

describe("Should not display a city if the input is empty", () => {
  it('Searches on an empty String', () => {
    //Same as previously except now it doesn't type a City in the search bar
    cy.visit('http://localhost:3000/')
    cy.contains('City')
    cy.get('#displayButton').click()

    // Checking after the button has been pressed that no data are displayed, as the cityName is empty
    cy.get('#avgTemp').should('not.exist')
    cy.get('#totPrec').should('not.exist')
    cy.get('#maxWind').should('not.exist')
    cy.get('#avgHumi').should('not.exist')
  })
})

describe("Should not display a city if the input is not a city", () => {
  it('Searches for a nonExisting city', () => {
    //Same as previously except now the city name should not be a real city
    cy.visit('http://localhost:3000/')
    cy.contains('City')
    cy.get('#cityName').type('ThisCityShouldNotExist')
    cy.get('#cityName').should('have.value','ThisCityShouldNotExist')
    cy.get('#displayButton').click()

    // Checking after the button has been pressed that no graphs are displayed, as the city is not real
    cy.get('#avgTemp').should('not.exist')
    cy.get('#totPrec').should('not.exist')
    cy.get('#maxWind').should('not.exist')
    cy.get('#avgHumi').should('not.exist')
  })
})
