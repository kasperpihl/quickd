(function() {
  var address, page;

  page = require('webpage').create();

  address = phantom.args[0];

  if (phantom.args.length === 0) {
    console.log('Usage: netlog.coffee <some URL>');
    phantom.exit();
  } else {
    page.onResourceRequested = function(req) {
      return console.log('requested ' + JSON.stringify(req, void 0, 4));
    };
    page.onResourceReceived = function(res) {
      return console.log('received ' + JSON.stringify(res, void 0, 4));
    };
    page.open(address, function(status) {
      if (status !== 'success') console.log('FAIL to load the address');
      return phantom.exit();
    });
  }

}).call(this);
