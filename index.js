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
const Orders = db.collection("Orders");
const Transports = db.collection("Transports");
const Countries = db.collection("Countries");

async function main() {
  let result = []
  try {
    const transports = await db.query(aql`
    FOR transport in ${Transports}
    FILTER transport.Supplier == "Beauty-DE"
    LET transportData = (
    LET fromCountry = (
        FOR c IN ${Countries}
            FILTER c._id == transport._from
            LIMIT 1
            RETURN {
                "Country": c._key,
                "Region": c.Region
            }
    )
    LET toCountry = (
        FOR c IN ${Countries}
            FILTER c._id == transport._to
            LIMIT 1
            RETURN {
                "Country": c._key,
                "Region": c.Region
            }
    )
    RETURN {
        "fromCountry": fromCountry[0], 
        "toCountry": toCountry[0], 
        "Supplier": transport.Supplier,
        "Ship Date": transport.\`Ship Date\`
    }
)
LET orderData = (
    FOR o IN ${Orders}
        FILTER o._key == transport._key
        RETURN o
)

RETURN {
    transport, transportData, orderData
}
     `);
    console.log("Übersichts-Liste von allen Items (Sortiment):");

    for await (const transport of transports) {
      //console.log(order);
      result.push(transport)

    }
  }

  catch (err) {
    console.error(err.message)
  }


  }

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})



