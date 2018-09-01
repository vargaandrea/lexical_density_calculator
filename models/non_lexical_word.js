let mongoose = require('mongoose');

// NonLexicalWord Schema
let nonLexicalWordSchema = mongoose.Schema({
  word:{
    type: String,
    required: true
  }
});

let NonLexicalWord = module.exports = mongoose.model('non_lexical_word', nonLexicalWordSchema);
