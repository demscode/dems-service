describe('DemS API /carer', function() {
  var settings = require('../../dems.conf.json'),
      model = require('../../models/carer').init(settings.db.mongo),
      request = require('supertest');
      request = request('http://localhost:3000');

  var carer24 = { id: 24, token: "iAmAToken", email: "fake@fakecarers.com", name: "Fake Carer" },
      carer2405 = {id: 2405, token: "anotherCarerToken", email: "best_carer@fakecarers.com", name: "Best Carer" };


  describe('Carer Details', function() {

    beforeEach(function(done) {
      model.create(carer24);
      model.create(carer2405);
      done();
    });

    afterEach(function(done) {
      model.destroyAll(function(data) {
        model.count(function(err, count) {
          expect(err).toBe(null);
          //expect(count).toBe(0);
          done();
        });
      });
    });

    it('GET valid carers', function(done) {
      request.get('/api/patient/24').expect(200, carer24);
      request.get('/api/patient/2405').expect(200, carer2405);
      done();
    });

    it('GET status 404 for invalid carer', function(done) {
      request.get('/api/carer/007').expect(404);
      done();
    });

    it('PUT for valid carer', function(done) {
      var update = { email: 'newemail@dems.com' };
      var updatedCarer24 = carer24;
      updatedCarer24.email = 'newemail@dems.com';

      request.put('/api/carer/24').expect(200, updatedCarer24);
      done();
    });

    it('PUT 404 for invalid carer', function(done) {
      request.put('/api/carer/007').expect(404);
      done();
    });

    it('POST a new carer', function(done) {
     var newCarer = { id: 7, token: 'licensetokill', email: 'agent007@MI6.gov.uk', name: 'James Bond' };

     request.post('/api/carer').send(newCarer).expect(200, newCarer);
     request.put('/api/carer/7').expect(200, newCarer);
      done();
    });

    it('DELETE a valid carer', function(done) {
      request.delete('/api/carer/2405').expect(200);
      request.get('/api/carer/2405').expect(404);
      done();
    });


  });

});
