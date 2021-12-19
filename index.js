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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Queries
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
    return result
  } catch (err) {
    console.error(err.message)
  }
}
