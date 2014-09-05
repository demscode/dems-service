/**
 * RESTful API routes used by client apps, serving json.
 */

(function(exports) {
  "use strict";

  /**
   * Intialises declared API routes.
   */
  exports.init = function(app) {

    var Models = require('../models');

    require('./api/patient.js').init(app, Models);
    require('./api/carer.js').init(app, Models);

    app.get('/api/test/patients', function (req, res) {
      var patients = {
        "123" : {
          id: "123",
          first_name: "Frankie",
          last_name: "Ferraioli",
          contact_number: "0477 881 223",
          last_location: "Bedroom",
          activities: [
          {
            id: "1",
            activity_info1: "hello",
            activity_info2: "sup",
            activity_info3: "YOO",
          },
          {
            id: "2",
            activity_info1: "HAHAH",
            activity_info2: "Oh Yeah",
            activity_info3: "LOLOLOL",
          },
          ],
        },
        "124": {
          id: "124",
          first_name: "Harley",
          last_name: "Jonelynas",
          contact_number: "0423 123 433",
          last_location: "Living Room",
          activities: [
          {
            id: "3",
            activity_info1: "test",
            activity_info2: "great",
            activity_info3: "it work",
          },
          {
            id: "4",
            activity_info1: "ohhhhhh",
            activity_info2: "i rule",
            activity_info3: "hehehe",
          },
          ],
        },
        "125": {
          id: "125",
          first_name: "Lochlan",
          last_name: "Bunn",
          contact_number: "0444 786 177",
          last_location: "Computer Room",
        },
      };

      res.json(patients);
    });

  }; // end init

})(exports);
