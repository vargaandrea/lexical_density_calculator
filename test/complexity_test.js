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
  it('It should return json with overall_ld: 66.67', (done) => {
    chai.request(app)
    .get('/complexity')
    .send(send_data3)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.jsonObj();
      res.body.should.be.jsonObj().to.containSubset( { data: { overall_ld : "66.67"} } );
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
      res.body.should.be.jsonObj().to.containSubset( { data: { overall_ld: '63.64', sentence_ld: ['66.67', '60.00']} } );
      done();
    });
  });
});
