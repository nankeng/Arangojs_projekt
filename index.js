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
  main().then((transports) => {
    res.send(transports)
  })
})

// Collections
const Orders = db.collection('Orders')
const Transports = db.collection('Transports')
const Countries = db.collection('Countries')

// Imports
const analysisTransports = require('./queries/analysis-transport.js')


async function main() {
  try {
    const cursor = await db.query(analysisTransports(Transports, Countries, Orders, {}))
    const result = await cursor.next()
    console.log("Query transports complete!")
    return result
  } catch (err) {
    console.error(err.message)
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
