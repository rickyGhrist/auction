describe('template spec', () => {
  let items = [];
  let itemCount = 0;
  let pages = 0;
  const word = 'cabinet'

  beforeEach(() => {
    cy.visit("https://www.onlineliquidationauction.com/")
  })

  it('auctionTest', function () {
    cy.get('.col-md-6 > form > .input-group > .form-control').type(`${word}{enter}`);
    cy.get('.alert').then((alert) => {
      const alertText = alert[0].innerText.toString();
      let strippedText = alertText.match(/\d/g);
      itemCount = strippedText.join("");
      pages = itemCount / 5;
    }).then(() => {
      for (let index = 0; index < pages; index++) {
        cy.get('h2 > a').then((selectors) => {
          const aTags = Cypress.$.makeArray(selectors).map((selector) => selector)
          aTags.forEach(a => {
            items.push({title: a.innerText.slice(0,90), url: a.getAttribute("href")})
          });
        })
        cy.get('.input-group-btn > .btn').click();
        cy.get('.pagination').find('li').then((pages) => {
          cy.wrap(pages[pages.length - 1]).click();
        });
      }
    }).then(() => {
      const messageContent = JSON.stringify(items)
      cy.writeFile(`./itemsFor${word}.json`, messageContent)
    })
  })
});