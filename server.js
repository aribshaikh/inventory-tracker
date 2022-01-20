// Express
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
// app.use(bodyParser.json());
const cors = require('cors');

// Mongoose
const mongoose = require('mongoose');
const Inventory = require("./models/inventory");

require('dotenv').config();

const port = process.env.port || 5000;
const path = require('path')

app.use(cors());
app.use(express.json());
// use the express-static middleware
// app.use(express.static(path.join(__dirname,"public")))

// // Step 1:
// app.use(express.static(path.resolve(__dirname, "./client/build")));
// // Step 2:
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// });
const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established")
})

app.get("/",  async (req, res) => {
    // Inventory.find((error, inventorys) => {
    //     if (error) {
    //         res.status(400).json({
    //             error: error
    //         });
    //     } else {
    //         res.status(200).json(inventorys);
    //     }
    // })
    try {
		const inventorys = await Inventory.find()
		res.status(200).json(inventorys);

	} catch(error){
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
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

app.post("/add", async (req, res) => {
    const inventory = new Inventory({
        product: req.body.product,
        amount: Number(req.body.amount),
        color: req.body.color,
        vendor: req.body.vendor,
    });
    // inventory
    //     .save()
    //     .then((inventory) => {
    //         res.status(200).json(inventory);
    //     })
    //     .catch((error) => {
    //         res.status(400).json({
    //             error: error
    //         });
    //     })
    try {
		const result = await inventory.save()	
		res.status(200).json(result);
	} catch(error) {
		console.log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			log('ISSUE HERE 2')
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})

app.patch("/:id", (req, res) => {
    console.log('This is console id' + req.params.id)
    const id = req.params.id
    Inventory.findByIdAndUpdate(id, { product: req.body.product,  amount: req.body.amount }, { amount: req.body.amount })
    // Inventory.updateOne({ product: req.params.product }, { amount: req.body.amount })
        .then(() => {
            res.status(200).json({
                message: "updated " + req.params.id +  " inventory amount to " + req.body.amount
            })
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        })
})

app.delete("/:id", (req, res) => {
    Inventory.deleteOne({ _id: req.params.id })
    .then(data => {
        if (data.n == 0) {
            console.log("no user deleted");
            res.status(404).json(data);
        } else {
            console.log(" user successfully deleted");
            res.status(200).json(data);
        }
    })
    .catch((error) => {
        res.status(404).json({
            error: error
        });
    });
})

app.use(express.static(__dirname + "/client/build"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})