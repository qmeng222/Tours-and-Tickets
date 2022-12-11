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
