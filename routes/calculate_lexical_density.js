var express = require('express');
var router = express.Router();
var http = require("http");
var requestComplexity = require("../lib/request_complexity");
var http = require("http");
var querystring = require('querystring');

// Register Form
router.get('/', function(req, res){
  res.render('calculate_lexical_density', {
      title: 'Calculate lexical density',
      input_text: 'Kim loves going ​ to the ​ cinema',
      verbose: true
  });
});

// Register Process
router.post('/', function(req, res){
  req.checkBody('input_text', 'Text is required').notEmpty();
  req.getValidationResult().then( function (result) {
    if (!result.isEmpty()) {
      var errors = result.array().map(function (elem) {
          return elem.msg;
      });
      console.log('There are following validation errors: ' + errors.join('&&'));
      res.render('calculate_lexical_density', {
          errors: result.array()
      });
    } else {

      var inputText = req.body.input_text;
      var verbose = (req.body.verbose !== undefined && req.body.verbose == 'on') ? true : false;

      var requestPromise = requestComplexity(inputText, verbose);
      requestPromise.then(function (resultJSON) {
        if (resultJSON.error && resultJSON.error.length > 0) {
          req.flash('error', resultJSON.error);
        } else {
          req.flash('success', 'Overall lexical density: ', resultJSON.data.overall_ld);
          if (verbose) {
            req.flash('success', 'Lexical density per sentences: ', resultJSON.data.sentence_ld);
          }
        }
        res.render('calculate_lexical_density', {
            title: 'Calculate lexical density',
            input_text: inputText,
            verbose: verbose
        });
      }, function (err) {
        console.log("ERROR");
      });
    }
  })
});

module.exports = router;
