/**
 * RESTful API endpoints pertaining to a patient.
 */

(function(exports) {

  exports.init = function(app, models) {

    // Patient GET API
    app.get('/api/patient/:id', function(req, res) {
      var patientModel = models.patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(404).end();
        }
      });

    });

    // Patient UPDATE API
    app.put('/api/patient/:id', function(req, res) {
      var patientModel = models.patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.updateAttributes(req.body, function(err, data) {
            res.status(200).send(data);
          });
        } else {
          res.status(404).end();
        }
      });
    });

    // Patient CREATE API
    app.post('/api/patient', function(req, res) {
      var patientModel = models.patient;

      patientModel.create(req.body, function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(400).end();
        }
      });
    });

    // Patient DELETE API
    app.delete('/api/patient/:id', function(req, res) {
      var patientModel = models.patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.destroy();
          res.status(200).end();
        } else {
          res.status(404).end();
        }
      });
    });

    // Location GET API
    app.get('/api/patient/:id/locations', function(req, res) {
      var patientModel = models.patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.locations(function(err, locations) {
            res.status(200).send(locations);
          });
        } else {
          res.status(404).end();
        }
      });
    });

    // Location CREATE API
    app.post('/api/patient/:id/locations', function(req, res) {
      var patientModel = models.patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.locations.create(req.body, function(err, locations) {
            res.status(200).send(locations);
          });
        } else {
          res.status(404).end();
        }
      });
    });

  };

})(exports);
