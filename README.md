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

### Project architecture:

![architecture](/images/project-architecture.png)

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
- import developemnt data: PASSWORD FOR ALL USERS 👉 test1234
  ```
  node ./dev-data/data/import-dev-data.js --delete
  node ./dev-data/data/import-dev-data.js --import
  ```
  - run $ npm start
  - install the Slugify package: npm i slugify
  - install validator.js: npm i validator --force
  - (OPTIONAL) for debug only:
    - add script to package.json:
      ```
      "scripts": {
        "debug": "node --inspect server.js"
      },
      ```
    - run Ctrl + C in terminal to terminate the process
    - $ npm run debug
    - go to chrome://inspect, and click "inspect" to acesss the debugge
  - run $ npm start
  - start a process in production mode: npm run start:prod
  - install bcryptjs package: npm i bcryptjs
  - install JSON web token package: npm i jsonwebtoken
  - install Nodemailer: npm i nodemailer
  - install the rate-limiting middleware for Express to prevent brute force attacks from the same IP: npm i express-rate-limit
  - install Helmet to secure the Express app by setting various HTTP headers: npm i helmet --legacy-peer-deps
  - install Express Mongoose Sanitize module: npm i express-mongo-sanitize
  - install xss-clean module to sanitize user input coming from POST body, GET queries, and url params: npm i xss-clean
  - install Express HPP middleware to protect against HTTP Parameter Pollution (HPP) attacks: npm i hpp
  - run debugger when needed (refer to package.json): npm run debug
  - install Pug module: npm i pug
  - downgrade helmet to 3.23.3:
    ```
    npm uninstall helmet
    npm i helmet@3.23.3
    ```
  - install mapbox-gl into the project: npm i mapbox-gl
  - install the cookie parser: npm i cookie-parser
  - install Parcel.js: sudo npm i parcel-bundler@1 --save-dev
  - npm run watch:js
  - install Axios (a promise-based HTTP client for node.js and the browser): npm i axios
  - npm i @babel/polyfill
  - NPM install Multer: npm i multer
  - install Sharp module to resize images: npm i sharp
  - install the converter that parses HTML and returns beautiful text: npm i html-to-text --legacy-peer-deps

<br>

### Start/stop/restart MongoDB with Homebrew:

```
brew services run mongodb-community@6.0
brew services stop mongodb-community@6.0
brew services restart mongodb-community
```

<br>

### MVC architecture:

![MVC](/images/MVC.png)

<br>

### Data model:

![data model](/images/data-model.png)

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

### MongoDB Compass - interact with data:

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

### Postman queries:

- filtering: http://127.0.0.1:3000/api/v1/tours?&duration=5&difficulty=easy
- filtering: http://127.0.0.1:3000/api/v1/tours?&duration[gte]=5&difficulty=easy
- advanced filtering: http://127.0.0.1:3000/api/v1/tours?&duration[gte]=5&difficulty=easy&price[lt]=1500
- sorting: http://127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage (price: des, ratingsAverage: asc)
  or http://127.0.0.1:3000/api/v1/tours?duration[gte]=10&sort=price
- field limiting: http://127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price --> include
  or http://127.0.0.1:3000/api/v1/tours?fields=-duration,-difficulty --> exclude
- pagination: http://127.0.0.1:3000/api/v1/tours?page=2&limit=3
- http://127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price
- alias route: http://127.0.0.1:3000/api/v1/tours/top-rated
- ...

<br>

### References:

1. Mongoose queries: https://mongoosejs.com/docs/queries.html
2. validator.js - a library of STRING validators and sanitizers: https://github.com/validatorjs/validator.js/
3. Mailtrap (email delivery platform): https://mailtrap.io/
4. Mapbox (precise location data and powerful developer tools): https://www.mapbox.com
5. Parcel (web application bundler): https://parceljs.org/
6. Multer (a node.js middleware for handling multipart/form-data, primarily used for uploading files): https://www.npmjs.com/package/multer
