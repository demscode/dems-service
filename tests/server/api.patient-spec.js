describe('DemS API /patient', function() {
  var settings = require('../../dems.conf.json'),
      patientModel = require('../../models/patient.js').init(settings.db.mongoTest);


  beforeEach(function() {
       patientModel.create( { id: 22, token: "firstkey", email: "someone@something.com", name: "Generic Bob", latitude: -27.4771, longitude: 153.0280 } );

    patientModel.create( {id: 8889, token: "myticket", email: "janedoe@gmail.com", name: "Jane", latitude: -35.8823, longitude: 160.2221 } );

  });

  afterEach(function(done) {
    patientModel.destroyAll(function(data) {
      patientModel.count(function(err, count) {
        expect(count).toBe(0);
        done();
      });
    });
  });

  it('should be true', function () {
    expect(true).toBe(true);
  });

});
