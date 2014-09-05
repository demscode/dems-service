/*******************************************************************************************************************
 * HOW TO USE
 *******************************************************************************************************************
 * Make sure you are in the directory of the project (cd into it if you are not)
 * Make sure you have a mongo server running (otherwise open a new tab and type mongod)
 * Move back to the first tab if you moved to another
 * mongo - Start the mongo client
 * use dems - Tell mongo client to use dems db (not necessary to run this script, just for later use if needed)
 * load("script-db.js") - Loads this file
 * dropDB() will clear the Patient, Location and Fence table
 * loadDB() will load the database with some dummy data to use
 *  - 10 patients
 *  - 100 locations each
 *  - 3 fences each
 *******************************************************************************************************************/


function loadDB() {
  /***********************/
  /* Variables           */
  /***********************/

      // Your carer ID - For later use when we want to link patients to ourself (carers)
  // var carerId = db.getSiblingDB("dems").getCollection("Carer").find()[0].id;

      // Reference to the patient table
  var patientTable = db.getSiblingDB("dems").getCollection("Patient"),

      // Reference to the location table
      locationTable = db.getSiblingDB("dems").getCollection("Location"),

      // Reference to the fence table
      fenceTable = db.getSiblingDB("dems").getCollection("Fence"),

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
      minutesPerInterval = 1;

      timeNow = Date.now();

  /***********************/
  /* Patient Creation    */
  /***********************/

  for (var i = 1; i < 11; i++) {
    var patient = {
      _id   : i,
      token :"token" + i,
      email : "patient_name_" + i + "@yo.com",
      name  : "Patient Name " + i,
    };

    patientTable.insert(patient);

    /***********************/
    /* Location Creation   */
    /***********************/

    // Starting location
    var longitude = startingLocation[1],
        latitude = startingLocation[0];

    for(var j = 0; j < 100; j++) {
      var location = {
        longitude: longitude,
        latitude: latitude,
        timestamp:  timeNow - (j * minutesPerInterval * 60000),
        patient_id: i
      };
      locationTable.insert(location);

      // move the patient around a bit
      longitude = Math.random() > 0.5 ? longitude + Math.random() * 0.01 : longitude - Math.random() * 0.01;
      latitude = Math.random() < 0.5 ? latitude + Math.random() * 0.01 : latitude - Math.random() * 0.01;
    }

    /***********************/
    /* Fence Creation      */
    /***********************/

    var polygon = startingFence;

    for(var k = 0; k < 3; k++) {
      var fence = {
        polygon: polygon,
        patient_id: i
      };

      fenceTable.insert(fence);

      // move the fence around
      var incrementFenceLong = Math.random() * 0.1;
      var incrementFenceLat = Math.random() * 0.1;

      incrementFenceLong *= Math.random() > 0.5 ? 1 : -1;
      incrementFenceLat *= Math.random() > 0.5 ? 1 : -1;

      for (var f = 0, length = polygon.length; f < length; f++) {
        polygon[f] = [polygon[f][0] + incrementFenceLat, polygon[f][1] + incrementFenceLong];
      }
    }
  }
}

function dropDB() {
  var patientTable = db.getSiblingDB("dems").getCollection("Patient"),
      locationTable = db.getSiblingDB("dems").getCollection("Location"),
      fenceTable = db.getSiblingDB("dems").getCollection("Fence");

  // Drop the tables
  patientTable.drop();
  locationTable.drop();
  fenceTable.drop();
}
