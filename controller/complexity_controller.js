const LexicalAnalysis = require('../lib/lexical_analysis');
var NonLexicalWord = require('../models/non_lexical_word');

var ComplexityController = {
  GetComplexity: function(req, res) {
    let verbose = false;
    if(req.query.mode !== undefined) {
      verbose = true;
    }
    if(req.body.input_text === undefined) {
      res.json({data: {}, error: 'Input text missing'});
      return;
    }

    let inputText = req.body.input_text

    //verify inputText length
    if (inputText.length > 1000) {
      res.json({error: "Input text is too long"});
      return;
    }

    var la = new LexicalAnalysis(inputText);

    //verify word count
    if (la.getTotalWordsCount() > 100) {
      res.json({error: "Input text has too many words"});
      return;
    }

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

module.exports = ComplexityController;
