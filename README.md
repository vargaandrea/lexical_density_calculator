# Lexical density calculator API


## Usage


### Installation

Install the dependencies:

```sh
$ npm install
```
Edit config.js for MongoDB URI.

Run Test:
```sh 
$ npm test
```

Run app:

```sh
$ npm start
```

## Description:

[Api Documentation](docs/API_docs.md)

Non-lexical words are stored in a Mongo DB. 

UI is included for entering a text and calculating lexical density, as well as protected area for creating the list of non-lexical words and add/edit/delete them.

For calculations to work, the list of non-lexical words needs to be set up:
 * Access UI from browser (http://localhost:3000)
 * seletct from top menu: "Register" -> register a user
 * Log in with the user
 * select: "Non-lexical words" -> press "Reset list"
 
Select "Home" -> use form to calculate lexical density.
![Screenshot Lexical densitity calculator](/docs/screenshot_ui_ld.jpg)


## Inspired by:

https://github.com/bradtraversy/nodekb for NodeJS/Express/MongoDB,
https://github.com/NaturalNode/natural for Tokenizer
https://github.com/parmentf/node-sentence-tokenizer for sentence Tokenizer (it's word tokenizer is buggy, splits only on space)
https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai for testing

## Technologies
* Node.js
* Express
* MongoDB & Mongoose
* Pug Templating
* Chai
