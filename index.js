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

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://10.20.110.61:808');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

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

// GET
// Items
app.get('/items/:id?', async (req, res) => {
  const filters = keysToLowerCase(req.query)
  if ((typeof req.params.id != 'undefined') & (req.params.id != ''))
    filters.id = req.params.id
  const cursor = await db.query(getItems(ordersColl, filters))
  const result = []
  for await (const value of cursor) {
    await result.push(value)
  }
  res.send(result)
  return result
})

// Orders
app.get('/orders/:id?', async (req, res) => {
  const filters = keysToLowerCase(req.query)
  if ((typeof req.params.id != 'undefined') & (req.params.id != ''))
    filters.id = req.params.id
  const cursor = await db.query(
    getOrders(ordersColl, transportsColl, countriesColl, filters)
  )
  const result = []
  for await (const value of cursor) {
    await result.push(value)
  }
  res.send(result)
  return result
})

// Supplier
app.get('/supplier/:name?', async (req, res) => {
  const filters = keysToLowerCase(req.query)
  if ((typeof req.params.name != 'undefined') & (req.params.name != ''))
    filters.name = req.params.name
  const cursor = await db.query(
    getSupplier(transportsColl, countriesColl, filters)
  )
  const result = []
  for await (const value of cursor) {
    await result.push(value)
  }
  res.send(result)
  return result
})

// Countries
app.get('/countries', async (req, res) => {
  const filters = keysToLowerCase(req.query)
  const cursor = await db.query(
    getCountries(transportsColl, countriesColl, filters)
  )
  const result = []
  for await (const value of cursor) {
    await result.push(value)
  }
  res.send(result)
  return result
})

// Item-Types
app.get('/item-types/:type?', async (req, res) => {
  const filters = keysToLowerCase(req.query)
  if ((typeof req.params.type != 'undefined') & (req.params.type != ''))
    filters.type = req.params.type
  const cursor = await db.query(getItemTypes(ordersColl, filters))
  const result = []
  for await (const value of cursor) {
    await result.push(value)
  }
  res.send(result)
  return result
})
