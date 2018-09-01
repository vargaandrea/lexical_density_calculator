const express = require('express');
const router = express.Router();

// NonLexicalWord Model
let NonLexicalWord = require('../models/non_lexical_word');
// User Model
let User = require('../models/user');

router.get('/', function(req, res){
  render_non_lexical_words(req, res, '')
});

router.get('/deleted', function(req, res){
  render_non_lexical_words(req, res, 'Word has been deleted')
});

// Add Route
router.get('/add', function(req, res){
  res.render('add_non_lexical_word', {
    title:'Add non-lexical word'
  });
});

router.delete('/:id', function(req, res){
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
});

// Add Submit POST Route
router.post('/add', function(req, res){
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
            render_non_lexical_words(req, res, 'Word has been added');
          }
        });
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', function(req, res){
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
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let non_lexical_word = {};
  non_lexical_word.word = req.body.word;

  let query = {_id: req.params.id};

  NonLexicalWord.update(query, non_lexical_word, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      render_non_lexical_words(req, res, 'Word has been added');
    }
  });
});

// Delete NonLexicalWord
router.get('/reset_list', function(req, res){
  if(!req.user || !req.user._id) {
    res.redirect('/users/login');
  } else {
    let query = {};

    NonLexicalWord.findById(req.params.id, function(err, non_lexical_word){

      NonLexicalWord.remove(query, function(err){
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
    });
  }
});


// Get Single NonLexicalWord
router.get('/:id', function(req, res){
  NonLexicalWord.findById(req.params.id, function(err, non_lexical_word){
    User.findById(non_lexical_word.id, function(err, user){
      res.render('non_lexical_word', {
        non_lexical_word: non_lexical_word
      });
    });
  });
});;

function render_non_lexical_words(req, res, succesText='') {
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
}

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
