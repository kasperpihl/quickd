(function() {
  var page;

  page = require('webpage').create();

  page.onConsoleMessage = function(msg) {
    return console.log(msg);
  };

  page.open("http://www.phantomjs.org", function(status) {
    if (status === "success") {
      return page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
        page.evaluate(function() {
          return console.log("$(\"#intro\").text() -> " + $("#intro").text());
        });
        return phantom.exit();
      });
    }
  });

}).call(this);
