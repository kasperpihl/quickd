(function() {
  var arg, i, _len, _ref;

  if (phantom.args.length === 0) {
    console.log('Try to pass some args when invoking this script!');
  } else {
    _ref = phantom.args;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      arg = _ref[i];
      console.log(i + ': ' + arg);
    }
  }

  phantom.exit();

}).call(this);
