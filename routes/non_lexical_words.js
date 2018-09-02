var express = require('express');
var router = express.Router();
var NonLexicalWordController = require('../controller/non_lexical_word_controller')


router.get('/', NonLexicalWordController.GetAll);

router.get('/add_form', ensureAuthenticated, NonLexicalWordController.AddForm);

router.post('/add', NonLexicalWordController.Add );

router.get('/edit_form/:id', ensureAuthenticated, NonLexicalWordController.EditForm);

router.post('/edit/:id', ensureAuthenticated, NonLexicalWordController.Update);

router.get('/reset_list', ensureAuthenticated, NonLexicalWordController.ResetList);

router.delete('/:id', ensureAuthenticated, NonLexicalWordController.Delete);

router.get('/deleted', ensureAuthenticated, function(req, res){
  NonLexicalWordController.RenderNonLexicalWords(req, res, 'Word has been deleted');
});

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
