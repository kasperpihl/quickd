(function() {
  var page, waitFor;

  waitFor = function(testFx, onReady, timeOutMillis) {
    var condition, f, interval, start;
    if (timeOutMillis == null) timeOutMillis = 3000;
    start = new Date().getTime();
    condition = false;
    f = function() {
      if ((new Date().getTime() - start < timeOutMillis) && !condition) {
        return condition = (typeof testFx === 'string' ? eval(testFx) : testFx());
      } else {
        if (!condition) {
          console.log("'waitFor()' timeout");
          return phantom.exit(1);
        } else {
          console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
          if (typeof onReady === 'string') {
            eval(onReady);
          } else {
            onReady();
          }
          return clearInterval(interval);
        }
      }
    };
    return interval = setInterval(f, 250);
  };

  page = require('webpage').create();

  page.open('http://twitter.com/#!/sencha', function(status) {
    if (status !== 'success') {
      return console.log('Unable to access network');
    } else {
      return waitFor(function() {
        return page.evaluate(function() {
          return $('#signin-dropdown').is(':visible');
        });
      }, function() {
        console.log('The sign-in dialog should be visible now.');
        return phantom.exit();
      });
    }
  });

}).call(this);
