describe('DemS models', function() {

  describe('Carer model', function() {
    var carerModel,
        settings = require('../../dems.conf.json');

    beforeEach(function() {
      carerModel = require('../../models/carer.js').init(settings.db.mongoTest);
    });

    afterEach(function(done) {
      carerModel.destroyAll(function(thing) {
        carerModel.count(function(err, count) {
          expect(count).toBe(0);
          done();
        });
      });
    });

    it('should create new carer', function(done) {

      var newCarer = {
        id : 42,
        token : 'cat',
        name : 'Barry',
        email : 'barry@email.com'
      };

      carerModel.create(newCarer, function(err, carer) {
        expect(err).toBe(null);
        expect(carer.id).toBe(42);
        done();
      });

    });

  });
  
describe('Patient model', function() {
    var patientModel, 
        settings = require('../../dems.conf.json');

    beforeEach(function() {
      patientModel = require('../../models/patient.js').init(settings.db.mongoTest);
    });

    afterEach(function(done) {
      patientModel.destroyAll(function(thing) {
        patientModel.count(function(err, count) {
          expect(count).toBe(0);
          done();
        });
      });
    });

    it('should create new patient', function(done) {

      var newPatient = {
        id : 11,
        token : 'fat',
        name : 'James',
        email : 'james@email.com'
      };

      patientModel.create(newPatient, function(err, patient) {
        expect(err).toBe(null);
        expect(patient.id).toBe(11);
        done();
      });

    });

  });

});