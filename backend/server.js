const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Inventory = require("./models/inventory");

require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established")
})

app.get("/", (req, res) => {
    Inventory.find((error, inventorys) => {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            res.status(200).json(inventorys);
        }
    })
})

app.get("/download", (req, res) => {
    Inventory.find((error, inventorys) => {
        if (error) {
            res.status(400).json({
                error: error
            });
        } else {
            console.log(inventorys);

            var {Parser} = require('json2csv');
            const fields = [
                {
                    label: '_id',
                    value: 'id'
                },
                {
                    label: 'product',
                    value: 'product'
                },
                {
                    label: 'amount',
                    value: 'amount'
                },
                {
                    label: 'location',
                    value: 'location'
                }
            ]
            const json2csv = new Parser({fields: fields})
            const csv = json2csv.parse(inventorys)
            res.attachment('inventorys.csv')
            res.download('')
            res.status(200).send(csv);
        }
    })
})

app.post("/create", (req, res) => {
    const inventory = new Inventory({
        product: req.body.product,
        amount: Number(req.body.amount),
        location: req.body.location,
        shipped: req.body.shipped
    });
    inventory
        .save()
        .then((inventory) => {
            res.status(200).json(inventory);
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        })
})

app.patch("/:product", (req, res) => {
    Inventory.updateOne({ product: req.params.product }, { amount: req.body.amount })
        .then(() => {
            res.status(200).json({
                message: "updated " + req.params.product +  " inventory amount to " + req.body.amount
            })
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        })
})

app.delete("/:product", (req, res) => {
    Inventory.deleteOne({ product: req.params.product })
    .then(data => {
        if (data.n == 0) {
            console.log("no user deleted");
            res.status(404).json(data);
        } else {
            console.log(" user was successfully deleted");
            res.status(200).json(data);
        }
    })
    .catch((error) => {
        res.status(404).json({
            error: error
        });
    });
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})