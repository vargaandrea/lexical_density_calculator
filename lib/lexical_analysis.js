var SentenceTokenizer = require('sentence-tokenizer');

function LexicalAnalysis (text='', nonLexicalWords = []) {
  this._text = text;
  this._nonLexicalWords = nonLexicalWords;
  this._init();
  this._prepareText();
  this._analyzeText();
}

LexicalAnalysis.prototype._init = function(text) {
  this._totalWordsCount = 0;
  this._uniqueLexicalWordsCount = 0;
}

LexicalAnalysis.prototype.setText = function(text) {
  this._text = text;
  this._init();
  this._prepareText();
  this._analyzeText();
}
LexicalAnalysis.prototype.setNonLexicalWords = function(nonLexicalWords) {
  this._nonLexicalWords = nonLexicalWords;
  this._init();
  this._analyzeText();
}


LexicalAnalysis.prototype.getTotalWordsCount = function() {
  return this._totalWordsCount;
}
LexicalAnalysis.prototype.getLexicalDensity = function() {
  return (this._lexicalDensity *100).toFixed(2);
}

LexicalAnalysis.prototype.getLexicalDensityPerSentence = function() {
  let sentences_ld = [];
  let sentenceTokenizer = new SentenceTokenizer('A');
  sentenceTokenizer.setEntry(this._text);
  let sentences = sentenceTokenizer.getSentences();
  sentenceTokenizer.setEntry(this._preparedText);
  let sentencesLexical = sentenceTokenizer.getSentences();
  if (sentences.length == 1) {
    sentences_ld[0] = this.getLexicalDensity();
  } else {
    for (let i = 0; i < sentences.length; i++) {  
      // non lexical words are already excluded
      let la = new LexicalAnalysis(sentences[i], this._nonLexicalWords);
      sentences_ld[i]= la.getLexicalDensity();
    }

  }

  return sentences_ld;
}

// ----------------------------------------------------------------------------------------

LexicalAnalysis.prototype._prepareText = function() {
  //lower the case and remove number
  this._preparedText = this._text.toLowerCase().replace(/\d/g,'');

}

LexicalAnalysis.prototype._analyzeText = function() {
  this._totalWordsCount = this._getAllTokens().length;
  this._uniqueLexicalWordsCount =  new Set(this._getLexicalTokens()).size;
  this._lexicalDensity = this._uniqueLexicalWordsCount / this._totalWordsCount;
}

LexicalAnalysis.prototype._getAllTokens = function() {
  return this._getTokens(this._preparedText);
}
LexicalAnalysis.prototype._getLexicalTokens = function() {
  //remove nonLexicalWords
  let text = this._preparedText;
  for (let i = 0; i < this._nonLexicalWords.length; i++) {
    let re = new RegExp('\\b' + this._nonLexicalWords[i].word + '\\b', 'g');
    text = text.replace(re,'');
  }
  return this._getTokens(text);

}

LexicalAnalysis.prototype._getTokens = function(text) {
  return this._trimArray(text.split(/\W+/));
}

LexicalAnalysis.prototype._trimArray = function(array) {
  while (array[array.length - 1] == '')
    array.pop();

  while (array[0] == '')
    array.shift();

  return array;
}


module.exports = LexicalAnalysis;
