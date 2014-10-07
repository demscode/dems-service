/**
 * RESTFUL API routes realting to the Patient Model
 */

(function(exports) {
  'use strict';

  exports.init = function(app, geolib, sendMail, models) {

    var datefmts = require('date-format');
    var patientModel = models.patient;
    var reminderModel = models.reminder;
    var carerModel = models.carer;

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
        {where: {carer_id:(req.query.id)},
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
      patientModel.find((req.params.id), function(err, data) {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(404).end();
        }
      });

    });

    // Patient UPDATE API
    app.put('/api/patient/:id', function(req, res) {
      patientModel.find((req.params.id), function(err, data) {
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

      patientModel.find((req.params.id), function(err, data) {
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
      patientModel.find((req.params.id), function(err, data) {
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
      patientModel.find((req.params.id), function(err, data) {
        if (data) {
          req.body.patient_id = data._id;

          // Check if the patient is inside his fences
          patientModel.find((req.params.id), function(err, data) {
            if (data) {
              data.fences(function(err, fences) {
                var outsideAll = true;
                var outsideAllInner = true;
                if(fences) {
                  for (var i = 0, length = fences.length; i < length; i++) {
                    var fence = fences[i];
                    var polygonArrObj = [];

                    // turn polygon array into an array of objects
                    for (var j = 0, polygonLength = fence.polygon.length; j < polygonLength; j++) {
                      polygonArrObj.push({latitude: fence.polygon[j][0], longitude: fence.polygon[j][1]});
                    }

                    // check if inside
                    if(geolib.isPointInside(
                      {latitude: req.body.latitude, longitude: req.body.longitude},
                      polygonArrObj)) {

                      outsideAll = false;

                      if (!fence.notifyCarer) {
                        outsideAllInner = false;
                      }
                    }
                  }
                }

                if(outsideAllInner) {
                  // Send push notification to phone as they are outside a fence
                  //console.log("OUTSIDE ALL INNER FENCES - ALERT THE PATIENT");
                  //perhaps set a variable here, and attach it to the json returned

                  if(outsideAll) {
                    // Send an email to the carer as they are outside an outer (carer notify) fence
                    //console.log("OUTSIDE ALL - ALERT THE CARER");
                    if (!data.last_outside) {
                      carerModel.find(data.carer_id, function(err, carer) {
                        if (carer) {
                          var recipient = carer.email;
                          var subject = "Fence Notification - " + data.name;
                          var message = data.name + " is outside the virtual fences set for them.\n" +
                                    "Location: " + req.body.latitude + ", " + req.body.longitude +
                                    "\nTime: " + datefmts.asString('dd/MM/yyyy hh:mm', new Date());

                          sendMail(recipient, subject, message);
                          data.updateAttribute('last_outside', true);
                        }
                      });
                    }

                  }
                }

                if (!outsideAll || !outsideAllInner) {
                  data.updateAttribute('last_outside', false);
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
      patientModel.find((req.params.id), function(err, data) {
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
      patientModel.find((req.params.id), function(err, data) {
        if (data) {
          req.body.patient_id = data._id;
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
      patientModel.find((req.params.id), function(err, data) {
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
      patientModel.find((req.params.id), function(err, data) {
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
      patientModel.find((req.params.id), function(err, data) {
        if (data) {
          data.reminders(function(err, reminders) {
            res.status(200).send(reminders);
          });
        } else {
          res.status(404).end();
        }
      });
    });

    //Reminder CREATE API
    app.post('/api/patient/:id/reminder', function(req, res) {
      patientModel.find((req.params.id), function(err, patient) {
        if (patient) {
          req.body.patient_id = patient._id;
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
      patientModel.find((req.params.id), function(err, patient) {
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
      patientModel.find((req.params.id), function(err, patient) {
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

    //Get Patients Activities API
    app.get('/api/patient/:id/activity', function(req, res) {
      patientModel.find((req.params.id), function(err, data) {
        if (data) {
          data.activities(function(err, activities) {
            res.status(200).send(activities);
          });
        } else {
          res.status(404).end();
        }
      });
    });

    //Activity CREATE API
    app.post('/api/patient/:id/activity', function(req, res) {
      patientModel.find((req.params.id), function(err, patient) {
        if (patient) {
          req.body.patient_id = patient._id;
          patient.activities.create(req.body, function(err, activity) {
            res.status(200).send(activity);
          });
        } else {
          res.status(404).end();
        }
      });

    });

    //Activity UPDATE API
    app.put('/api/patient/:id/activity/:activityId', function(req, res) {
      patientModel.find((req.params.id), function(err, patient) {
        if (patient) {
          patient.activities.find(req.params.activityId, function(err, activity) {
            if(activity) {
              activity.updateAttributes(req.body, function(){
                res.status(200).send(activity);
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

    //Activity DELETE API
    app.delete('/api/patient/:id/activity/:activityId', function(req, res) {
      patientModel.find((req.params.id), function(err, patient) {
        if (patient) {
          patient.activities.find(req.params.activityId, function(err, activity) {
            if(activity) {
              activity.destroy();
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

    // Get patient details by Google ID
    app.get('/api/patient/google/:googleID', function(req, res) {
      patientModel.all({where : {'gid' : req.params.googleID}}, function(err, data) {
        if (data[0]) {
         res.status(200).send(data[0]);
        } else {
          res.status(404).end();
        }

      });
    });



   // Set off the panic status of a patient
    app.post('/api/patient/:id/panic', function(req, res) {
     patientModel.find(req.params.id, function(err, data) {
        if (data.carer_id) {
          carerModel.find(data.carer_id, function(err, carer) {
            if (carer) {
              var recipient = carer.email;
              var subject = "Panic! - " + data.name;
              var message = data.name + " has pushed the panic button.\n" +
                            "Location: " + req.body.latitude + ", " + req.body.longitude +
                            "\nTime: " + datefmts.asString('dd/MM/yyyy hh:mm', new Date());

              sendMail(recipient, subject, message);
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

  // Get contact details of carer
  app.get('/api/patient/:id/contact', function(req, res) {
    patientModel.find(req.params.id, function(err, data) {
      if (data.carer_id) {
        carerModel.find(data.carer_id, function(err, carer) {
          if (carer) {
            var contact = { name: carer.name,
                            email: carer.email,
                            contact_number: carer.contact_number };

            res.status(200).send(contact);
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
