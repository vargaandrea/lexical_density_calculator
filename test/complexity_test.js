process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiJSON = require('chai-json');
let chaiSubset = require('chai-subset');
let should = chai.should();
let app = require('../app');

chai.use(chaiHttp);
chai.use(chaiJSON);
chai.use(chaiSubset);

describe('complexity', () => {
  let NonLexicalWord = require('../models/non_lexical_word');
  function setUp () {
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
        console.log(word_objects.length + ' non-lexical words entered in test db.');
      }
    });
  }

  function cleanUp () {
    NonLexicalWord.remove({}, function(err) {
      if(err){
        console.log(err);
      } else {
        console.log('Non-lexical words deleted from test db.');
      }
    });
    done => {
      mongoose.models = {};
      mongoose.modelSchemas = {};
      mongoose.connection.close();

    }
    done();
  }

  before(setUp)
  after(cleanUp)


  describe('/GET complexity', () => {
    it('It should return error: json:Input text missing', (done) => {
      chai.request(app)
      .get('/complexity')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.jsonObj();
        res.body.should.be.jsonObj().to.containSubset({ error: "Input text missing" });
        done();
      });
    });
  });


  var send_data1 = {
      'input_text' : "test, ".repeat(101)
  };
  describe('/GET complexity', () => {
    it('It should return error: Input text has too many words', (done) => {
      chai.request(app)
      .get('/complexity')
      .send(send_data1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.jsonObj();
        res.body.should.be.jsonObj().to.containSubset( { error: "Input text has too many words"} );
        done();
      });
    });
  });


  var send_data2 = {
      'input_text' : "a".repeat(1001)
  };
  describe('/GET complexity', () => {
    it('It should return error: Input text is too long', (done) => {
      chai.request(app)
      .get('/complexity')
      .send(send_data2)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.jsonObj();
        res.body.should.be.jsonObj().to.containSubset( { error: "Input text is too long"} );
        done();
      });
    });
  });


  var send_data3 = {
      'input_text' : "Kim loves going​ to the​ cinema."
  };
  describe('/GET complexity', () => {
    it('It should return json with overall_ld: 0.6667', (done) => {
      chai.request(app)
      .get('/complexity')
      .send(send_data3)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.jsonObj();
        res.body.should.be.jsonObj().to.containSubset( { data: { overall_ld : "0.6667"} } );
        done();
      });
    });
  });


  var send_data4 = {
      'input_text' : "Kim loves going​ to the​ cinema. He wants to go today."
  };
  describe('/GET complexity', () => {
    it('It should return verbose lexical diversity', (done) => {
      chai.request(app)
      .get('/complexity?mode=verbose')
      .send(send_data4)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.jsonObj().to.containSubset( { data: { overall_ld: '0.6364', sentence_ld: ['0.6667', '0.6000']} } );
        done();
      });
    });
  });

});
