(function() {
  function Alerts(){}
  Alerts.prototype.addAlert = function (msg, options) {
    if(options === undefined) options = {};
    if(options.alert_type === undefined) options.alert_type = "success";
    if(options.remove === undefined) options.remove = true;
    if(options.timeout === undefined) options.timeout = 5000;
    if(options.placement === undefined) options.placement = "after";

    var alerts_area = $("div#alerts")[0];

    var alert = '<div class="alert alert-' + options.alert_type + '">'  +
                  msg + '<a class="close" data-dismiss="alert">×</a>' +
                '</div>';
    alert = $.parseHTML(alert);

    if(options.placement == "before") {
      $(alerts_area).prepend(alert);
    } else {
      $(alerts_area).append(alert);
    }

    if(options.remove) {
      window.setTimeout(function() {
        $(alert).fadeTo(500, 0).slideUp(500, function() {
            $(alert).remove();
        });
      }, options.timeout);
    }
  };
  angular.module('DemS').service('Alerts', Alerts);
})();