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

const PORT = process.env.PORT || 5000;
const path = require('path');
const { equal } = require('assert');

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

app.get("/items",  async (req, res) => {
    
    try {
		const inventory = await Inventory.find({'archived.delete': false})
		res.status(200).json(inventory);

	} catch(error){
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})

app.get("/archived",  async (req, res) => {

    try {
		const inventory = await Inventory.find({'archived.delete': true})
		res.status(200).json(inventory);

	} catch(error){
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
})


app.post("/add", async (req, res) => {

    if(isNaN(req.body.amount) || req.body.product == "" || req.body.color == "" || req.body.vendor == "") {
      console.log('Invalid/missing input')
    }
    else { 
    const inventory = new Inventory({
        product: req.body.product,
        amount: Number(req.body.amount),
        color: req.body.color,
        vendor: req.body.vendor,
        archived: {
            delete: false,
            comment: ""
          },
    });
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
}
})

// Update an item
app.patch("/:id", async (req, res) => {
  if(isNaN(req.body.amount)) {
    console.log('Invalid input for amount, cannot complete request')
  }
  else{ 
    const id = req.params.id
    const Item = {
        product: req.body.product,
        amount: req.body.amount,
        color: req.body.color,
        vendor: req.body.vendor
    }
    const item = await Inventory.findById(id);
    
    // Checking for empty string input
    if (req.body.product == "") {
        req.body.product = item.product;
        Item.product = item.product;
    }
    if (req.body.amount == "") {
        req.body.amount = item.amount;
        Item.amount = item.amount;
        console.log('Amount is ' + item.amount)
    }
    if (req.body.color == "") {
        req.body.color = item.color;
        Item.color = item.color;
    }
    if (req.body.vendor == "") {
        req.body.vendor = item.vendor;
        Item.vendor = item.vendor;
    }
    Inventory.findOneAndUpdate({_id: id},  {$set: {
        product: req.body.product,
        amount: Number(req.body.amount),
        color: req.body.color,
        vendor: req.body.vendor
      }}, {useFindAndModify: false})
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
      }
})

// Permanent Delete
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

// Archive/Delete
app.post("/delete/:id", function(req, res){

    Inventory.findOneAndUpdate({_id: req.params.id},  {$set: {
      archived: {
        delete: true, 
        comment: req.body.comment
      } 
    }}, {useFindAndModify: false},
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted permanently.");
        res.redirect("/");
      }
    });
  });

  // Archive/Delete
app.post("/undelete/:id", function(req, res){
    Inventory.findOneAndUpdate({_id: req.params.id},  {$set: {
      archived: {
        delete: false, 
        comment: ""
      } 
    }}, {useFindAndModify: false},
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully undeleted");
        res.redirect("/");
      }
    });
  });

app.use(express.static(__dirname + "/client/build"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})