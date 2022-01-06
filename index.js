// Express setup
const express = require('express')
const app = express()
const port = 10800
// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

// ArangoJS setup
const { Database, aql } = require('arangojs')

const db = new Database({
  url: 'http://10.20.110.48:8529/',
  databaseName: 'Country-Sales',
  auth: { username: 'root', password: 'c017-team8' },
})



// Collections
const countriesColl = db.collection('Countries')
const ordersColl = db.collection('Orders')
const transportsColl = db.collection('Transports')

// Utils
const keysToLowerCase = require('./utils/json-lower.js')

//===========================================================================

// Query Imports
const getItems = require('./queries/get-items.js')
const getSupplier = require('./queries/get-supplier.js')
const getCountries = require('./queries/get-countries.js')
const getItemTypes = require('./queries/get-item-types.js')
const getOrders = require('./queries/get-orders.js')

app.get('/', (req, res) => {
  main().then((transports) => {
    res.send(transports)
  })
})
async function main() {
  try {
    const cursor = await db.query(
      analysisTransports(transportsColl, countriesColl, ordersColl, {})
    )
    //todo: hier muss noch die schleife gemachjt wertden
    const result = await cursor.next()
    console.log('Query transports complete!')
    return result
  } catch (err) {
    console.error(err.message)
  }
}



// GET

// Items

app.get('/items', async (req, res) => {
  const filters = keysToLowerCase(req.query)
  const cursor = await db.query(getItems(ordersColl, filters))
  const result = []
  for await (const value of cursor) {
    await result.push(value);
  }
  res.send(result)
  return result
})

// Orders
app.get('/orders', async (req, res) => {
  const filters = keysToLowerCase(req.query)
  const cursor = await db.query(getOrders(ordersColl, transportsColl, countriesColl, filters))
  const result = []
  for await (const value of cursor) {
    await result.push(value);
  }
  res.send(result)
  return result
})
