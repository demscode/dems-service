/**
 * RESTful API routes used by client apps, serving json.
 */

(function(exports) {
  "use strict";

  /**
   * Intialises declared API routes.
   */
  exports.init = function(app) {

    // Patient GET API
    app.get('/api/patient/:id', function(req, res) {
      var patientModel = require('../models').patient;

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
      var patientModel = require('../models').patient;

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

    //Patient CREATE API
    app.post('/api/patient', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.create(req.body, function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(400).end();
        }
      });

    });

    //Patient DELETE API
    app.delete('/api/patient/:id', function(req, res) {
      var patientModel = require('../models').patient;

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
      var patientModel = require('../models').patient;

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
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          req.body.patient_id = Number(req.params.id);
          data.locations.create(req.body, function(err, locations) {
            res.status(200).send(locations);
          });
        } else {
          res.status(404).end();
        }
      });

    });

    // Fence GET API
    app.get('/api/patient/:id/fence', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.fences(function(err, fences) {
            res.status(200).send(fences);
          });
        } else {
          res.status(404).end();
        }
      });

    });

    //Fence CREATE API
    app.post('/api/patient/:id/fence', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          req.body.polygon = JSON.parse(req.body.polygon);
          req.body.patient_id = Number(req.params.id);
          data.fences.create(req.body, function(err, fences) {
            res.status(200).send(fences);
          });
        } else {
          res.status(404).end();
        }
      });

    });


    //Fence UPDATE API
    app.put('/api/patient/:id/fence', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.fences.all(function(err, fences) {
            if(fences) {
              req.body.polygon = JSON.parse(req.body.polygon);
              fences[0].updateAttributes(req.body);
              res.status(200).send(fences[0]);
            } else {
              res.status(404).end();
            }
          });
        } else {
          res.status(404).end();
        }
      });

    });

    //Fence DELETE API
    app.delete('/api/patient/:id/fence', function(req, res) {
      var patientModel = require('../models').patient;

      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.fences.all(function(err, fences) {
            if(fences) {
              fences[0].destroy();
              res.status(200).end();
            } else {
              res.status(404).end();
            }
          });
        } else {
          res.status(404).end();
        }
      });

    });


    // Example api endpoint
    app.get('/api/carer/:thing', function(req, res) {
      switch(req.params.thing) { // given the params are X

        case 'me': // do Y
          res.json({
            name: 'Mary'
          });
          break;

        case 'patients': // or Z
          res.json({
            patients: [
              {
                name: 'Barry',
                location: {
                  lng: -14.87297349,
                  lat: -34.8273648
                }
              }
            ]
          });
          break;
      }
    });

  }; // end init

})(exports);
