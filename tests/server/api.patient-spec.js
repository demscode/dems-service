describe('DemS API /patient', function() {
  var settings = require('../../dems.conf.json'),
      model = require('../../models/patient').init(settings.db.mongo),
      request = require('supertest');
      request = request('http://localhost:3000');

  var patient22 = { id: 22, token: "firstkey", email: "someone@something.com", name: "Generic Bob", gid: "22g" },
      patient8889 = {id: 8889, token: "myticket", email: "janedoe@gmail.com", name: "Jane", gid: "8889g" };


  describe('Patient Details', function() {

    beforeEach(function(done) {
      model.create(patient22);
      model.create(patient8889);
      done();
    });

    afterEach(function(done) {
      model.destroyAll(function(data) {
        model.count(function(err, count) {
          //expect(count).toBe(0);
          done();
        });
      });
    });

    it('GET valid patients', function(done) {
      request.get('/api/patient/22').expect(200, patient22);
      request.get('/api/patient/8889').expect(200, patient8889);
      done();
    });

    it('GET status 404 for invalid patient', function(done) {
      request.get('/api/patient/007').expect(404);
      done();
    });

    it('PUT for valid patient', function(done) {
      var update = { email: 'newemail@dems.com' };
      var updatedPatient22 = patient22;
      updatedPatient22.email = 'newemail@dems.com';

      request.put('/api/patient/22').expect(200, updatedPatient22);
      done();
    });

    it('PUT 404 for invalid patient', function(done) {
      var update = { latitude: 55, longitude: 80 };
      request.put('/api/patient/007').expect(404);
      done();
    });

    it('POST a new patient', function(done) {
     var newPatient = { id: 7, token: 'licensetokill', email: 'agent007@MI6.gov.uk', name: 'James Bond' };

     request.post('/api/patient').send(newPatient).expect(200, newPatient);
      done();
    });

    it('DELETE a valid patient', function(done) {
      request.delete('/api/patient/8889').expect(200);
      request.get('/api/patient/8889').expect(404);
      done();
    });

    it('GET patient from valid GoogleID', function(done) {
      request.get('/api/patient/google/22g').expect(200);
      request.get('/api/patient/google/8889g').expect(200);
      done();
    });

    it('GET 404 from invalid GoogleID', function(done) {
      request.get('/api/patient/google/003b').expect(404);
      done();
    });

  });

  describe('Patient Location API', function() {
    var location1p22 = { longitude: 55, latitude: 70, patient_id: 22 },
        location2p22 = { longitude: -78, latitude: 85, patient_id: 22 };

    var location1p8889 = { longitude: -77, latitude: -33, patient_id: 8889 },
        location2p8889 = { longitude: -2, latitude: 5, patient_id: 8889 };

    beforeEach(function(done) {
      model.create(patient22, function(err, data) {
        data.locations.create(location1p22);
        data.locations.create(location2p22);
      });

      model.create(patient8889, function(err, data) {
        data.locations.create(location1p8889);
        data.locations.create(location1p8889);
      });
      done();
    });

    afterEach(function(done) {
      model.destroyAll(function(data) {
        model.count(function(err, count) {
          //expect(count).toBe(0);
          done();
        });
      });
    });

    it('GET a valid patient locations', function(done) {
      request.get('/api/patient/22/locations').expect(200, [location1p22, location2p22]);
      request.get('/api/patient/8889/locations').expect(200, [location1p8889, location2p8889]);
      done();
    });

    it('GET an invalid patient locations', function(done) {
      request.get('/api/patient/9/locations').expect(404);
      done();
    });

    it('POST a valid patient location', function(done) {
      var newLocation = { longitude: 90, latitude: 0, patient_id: 22 };
      request.post('/api/patient/22/locations').send(newLocation).expect(200);
      done();
    });

    it('POST a invalid patient location', function(done) {
      var newLocation = { longitude: 90, latitude: 0, patient_id: 9 };
      request.post('/api/patient/9/locations').send(newLocation).expect(404);
      done();
    });


  });

  describe('Patient Fence API', function() {
    var polygon1 = [[25, 30], [75, 60], [0, 2]],
        polygon2 = [[80, 80], [-20, -20], [50, -50]];

    beforeEach(function(done) {
      model.create(patient22, function(err, data) {
        data.fences.create(polygon1);
      });

      model.create(patient8889);
      done();
    });

    afterEach(function(done) {
      model.destroyAll(function(data) {
        model.count(function(err, count) {
          //expect(count).toBe(0);
          done();
        });
      });
    });

    it('GET a valid patient Fence', function(done) {
      request.get('/api/patient/22/fence').expect(200, polygon1);
      done();
    });

    it('GET an invalid patient Fence', function(done) {
      request.get('/api/patient/3/fence').expect(404);
      done();
    });

    it('POST a valid patient Fence', function(done) {
      request.post('/api/patient/8889/fence').send(polygon2).expect(200, polygon2);
      done();
    });

    it('POST an invalid patient Fence', function(done) {
      request.post('/api/patient/3/fence').send(polygon2).expect(404);
      done();
    });

    it('PUT a valid patient Fence', function(done) {
      request.put('/api/patient/22/fence').send(polygon2).expect(200, polygon2);
      done();
    });

    it('PUT an invalid patient Fence', function(done) {
      request.put('/api/patient/3/fence').send(polygon2).expect(404);
      done();
    });

    it('DELETE a valid patient Fence', function(done) {
      request.delete('/api/patient/22/fence').expect(200);
      done();
    });

    it('DELETE an invalid patient Fence', function(done) {
      request.delete('api/patient/3/fence').expect(404);
      done();
    });

  });

describe('Patient Reminder API', function() {
    var reminder1 = {
        name: "Pills",
        time: new Date("October 13, 2014 11:13:00").getTime(),
        message: "Remember to take your pills",
        type: "Important"
      };

    var reminder2 = {
        name: "Walk",
        time: new Date("October 16, 2015 05:23:00").getTime(),
        message: "Remember to take a walk",
        type: "Less important"
      };

    beforeEach(function(done) {
      model.create(patient22, function(err, patient) {
        patient.reminders.create(reminder1);
      });

      model.create(patient8889);
      done();
    });

    afterEach(function(done) {
      model.destroyAll(function(data) {
        model.count(function(err, count) {
          //expect(count).toBe(0);
          done();
        });
      });
    });

    it('GET a valid patient Reminder', function(done) {
      request.get('/api/patient/22/reminder').expect(200, reminder1);
      done();
    });

    it('GET an invalid patient Reminder', function(done) {
      request.get('/api/patient/3/reminder').expect(404);
      done();
    });

    it('POST a valid patient Reminder', function(done) {
      request.post('/api/patient/8889/reminder').send(reminder2).expect(200, reminder2);
      done();
    });

    it('POST an invalid patient Reminder', function(done) {
      request.post('/api/patient/3/reminder').send(reminder2).expect(404);
      done();
    });

    it('PUT a valid patient Reminder', function(done) {
      request.put('/api/patient/22/reminder').send(reminder2).expect(200, reminder2);
      done();
    });

    it('PUT an invalid patient Reminder', function(done) {
      request.put('/api/patient/3/reminder').send(reminder2).expect(404);
      done();
    });

    it('DELETE a valid patient Reminder', function(done) {
      request.delete('/api/patient/22/reminder').expect(200);
      done();
    });

    it('DELETE an invalid patient Reminder', function(done) {
      request.delete('api/patient/3/reminder').expect(404);
      done();
    });

  });
});
