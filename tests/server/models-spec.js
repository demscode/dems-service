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
          expect(err).toBe(null);
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
        email : 'james@email.com',
        pos_latitude : -27.481781,
        pos_longitude : 153.046300,
        fence_latitude : -27.481781,
        fence_longitude : 153.046300,
        fence_radius : 50
      };

      patientModel.create(newPatient, function(err, patient) {
        expect(err).toBe(null);
        expect(patient.id).toBe(11);
        expect(patient.name).toBe('James');
        expect(patient.email).toBe('james@email.com');
        expect(patient.pos_latitude).toBe(-27.481781);
        expect(patient.pos_longitude).toBe(153.046300);
        expect(patient.fence_latitude).toBe(-27.481781);
        expect(patient.fence_longitude).toBe(153.046300);
        expect(patient.fence_radius).toBe(50);
        done();
      });
    });
    
    it('should update patient', function(done) {

      var newPatient = {
        id : 11,
        name : 'James',
      };

      patientModel.create(newPatient, function(err, patient) {
        expect(err).toBe(null);
        expect(patient.id).toBe(11);
        expect(patient.name).toBe('James');

        patientModel.afterUpdate = function() {
          patientModel.find(newPatient.id,function(err, patient) {
            expect(err).toBe(null);
            expect(patient.id).toBe(11);
            expect(patient.name).toBe('Martin');
            done();
          });
        };
        
        patientModel.find(newPatient.id,function(err, patient) {
          patient.updateAttributes({name:'Martin'});
        });
      });      
    });
    
    it('should destroy patient', function(done) {

      var newPatient = {
        id : 11
      };

      patientModel.create(newPatient, function(err, patient) {
        expect(err).toBe(null);
        expect(patient.id).toBe(11);
        
        patientModel.count(function(err, count) {
          expect(count).toBe(1);
        });
        
        patientModel.afterDestroy = function() {
          patientModel.count(function(err, count) {
            expect(count).toBe(0);
            done();
          });
        };
        patientModel.find(newPatient.id,function(err, patient) {
          patient.destroy(function(err) {
            expect(err).toBe(null);
          });
        });
      });
      
    });
  });
});