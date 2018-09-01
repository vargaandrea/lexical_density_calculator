const express = require('express');
const router = express.Router();
const LexicalAnalysis = require('../lib/lexical_analysis');
let NonLexicalWord = require('../models/non_lexical_word');


router.get('/', function(req, res){
  let verbose = false;
  if(req.query.mode !== undefined) {
    verbose = true;
  }
  if(req.body.input_text === undefined) {
    res.json({data: {}, error: 'Input text missing'});
  } else {
    let inputText = req.body.input_text

    //verify inputText length:
    if (inputText.length > 1000) {
      res.json({error: "Input text is too long"});
    } else {
      //verify word count
      var la = new LexicalAnalysis(inputText);

      if (la.getTotalWordsCount() > 100) {
        res.json({error: "Input text has too many words"});
      } else {
        NonLexicalWord.find({}, function(err, nonLexicalWords) {
          if(err){
            console.log(err);
          } else {
            la.setNonLexicalWords(nonLexicalWords);
            if (verbose) {
              res.json({ data: {
                           overall_ld: la.getLexicalDensity(),
                           sentence_ld: la.getLexicalDensityPerSentence()
                         }
                      });
            } else {
              res.json({ data: {
                           overall_ld: la.getLexicalDensity()
                         }
                       });
            }

          }
        });
      }
    }
  }

});

module.exports = router;