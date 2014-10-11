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

      // Reference to the activities table
      activityTable = db.getCollection("Activity"),

      // An arbitrary location to start with
      startingLocation = [-27.474911, 153.027188],

      // An arbitrary outer fence to start with
      startingOuterFence = [ [ -27.474530248854226, 153.02770298413088 ],
                             [ -27.47488475983727, 153.029135060852 ],
                             [ -27.4760007657552, 153.03022381481935 ],
                             [ -27.47761866755047, 153.03012733862306 ],
                             [ -27.478509483685947, 153.02892025396727 ],
                             [ -27.47833785229718, 153.02719293121345 ],
                             [ -27.47676210803827, 153.02602943914792 ],
                             [ -27.47553932704794, 153.02616308465576 ] ],

      // An arbitrary inner fence to start with
      startingInnerFence = [ [ -27.477764254100908, 153.0286892989534 ],
                             [ -27.47781040342794, 153.02748766931472 ],
                             [ -27.476592027193174, 153.02671111902168 ],
                             [ -27.475704773402665, 153.02682913621834 ],
                             [ -27.47522306889365, 153.0277249940293 ],
                             [ -27.475274412493054, 153.0286208518403 ],
                             [ -27.476165131859787, 153.02950061639717 ],
                             [ -27.477059881688213, 153.02954556878979 ] ],

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

      activity_descriptions = [
        "Left an inner fence",
        "Left an outer fence",
        "Pressed the panic button",
        "Accepted a reminder",
        "Tried to call you",
      ],

      numLocations = 100,

      numFences = 6,

      numReminders = 10,

      numActivities = 7,

      patientIds = [];

  if (!carer) {
    return "This wont work if you don't have a carer in the db. Sign in first";
  }

  /***********************/
  /* Patient Creation    */
  /***********************/

  for (var i = 0, patientLength = patient_names.length; i < patientLength; i++) {
    var patient = {
      gid      : String(i + 1),
      token    :"token" + patient_names[i].replace(/ /g, ''),
      email    : patient_names[i].toLowerCase().replace(/ /g, '_')  + "@fake.com",
      name     : patient_names[i],
    };

    // don't add every third one to the carer
    if((i+1) % 3 != 0) {
      patient.carer_id = carer._id.valueOf();
      //patientIds.push(patient._id);
    }

    patientTable.insert(patient);
    patient._id = patientTable.find()[patientTable.count()-1]._id;
    if ((i+1) % 3 != 0) {
      patientIds.push(patient._id.valueOf());
    }

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
    var outerPolygon = startingOuterFence.concat();
    var innerPolygon = startingInnerFence.concat();

    for(var k = 0; k < numFences; k++) {
      var names = patient.name.split(' ');
      var initials = names[0] && names[1] ? names[0].charAt(0) + " " + names[1].charAt(0) : "Test";
      var outerFence = {
        polygon    : outerPolygon,
        name       : initials  + " Outer Fence " + (k+1),
        patient_id : patient._id,
        notifyCarer: true,
      };

      fenceTable.insert(outerFence);

      var innerFence = {
        polygon    : innerPolygon,
        name       : initials  + " Inner Fence " + (k+1),
        patient_id : patient._id,
        notifyCarer: false,
      };

      fenceTable.insert(innerFence);

      // move the fence around
      var incrementFenceLong = Math.random() * fenceIncrement;
      var incrementFenceLat = Math.random() * fenceIncrement;

      incrementFenceLong *= Math.random() > 0.5 ? 1 : -1;
      incrementFenceLat *= Math.random() > 0.5 ? 1 : -1;

      for (var f = 0, length = outerPolygon.length; f < length; f++) {
        outerPolygon[f] = [outerPolygon[f][0] + incrementFenceLat, outerPolygon[f][1] + incrementFenceLong];
      }

      for (var g = 0, length = innerPolygon.length; g < length; g++) {
        innerPolygon[g] = [innerPolygon[g][0] + incrementFenceLat, innerPolygon[g][1] + incrementFenceLong];
      }
    }

    /***********************/
    /* Reminder Creation   */
    /***********************/

    for(var m = 0; m < numReminders; m++) {
      var reminder = {
        name: patient.name + " Reminder " + (m + 1),
        time: new Date(timeNow + m * daysPerInterval * 24 * 60 * 60000).setMinutes(0),
        message: "Remember to take your medicine",
        type: "Medicine Reminder",
        createdAt: timeNow,
        patient_id: patient._id
      };

      reminderTable.insert(reminder);
    }

    /***********************/
    /* Activity Creation   */
    /***********************/

    for(var n = 0; n < numActivities; n++) {
      var randomIndex = parseInt(Math.random()*activity_descriptions.length) % activity_descriptions.length;
      var activity = {
        time: new Date(timeNow + n * daysPerInterval * 24 * 60 * 60000).setMinutes(0),
        description: activity_descriptions[randomIndex],
        type: randomIndex,
        patient_id: patient._id
      };

      activityTable.insert(activity);
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
      reminderTable = db.getCollection("Reminder"),
      activityTable = db.getCollection("Activity");

  // Drop the tables
  patientTable.drop();
  locationTable.drop();
  fenceTable.drop();
  reminderTable.drop();
  activityTable.drop();
}
