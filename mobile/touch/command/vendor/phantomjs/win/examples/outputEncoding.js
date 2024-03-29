(function() {
  var enc, helloWorld, _fn, _i, _len, _ref;

  helloWorld = function() {
    return console.log(phantom.outputEncoding + ": こんにちは、世界！");
  };

  console.log("Using default encoding...");

  helloWorld();

  console.log("\nUsing other encodings...");

  _ref = ["euc-jp", "sjis", "utf8", "System"];
  _fn = function(enc) {
    phantom.outputEncoding = enc;
    return helloWorld();
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    enc = _ref[_i];
    _fn(enc);
  }

  phantom.exit();

}).call(this);
