(function() {
  var page;

  if (typeof phantom !== "undefined" && phantom !== null) {
    page = require('webpage').create();
    page.onConsoleMessage = function(msg) {
      return console.log(msg);
    };
    page.onAlert = function(msg) {
      return console.log(msg);
    };
    console.log("* Script running in the Phantom context.");
    console.log("* Script will 'inject' itself in a page...");
    page.open("about:blank", function(status) {
      if (status === "success") {
        if (page.injectJs("injectme.coffee")) {
          console.log("... done injecting itself!");
        } else {
          console.log("... fail! Check the $PWD?!");
        }
      }
      return phantom.exit();
    });
  } else {
    alert("* Script running in the Page context.");
  }

}).call(this);
