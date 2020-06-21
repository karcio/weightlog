var expect = require('chai').expect;
var request = require('request');

describe('Status and headers', function() {

  it('Main page status', function(done) {
    request('http://localhost:5000', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Insert page status', function(done) {
    request('http://localhost:5000/insert', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Average page status', function(done) {
    request('http://localhost:5000/avg', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('All log page status', function(done) {
    request('http://localhost:5000/all', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

});
