# Initialization

- npm init
- npm i -g typescript

<!-- tsc is the typescript compiler, the command
    notify to the package that project is also typescript project -->

- tsc --init

<!-- needed for ts to recognize js libraries types -->

- npm install -D @types/node

<!-- uncomment the types for node.js in tsconfig -->

<!-- set: "verbatimModuleSyntax": false, in tsconfig -->

<!-- ps2 opens a web server that updates each time the ts code is modified -->

- npm install pm2 -D
- npm i -g pm2

- pm2-dev index.js

<!-- or if you configured dist folder -->

- pm2-dev dist

<!-- use on another terminal to transpile continuosly -->

- npx tsc --watch

<!-- a library that will load for us the .env -->

- npm i dotenv
- npm install @types/dotenv

# Compilation

- tsc
- node app.js

<!-- you can configure scripts in package.json to use npm commands to run your app -->

- "start": "node dist/index.js"
- "dev": "nodemon src/index.js"
- "build": "tsc -p ."

ex: npm run dev

# Express

Express is a node.js web application framework

- npm install express
- npm install typescript ts-node @types/node @types/express --save-dev

<!-- you can configure the output folder and root directory in tsconfig -->

# MySql

- npm i mysql2

# Spiegoni

A REST API, or representational state transfer application programming interface, is an architectural style that's commonly seen as the standard for designing and building the networked applications that power the web.

An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate, exchange data, and share functionality.

Middleware is software that acts as a bridge or "glue" between different applications, databases, or operating systems, enabling them to communicate or exchange data.