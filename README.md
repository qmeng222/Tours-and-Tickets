## Tours-and-Tickets

A real-world RESTful API and web app with authentication, security, and payments.

<br>

### Tech stack:

- html
- css
- JavaScript
- Node.js (as the dynamic web server)
- Express.js

<br>

### Project setup:

- repo: https://github.com/qmeng222/Farm-Fresh-to-You.git
- set up a new npm package: $ npm init
- install Express at version 4 (install the latest version inside of 4): $ npm i express@4
- install the 3rd-party middleware Morgan (HTTP request logger): $ npm i morgan
- (recipe) set up ESLint + Prettier in VS Code,
  and save as dev dependencies;
  after the installation, package.json file will have these packages as "devDependencies".
  Rules: https://eslint.org/docs/latest/rules/
  ```
  npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
  ```
  - eslint-config-prettier: disable formatting for ESLint, because we want prettier to format our code
  - eslint-plugin-prettier: allow ESLint to show formatting errors as we type using prettier
  - eslint-config-airbnb: a style guide
  - eslint-plugin-node: add a couple of specific ESLint rules only for nodejs (find some errors that we might be doing when writing nodejs code)
  - and other ESLint plugins that airbnb style guide depends on
- (in case) to uninstall all of them at once:
  ```
  npm un eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react
  ```
- run $ npm start
- Connect to cluster using MongoDB Compass:
  - new collection URI: mongodb+srv://qmeng222:s6f97MLHsL0P0f1l@cluster0.vinir2x.mongodb.net/test
- install Mongoose (a MongoDB's native driver) version 5:
  - install: npm i mongoose@5
  - now package.json > dependencies is updated with "mongoose": "^5.13.15"
  - or simply find the version by: npm list mongoose
- run $ npm start

<br>

### Start/stop/restart MongoDB with Homebrew:

```
brew services run mongodb-community@6.0
brew services stop mongodb-community@6.0
brew services restart mongodb-community
```

<br>

### Database CRUD operations:

- selected database: tours-test
- selected collection: tours

```
show dbs
use tours-test  # create or switch to a database
show collections
db.tours.insertOne({name: "The Forest Hiker", price: 297, rating: 4.7})
db.tours.insertMany([{...}, {..., difficulty: "easy"}])
db.tours.find()  # select and display all
db.tours.find({name: "The Forest Hiker"})  # filter and display
db.tours.find({difficulty: "easy"})  # filter
db.tours.find({price: {$lte: 500}})
db.tours.find({price: {$lte: 500}, rating: {$gt: 4.5}})  # AND querying
db.tours.find({$or: [{price: {$lte: 500}}, {rating: {$gt: 4.5}}]})  # OR querying
db.tours.find({$or: [{price: {$lte: 500}}, {rating: {$gt: 4.5}}]}, {name: 1})  # OR querying, only displaying "_id" and "name"
db.tours.updateOne({name: "The Forest Hiker"}, {$set: {rating: 4.6}})  # updateOne({selector}, {setter})
db.tours.updateMany({price: {$gte: 300}, rating: {$gte: 4.8}}, {$set: {premium: true}})
db.tours.deleteMany({premium: true})
db.tours.deleteMany({})  # be careful doing this!
db.COLLECTION_NAME.drop()  # drop a collection from the database
```

<br>

### MongoDB Compass - interact with data

1. Insert documents to a collection:
   To insert multiple documents, enter a comma-separated array of JSON documents.
   ```
   [
     { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
     { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
     { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 },
     { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
     { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 }
   ]
   ```
2. Set query filter:
   - Filter: {price: {$lt: 550}}
   - Project: {name: 1}

<br>

### References:

1. Mongoose queries: https://mongoosejs.com/docs/queries.html
