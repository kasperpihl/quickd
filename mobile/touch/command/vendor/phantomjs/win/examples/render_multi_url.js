(function() {
  var arrayOfUrls, renderUrlToFile;

  Array.prototype.forEach = function(action) {
    var i, j, _len, _results;
    _results = [];
    for (j = 0, _len = this.length; j < _len; j++) {
      i = this[j];
      _results.push(action(j, i, _len));
    }
    return _results;
  };

  renderUrlToFile = function(url, file, callback) {
    var page;
    page = require('webpage').create();
    page.viewportSize = {
      width: 800,
      height: 600
    };
    page.settings.userAgent = 'Phantom.js bot';
    return page.open(url, function(status) {
      if (status !== 'success') {
        console.log("Unable to render '" + url + "'");
      } else {
        page.render(file);
      }
      delete page;
      return callback(url, file);
    });
  };

  if (phantom.args.length > 0) {
    arrayOfUrls = phantom.args;
  } else {
    console.log('Usage: phantomjs render_multi_url.coffee [domain.name1, domain.name2, ...]');
    arrayOfUrls = ['www.google.com', 'www.bbc.co.uk', 'www.phantomjs.org'];
  }

  arrayOfUrls.forEach(function(pos, url, total) {
    var file_name;
    file_name = "./" + url + ".png";
    return renderUrlToFile("http://" + url, file_name, function(url, file) {
      console.log("Rendered '" + url + "' at '" + file + "'");
      if (pos === total - 1) return phantom.exit();
    });
  });

}).call(this);
