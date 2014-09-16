/**
 * RESTFUL API routes realting to the Patient Model
 */

(function(exports) {
  'use strict';

  exports.init = function(app, geolib, models) {

    var patientModel = models.patient;
    var reminderModel = models.reminder;

    // Patient GET API
    app.get('/api/allPatients', function(req, res) {
      patientModel.all({},function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(404).end();
        }
      });
    });

    // Patient GET Carers Patients API
    app.get('/api/carersPatients', function(req, res) {
      patientModel.all(
        {where: {carer_id:Number(req.query.id)},
        order:"name"},
        function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(404).end();
        }
      });
    });

    // Patient GET API
    app.get('/api/patient/:id', function(req, res) {
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
      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          req.body.patient_id = Number(req.params.id);

          // Check if the patient is inside his fences
          patientModel.find(Number(req.params.id), function(err, data) {
            if (data) {
              data.fences(function(err, fences) {
                var inside = false;
                if(fences) {
                  for (var i = 0, length = fences.length; i < length; i++) {
                    var fence = fences[i];
                    if (fence.carerNotify) {
                      if(geolib.isPointInside(
                        {latitude: req.body.latitude, longitude: req.body.longitude},
                        fence.polygon)) {
                        inside = true;
                      }
                    }
                  }
                }

                if(!inside) {
                  // send the email and shit
                }
              });
            }
          });

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
      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
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
    app.put('/api/patient/:id/fence/:fid', function(req, res) {
      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.fences.find(req.params.fid, function(err, fences) {
            if(fences) {
              fences.updateAttributes(req.body);
              res.status(200).send(fences);
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
    app.delete('/api/patient/:id/fence/:fid', function(req, res) {
      patientModel.find(Number(req.params.id), function(err, data) {
        if (data) {
          data.fences.find(req.params.fid, function(err, fences) {
            if(fences) {
              fences.destroy();
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

    //Get Patients Reminders API
    app.get('/api/patient/:id/reminder', function(req, res) {
      reminderModel.all({
        where: {
          patient_id:Number(req.params.id)
        }
      },
        function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(404).end();
        }
      });


    });

    //Reminder CREATE API
    app.post('/api/patient/:id/reminder', function(req, res) {
      patientModel.find(Number(req.params.id), function(err, patient) {
        if (patient) {
          req.body.patient_id = Number(req.params.id);
          patient.reminders.create(req.body, function(err, reminder) {
            res.status(200).send(reminder);
          });
        } else {
          res.status(404).end();
        }
      });

    });

    //Reminder UPDATE API
    app.put('/api/patient/:id/reminder/:reminderId', function(req, res) {
      patientModel.find(Number(req.params.id), function(err, patient) {
        if (patient) {
          patient.reminders.find(req.params.reminderId, function(err, reminder) {
            if(reminder) {
              reminder.updateAttributes(req.body, function(){
                res.status(200).send(reminder);
              });
            } else {
              res.status(404).end();
            }
          });
        } else {
          res.status(404).end();
        }
      });

    });

    //Reminder DELETE API
    app.delete('/api/patient/:id/reminder/:reminderId', function(req, res) {
      patientModel.find(Number(req.params.id), function(err, patient) {
        if (patient) {
          patient.reminders.find(req.params.reminderId, function(err, reminder) {
            if(reminder) {
              reminder.destroy();
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

  };

})(exports);
