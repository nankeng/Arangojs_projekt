# ArangoDB ArangoJS

FOR transport in Transports
    FILTER transport.Supplier == "Beauty-DE"
    LET transportData = (
        LET fromCountry = (
            FOR c IN Countries
                FILTER c._id == transport._from
                LIMIT 1
                RETURN {
                    "Country": c._key,
                    "Region": c.Region
                }
        )
        LET toCountry = (
            FOR c IN Countries
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
            "Ship Date": transport.`Ship Date`
        }
    )
    LET orderData = (
        FOR o IN Orders
            FILTER o._key == transport._key
            RETURN o
    )

    
    RETURN {
        transport, transportData, orderData
    }
//////////////////////////////
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
/*app.get('/', (req, res) => {
  main().then((sales) => {
    res.send(sales.map(sale => sale.Country).join())
  })
})*/

app.get('/', (req, res) => {
    res.send("Welcome");

})
// 
app.get('/items/:id', (req, res) => {
    main().then(() => {
        req.params; // { userId: }
        res.json(req.params);    
        })
  })

app.get('/supplier/:id', (req, res) => {
    main().then(() => {
        req.params; // { userId: }
        res.json(req.params);    
        })
})

app.get('/countries/:region', (req, res) => {
    //
})
app.get('/countries/:region', (req, res) => {
    main().then(() => {
        req.params; // { userId: }
        res.json(req.params);    
        })
})
app.get('/', async (req, res) => {
    try{
        const Orders = db.collection('Orders')
        const orders = await db.query(aql`
          FOR orders IN ${Orders}
          RETURN orders
          `)
        for await (const order of orders) {
        //console.log(sale)
        result.push(orders)
        }
        return result;
        res.send(orders);
    } 
    catch (err) {
        console.error(err.message)
      }
   });

/*router.get('/books', async (req, res) => {
    try {
     const books = await Book.list();
     res.json(books);
    } catch (err) {
     res.json({ error: err.message || err.toString() });
    }
   });*/


// Collections 

async function main() {
  let result = []

  try{
    const Orders = db.collection('Orders')
    const orders = await db.query(aql`
      FOR orders IN ${Orders}
      RETURN orders
      `)
    for await (const orders of Orders) {
    //console.log(sale)
    result.push(orders)
    }
    return result;

  }
  //try{}
  //try{}

  catch (err) {
    console.error(err.message)
  }


  }

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})



