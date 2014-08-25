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

});