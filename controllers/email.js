(function (exports) {
  'use strict';

  var EmailSettings = {};
  if (process.env.EMAIL_AUTH) {
    EmailSettings.user = process.env.EMAIL_USER;
    EmailSettings.password = process.env.EMAIL_PASS;
    EmailSettings.host = process.env.EMAIL_HOST;
    EmailSettings.ssl = process.env.EMAIL_SSL;
    EmailSettings.port = process.env.EMAIL_PORT;
  } else {
    EmailSettings = require('../dems.conf.json').email;
  }

  exports.init = function(email) {

    var server = email.server.connect(EmailSettings);

    var sendEmail = function(recipient, subject, message) {
      var mail = {
        text: message,
        from: EmailSettings.user,
        to: recipient,
        subject: subject
      };

      server.send(mail, function(err, message) {
        if (err) {
          throw err;
        }
      });
    };

    return sendEmail;

  };

})(exports);
