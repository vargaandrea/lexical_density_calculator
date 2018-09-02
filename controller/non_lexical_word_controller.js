let NonLexicalWord = require('../models/non_lexical_word');


var NonLexicalWordController = {
  GetAll: function(req, res) {
    NonLexicalWordController.RenderNonLexicalWords(req, res, '')
  },

  AddForm: function(req, res){
    res.render('add_non_lexical_word', {
      title:'Add non-lexical word'
    });
  },

  Add: function(req, res){
    if(!req.user || !req.user._id){
     res.redirect('/users/login');
    } else {
      req.checkBody('word','Word is required').notEmpty();
      req.getValidationResult().then( function (result) {
        if (!result.isEmpty()) {
          var errors = result.array().map(function (elem) {
              return elem.msg;
          });
          console.log('There are following validation errors: ' + errors.join('&&'));
          res.render('add_non_lexical_word', {
            title:'Add non-lexical word',
            errors: result.array()
          });
        } else {

          let non_lexical_word = new NonLexicalWord();
          non_lexical_word.word = req.body.word;

          non_lexical_word.save(function(err){
            if(err){
              console.log(err);
              return;
            } else {
              NonLexicalWordController.RenderNonLexicalWords(req, res, 'Word has been added');
            }
          });
        }
      });
    }
  },

  EditForm: function(req, res){
    if(!req.user && req.user._id){
     res.redirect('/users/login');
    } else {
      NonLexicalWord.findById(req.params.id, function(err, non_lexical_word){
        if(err){
          console.log(err);
          return;
        } else {
          res.render('edit_non_lexical_word', {
            title: 'Edit non-lexical Word',
            non_lexical_word: non_lexical_word
          });
        }
      });
    }
  },

  Update: function(req, res){
    let non_lexical_word = {};
    non_lexical_word.word = req.body.word;

    let query = {_id: req.params.id};

    NonLexicalWord.update(query, non_lexical_word, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        NonLexicalWordController.RenderNonLexicalWords(req, res, 'Word has been updated');
      }
    });
  },

  ResetList: function(req, res){
      NonLexicalWord.remove({}, function(err){
        if(err){
          console.log(err);
        } else {
          var fs = require('fs');
          var words = fs.readFileSync('./assets/non_lexical_words.txt').toString().split("\n");
          var word_objects = [];
          for(i in words) {
            word_objects.push({word: words[i]})
          }
          NonLexicalWord.insertMany(word_objects, function(err) {
            if(err){
              console.log(err);
            } else {
              req.flash('success', 'List has been reset');
              res.redirect('/non_lexical_words');
            }
          });
        }

      });

  },

  Delete: function(req, res) {
    if(!req.user || !req.user._id){
      res.redirect('/users/login');
    } else {
      let query = {_id: req.params.id};
      NonLexicalWord.findByIdAndRemove(req.params.id, function(err, non_lexical_word){
        if(err){
          console.log(err);
        } else {
          res.json({ result: 'success' });
        }
      });
    }
  },


  RenderNonLexicalWords: function (req, res, succesText='') {
    NonLexicalWord.find({}, function(err, non_lexical_words){
      if(err){
        console.log(err);
      } else {
        if(succesText.length > 0) {
          req.flash('success', succesText);
        }
        res.render('non_lexical_words', {
          title:'Non-lexical words',
          non_lexical_words: non_lexical_words
        });
      }
    });
  },
}


module.exports = NonLexicalWordController;
