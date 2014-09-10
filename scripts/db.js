/*******************************************************************************************************************
 * HOW TO USE
 *******************************************************************************************************************
 * Make sure you are in the directory of the project (cd into it if you are not)
 * Make sure you have a mongo server running (otherwise open a new tab and type mongod)
 * Move back to the first tab if you moved to another
 * mongo - Start the mongo client
 * use dems - Tell mongo client to use dems db
 * load("scripts/db.js") - Loads this file
 * dropDB() will clear the Patient, Location and Fence table
 * loadDB() will load the database with some dummy data to use
 *  - 10 patients
 *  - 100 locations each
 *  - 6 fences each
 *  - 10 reminders each
 *  - Relationships are made with carer but every 3rd patient
 *******************************************************************************************************************/


function loadDB() {
  /***********************/
  /* Variables           */
  /***********************/


  var // Your carer - For later use when we want to link patients to ourself (carers)
      carer = db.getCollection("Carer").find()[0],

      // Reference to the patient table
      patientTable = db.getCollection("Patient"),

      // Reference to the location table
      locationTable = db.getCollection("Location"),

      // Reference to the fence table
      fenceTable = db.getCollection("Fence"),

      // Reference to the reminders table
      reminderTable = db.getCollection("Reminder"),

      // An arbitrary location to start with
      startingLocation = [-27.474911, 153.027188],

      // An arbitrary fence to start with
      startingFence = [[-27.474911, 153.027188],
                      [-27.477143, 153.029623],
                      [-27.477276, 153.030299],
                      [-27.478776, 153.029049],
                      [-27.478414, 153.027665],
                      [-27.477219, 153.026759],
                      [-27.475882, 153.026206]],

      // Constant of minutes per interval for location tracking
      minutesPerInterval = 1,

      // Constant of days per interval for reminders
      daysPerInterval = 1,

      // the current time used in location calculations
      timeNow = Date.now(),

      // multiplier for location movement
      locationIncrement = 0.003,

      // multiplier for fence movement
      fenceIncrement = 0.05,

      patient_names = [
        "Joe Blogs",
        "Regina Phalange",
        "Hugh Jass",
        "Seymour Butts",
        "Holden McGroin",
        "Yolo Pepperoni",
        "Ice Cube",
        "Jesse Phoenix",
        "Ferrari Montenegro",
        "Ken Adams",
      ],

      numLocations = 100,

      numFences = 6,

      numReminders = 10,

      patientIds = [];

  if (!carer) {
    return "This wont work if you don't have a carer in the db. Sign in first";
  }

  /***********************/
  /* Patient Creation    */
  /***********************/

  for (var i = 0, patientLength = patient_names.length; i < patientLength; i++) {
    var patient = {
      _id      : i + 1,
      token    :"token" + patient_names[i].replace(/ /g, ''),
      email    : patient_names[i].toLowerCase().replace(/ /g, '_')  + "@fake.com",
      name     : patient_names[i],
    };

    // don't add every third one to the carer
    if((i+1) % 3 != 0) {
      patient.carer_id = carer._id;
      patientIds.push(patient._id);
    }

    patientTable.insert(patient);

    /***********************/
    /* Location Creation   */
    /***********************/

    // Starting location
    var longitude = startingLocation[1],
        latitude = startingLocation[0];

    for(var j = 0; j < numLocations; j++) {
      var location = {
        longitude  : longitude,
        latitude   : latitude,
        timestamp  :  timeNow - ((numLocations - 1 - j) * minutesPerInterval * 60000),
        patient_id : patient._id
      };
      locationTable.insert(location);

      // move the patient around a bit
      var incrementLocationLong = Math.random() * locationIncrement;
      var incrementLocationLat = Math.random() * locationIncrement;

      incrementLocationLong *= Math.random() > 0.5 ? 1 : -1;
      incrementLocationLat *= Math.random() > 0.5 ? 1 : -1;

      longitude += incrementLocationLong;
      latitude += incrementLocationLat;
    }

    /***********************/
    /* Fence Creation      */
    /***********************/

    // concat() is used for passing the array by value instead of reference
    var polygon = startingFence.concat();

    for(var k = 0; k < numFences; k++) {
      var names = patient.name.split(' ');
      var initials = names[0] && names[1] ? names[0].charAt(0) + " " + names[1].charAt(0) : "Test";
      var fence = {
        polygon    : polygon,
        name       : initials  + " Fence " + (k+1),
        patient_id : patient._id,
        notifyCarer: Math.random() > 0.5,
      };

      fenceTable.insert(fence);

      // move the fence around
      var incrementFenceLong = Math.random() * fenceIncrement;
      var incrementFenceLat = Math.random() * fenceIncrement;

      incrementFenceLong *= Math.random() > 0.5 ? 1 : -1;
      incrementFenceLat *= Math.random() > 0.5 ? 1 : -1;

      for (var f = 0, length = polygon.length; f < length; f++) {
        polygon[f] = [polygon[f][0] + incrementFenceLat, polygon[f][1] + incrementFenceLong];
      }
    }

    /***********************/
    /* Reminder Creation   */
    /***********************/

    for(var m = 0; m < numReminders; m++) {
      var reminder = {
        name: patient.name + " Reminder " + (m + 1),
        time: new Date(timeNow + m * daysPerInterval * 24 * 60 * 60000),
        message: "Remember to take your medicine",
        type: "Medicine Reminder",
        createdAt: timeNow,
        patient_id: patient._id
      };

      reminderTable.insert(reminder);
    }
  }

  // set the carer patientIds
  db.getCollection("Carer").update(
    {_id: carer._id},
    {
      $set: {
        patientsIds: patientIds
      }
    }
  );
}

function dropDB() {
  var patientTable = db.getCollection("Patient"),
      locationTable = db.getCollection("Location"),
      fenceTable = db.getCollection("Fence"),
      reminderTable = db.getCollection("Reminder");

  // Drop the tables
  patientTable.drop();
  locationTable.drop();
  fenceTable.drop();
  reminderTable.drop();
}
