/**
 * DemS
 */
 (function() {

  /***********************************/
  /* TESTING DATA                    */
  /***********************************/

  // Temp demoing data
  var test_patients = {
    "123" : {
      id: "123",
      first_name: "Frankie",
      last_name: "Ferraioli",
      contact_number: "0477 881 223",
      last_location: "Bedroom",
      logs: [
      {
        id: "1",
        log_info1: "hello",
        log_info2: "sup",
        log_info3: "YOO",
      },
      {
        id: "2",
        log_info1: "HAHAH",
        log_info2: "Oh Yeah",
        log_info3: "LOLOLOL",
      },
      ],
    },
    "124": {
      id: "124",
      first_name: "Harley",
      last_name: "Jonelynas",
      contact_number: "0423 123 433",
      last_location: "Living Room",
      logs: [
      {
        id: "3",
        log_info1: "test",
        log_info2: "great",
        log_info3: "it work",
      },
      {
        id: "4",
        log_info1: "ohhhhhh",
        log_info2: "i rule",
        log_info3: "hehehe",
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

  /***********************************/
  /* ANGULAR APP                     */
  /***********************************/

  var app = angular.module('DemS', ['ngRoute']);

  app.directive("frontPage", function() {
    return {
      restrict: 'E',
      templateUrl: "partials/front-page"
    };
  });
})();
