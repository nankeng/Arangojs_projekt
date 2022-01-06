//Queries

// Express setup
const express = require('express')
const app = express()
const port = 10800

// ArangoJS setup
const { Database, aql } = require('arangojs')

const db = new Database({
  url: 'http://10.20.110.48:8529/',
  databaseName: 'Country-Sales',
  auth: { username: 'root', password: 'c017-team8' },
})

// Routes
app.get('/', (req, res) => {
  main().then((sales) => {
    res.send(sales.map(sale => sale.Country).join())
  })
})

app.get('/items/:id', (req, res) => {
  main().then((orders) => {
    res.send(orders.map(orders => orders.Country).join())
  })
})





async function main() {
  let result = []
  try {
    const Sales = db.collection('hundredimport')
    const sales = await db.query(aql`
      FOR sale IN ${Sales}
      RETURN sale
    `)
    //console.log('Our sales:')

    for await (const sale of sales) {
      //console.log(sale)
      result.push(sale)
    }
    return result;
  } 
  catch (err) {
    console.error(err.message)
  }
  // Using ES2015 string templates
var aqlQuery = require('arangojs').aqlQuery;
db.query(aqlQuery`
    FOR u IN _users
    FILTER u.authData.active == ${active}
    RETURN u.user
`)
.then(cursor => {
    // cursor is a cursor for the query result
});

   try {
    const Orders = db.collection('hundredimport')
    const orders = await db.query(aql`
      FOR o IN ${Orders} 
      AGGREGATE price = MIN(o.'Unit Price'), 
                costs = MIN(o.'Unit Cost'), 
                type = MIN(o.'Item Type'), 
                unitsSold = SUM(o.'Unit Sold'), 
                totalProfit = SUM(o.'Total Profit'), 
                totalCost = SUM(o.'Total Cost'), 
                totalRevenue = SUM(o.'Total Revenue'), 
                latestPurchaseDate = MAX(o.'Order Date') 
      RETURN { [id] : { "type" : type, "price" : price, "costs" : costs, 
              "stats": { "unitsSold" : unitsSold, "totalProfit": ROUND(totalProfit), 
              "totalCost": ROUND(totalCost), "totalRevenue": ROUND(totalRevenue), "latestPurchaseDate": latestPurchaseDate } }
    `)
    //console.log('Our sales:')

    for await (const orders of Orders) {
      //console.log(sale)
      result.push(orders)
    }
    return result;
  } 
  catch (err) {
    console.error(err.message)
  }

  }

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})



