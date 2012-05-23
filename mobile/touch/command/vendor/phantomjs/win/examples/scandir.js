(function() {
  var scanDirectory;

  if (phantom.args.length !== 1) {
    console.log("Usage: phantomjs scandir.js DIRECTORY_TO_SCAN");
    phantom.exit();
  }

  scanDirectory = function(path) {
    var fs;
    fs = require('fs');
    if (fs.exists(path) && fs.isFile(path)) {
      return console.log(path);
    } else if (fs.isDirectory(path)) {
      return fs.list(path).forEach(function(e) {
        if (e !== "." && e !== "..") return scanDirectory(path + "/" + e);
      });
    }
  };

  scanDirectory(phantom.args[0]);

  phantom.exit();

}).call(this);
