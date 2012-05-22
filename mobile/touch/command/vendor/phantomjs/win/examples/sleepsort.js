
/*
Sort integers from the command line in a very ridiculous way: leveraging timeouts :P
*/

(function() {
  var int, sortedCount, _i, _len, _ref;

  if (phantom.args < 1) {
    console.log("Usage: phantomjs sleepsort.js PUT YOUR INTEGERS HERE SEPARATED BY SPACES");
    phantom.exit();
  } else {
    sortedCount = 0;
    _ref = phantom.args;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      int = _ref[_i];
      setTimeout((function(j) {
        return function() {
          console.log(j);
          ++sortedCount;
          if (sortedCount === phantom.args.length) return phantom.exit();
        };
      })(int), int);
    }
  }

}).call(this);
