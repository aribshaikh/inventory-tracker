# Challenge Submission
This is built using MongoDB, React, Express, and Node.js. Express was used to build server.js and to create the API that consists of the following features (CRUD):
- Create an item
- Delete an item
- View all items
- Update an item

Additional Feature:
- Comments for Deletion/Undeletion

## Deployed Link
https://replit.com/@aribshaikh1/submission

## API Docs

## Routes

#### /items - GET Request
GET request that requests all the available items in the inventory
- Request: GET
- URL: ``` /items/ ```
- Request Body: none
- Response body returns a list of all item objects

#### /archived - GET Request
GET request that requests all 'deleted' items the user has made
- Request: GET
- URL: ``` /archived ```
- Request Body: none
- Response: Body returns list of all item objects

#### /add - POST Request
POST request that sends a new items data to the server and saves it in the database
- Request body contains a user object from the data inputted into the frontend
```
  { "product": Name of Product, 
    "amount": Number of supply, 
    "color": Color, 
    "vendor": Vendor }
```

#### /:id - PATCH Request
PATCH request that updates the item, based on the given id of the product.
- Request body contains a user object from the data inputted into the frontend
```
  { "product": Name of Product, 
    "amount": Number of supply, 
    "color": Color, 
    "vendor": Vendor }
```

#### /:id - DELETE Request
DELETE request that permanently deletes the item, based on the given id of the product.


### /undelete/:id - POST Request
POST request that undeletes the item from the item list, and moves it to the regular items section, based on ID.


