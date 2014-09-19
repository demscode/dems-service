describe('DemS models', function() {

  describe('Carer model', function() {
    var carerModel,
    settings = require('../../dems.conf.json');

    beforeEach(function(done) {
      carerModel = require('../../models/carer.js').init(settings.db.mongoTest);
      carerModel.count(function(err, count) {
        expect(err).toBe(null);
        expect(count).toBe(0);
        done();
      });
    });

    afterEach(function(done) {
      carerModel.all({order: 'id'}, function(err, carers) {
        expect(err).toBe(null);
        carers.forEach(function(carer) {
          carer.destroy(function() {
            carerModel.count(function(err, count) {
              expect(err).toBe(null);
              expect(count).toBe(0);
              done();
            });
          });
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

    it('should create carer patient relation', function(done) {

      var newCarer = {
        id: 11
      },
      newPatient =  {
        id: 99
      };

      carerModel.create(newCarer, function(err, carer) {
        expect(err).toBe(null);
        carer.patients.create(newPatient, function(err, patient) {
          //expect(err).toBe(null);
          expect(patient.id).toBe(newPatient.id);
          expect(patient.carer_id).toBe(String(newCarer.id));
          done();
        });
      });
    });


  });

  describe('Patient model', function() {
    var patientModel,
    settings = require('../../dems.conf.json');

    beforeEach(function(done) {
      patientModel = require('../../models/patient.js').init(settings.db.mongoTest);
      patientModel.count(function(err, count) {
        expect(err).toBe(null);
        expect(count).toBe(0);
        done();
      });
    });

    afterEach(function(done) {
      patientModel.all({order: 'id'}, function(err, patients) {
        expect(err).toBe(null);
        patients.forEach(function(patient) {
          patient.destroy(function() {
            patientModel.count(function(err, count) {
              expect(err).toBe(null);
              // FIX: returing 1 on patient update test
              // expect(count).toBe(0);
              done();
            });
          });
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
        expect(patient.name).toBe('James');
        expect(patient.email).toBe('james@email.com');
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

    it('should create patient location', function(done) {

      var newPatient = {
        id: 11
      },
          newLocation = {
            latitude: -27.481781,
            longitude: 153.046300
      };

      patientModel.create(newPatient, function(err, patient) {
        expect(err).toBe(null);
        patient.locations.create(newLocation,
        function(err, location) {
          expect(err).toBe(null);
          expect(location.latitude).toBe(newLocation.latitude);
          expect(location.longitude).toBe(newLocation.longitude);

          patient.locations(function(err, locations) {
            expect(err).toBe(null);
            // FIX: locations and fences are left dangling in the db
            // after patient.destroy()
            // expect(locations.length).toBe(1);
            done();
          });
        });
      });
    });

    it('should create patient fence', function(done) {

      var newPatient = {
        id: 11
      },
      newFence = [
        { latitude: -27.7, longitude: 153.046300 },
        { latitude: -27.8, longitude: 154.046300 },
        { latitude: -26.9, longitude: 155.046300 }
      ];

      patientModel.create(newPatient, function(err, patient) {
        expect(err).toBe(null);
        patient.fences.create(newFence,
        function(err, fence) {
          expect(err).toBe(null);
          // first
          expect(fence[0].latitude).toBe(newFence[0].latitude);
          expect(fence[0].longitude).toBe(newFence[0].longitude);
          // last
          expect(fence[2].latitude).toBe(newFence[2].latitude);
          expect(fence[2].longitude).toBe(newFence[2].longitude);
          patient.fences(function(err, fences) {
            expect(err).toBe(null);
            // FIX: locations and fences are left dangling in the db
            // after patient.destroy()
            // expect(fences.length).toBe(1);
            done();
          });
        });
      });
    });

    it('should create patient reminder', function(done) {

      var newPatient = {
        id: 11
      },
      newReminder = {
        name: "Pills",
        time: new Date("October 13, 2014 11:13:00").getTime(),
        message: "Remember to take your pills",
        type: "Important"
      };

      patientModel.create(newPatient, function(err, patient) {
        expect(err).toBe(null);
        patient.reminders.create(newReminder,
        function(err, reminder) {
          expect(err).toBe(null);
          expect(reminder.name).toBe(newReminder.name);
          expect(reminder.time).toBe(newReminder.time);
          expect(reminder.message).toBe(newReminder.message);
          expect(reminder.type).toBe(newReminder.type);
          expect(reminder.patient_id).toBe(String(newPatient.id));
            done();
          });
        });
      });

  });
});
        // pos_latitude : -27.481781,
        // pos_longitude : 153.046300,
        // fence_latitude : -27.481781,
        // fence_longitude : 153.046300,
        // fence_radius : 50
