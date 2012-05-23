(function() {
  var address, page;

  page = require('webpage').create();

  page.onInitialized = function() {
    return page.evaluate(function() {
      var platform, userAgent;
      userAgent = window.navigator.userAgent;
      platform = window.navigator.platform;
      window.navigator = {
        appCodeName: 'Mozilla',
        appName: 'Netscape',
        cookieEnabled: false,
        sniffed: false
      };
      window.navigator.__defineGetter__('userAgent', function() {
        window.navigator.sniffed = true;
        return userAgent;
      });
      return window.navigator.__defineGetter__('platform', function() {
        window.navigator.sniffed = true;
        return platform;
      });
    });
  };

  if (phantom.args.length === 0) {
    console.log('Usage: unsniff.js <some URL>');
    phantom.exit();
  } else {
    address = phantom.args[0];
    console.log('Checking ' + address + '...');
    page.open(address, function(status) {
      if (status !== 'success') {
        return console.log('FAIL to load the address');
      } else {
        return window.setTimeout(function() {
          var sniffed;
          sniffed = page.evaluate(function() {
            return navigator.sniffed;
          });
          if (sniffed) {
            console.log('The page tried to sniff the user agent.');
          } else {
            console.log('The page did not try to sniff the user agent.');
          }
          return phantom.exit();
        }, 1500);
      }
    });
  }

}).call(this);
