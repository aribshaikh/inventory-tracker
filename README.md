# Challenge Submission
This is built using MongoDB, React, Express, and Node.js. Express was used to build server.js and to create the API that consists of the following features (CRUD):
- Create an item
- Delete an item
- View all items
- Update an item

Additional Feature:
- Comments for Deletion/Undeletion

## Deployed Link
if deployed link is not working, feel free to clone the repo and run the project locally.

Install react and npm on your device, next.

Enter the project directory and run the following commands:

```
$ npm install
$ node server.js
```

cd to client folder and install the following

```
$ cd client
$ npm install
$ npm start
```

Open `http://localhost:3000`

**If you node server.js command is giving an error**

code: 'MODULE_NOT_FOUND',
requireStack: [ '/Users/inventory-tracker/server.js' ]

Run the following steps:
1. Delete the package-lock.json
2. In the root directory run: 
```
$ npm install
$ node server.js
```
**If the webpage does not open after 'npm start'**

Run the following commands:

```
$ export NODE_OPTIONS=--openssl-legacy-provider
$ npm start
```
