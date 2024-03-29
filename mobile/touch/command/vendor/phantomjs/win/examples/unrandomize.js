(function() {
  var page;

  page = require('webpage').create();

  page.onInitialized = function() {
    return page.evaluate(function() {
      return Math.random = function() {
        return 42 / 100;
      };
    });
  };

  page.open("http://ariya.github.com/js/random/", function(status) {
    if (status !== "success") {
      console.log("Network error.");
    } else {
      console.log(page.evaluate(function() {
        return document.getElementById("numbers").textContent;
      }));
    }
    return phantom.exit();
  });

}).call(this);
