const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
require('dotenv').config();

// const ObjectId=require('mongodb').ObjectId
app.use(cors());
app.use(express.json())
const port =process.env.PORT || 5000
app.get('/', (req, res) => {
    res.send('welcome sawda in ema john!!!!')
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eoyrd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//function
//emadbUser
//ezbg5TE2Gw6THhAG
async function run() {
    try {
        await client.connect();
        const database = client.db('onlineShop')
        const productsCollection = database.collection('products')
        const orderCollection=database.collection('orders')
//get products api
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const page =req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const count=await cursor.count()
            if (page) {
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }
    res.send({
        count,
        products
    }
    );
        })
        //post
        app.post('/products/bykeys', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await productsCollection.find(query).toArray();
            res.send(products)
        })

    //add orders api

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result=await orderCollection.insertOne(order)

            console.log('order',order)
            res.json(result)
        })
    }

    
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
//listen
app.listen(port, () => {
    console.log('Server is running',port)
})