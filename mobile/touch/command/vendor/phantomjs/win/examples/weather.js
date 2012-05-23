(function() {
  var address, page;

  page = require('webpage').create();

  address = 'Mountain View';

  page.onConsoleMessage = function(msg) {
    return console.log(msg);
  };

  if (phantom.args.length < 1) {
    console.log('Usage: weather.coffee [address]');
  } else {
    address = phantom.args.join(' ');
  }

  console.log("*** Loading weather information for '" + address + "' ***\n");

  page.open(encodeURI("http://www.google.com/ig/api?weather=" + address), function(status) {
    if (status !== 'success') {
      console.log('Unable to access network');
    } else {
      page.evaluate(function() {
        var data, forecasts, i, _i, _len, _results;
        if (document.querySelectorAll('problem_cause').length > 0) {
          return console.log("No data available for " + address);
        } else {
          data = function(s, e) {
            var el;
            e = e || document;
            el = e.querySelector(s);
            if (el) {
              return el.attributes.data.value;
            } else {
              return;
            }
          };
          console.log("City: " + (data('weather > forecast_information > city')) + "\nCurrent condition: " + (data('weather > current_conditions > condition')) + "\nTemperature: " + (data('weather > current_conditions > temp_f')) + " F\n" + (data('weather > current_conditions > humidity')) + "\n" + (data('weather > current_conditions > wind_condition')) + "\n");
          forecasts = document.querySelectorAll('weather > forecast_conditions');
          _results = [];
          for (_i = 0, _len = forecasts.length; _i < _len; _i++) {
            i = forecasts[_i];
            _results.push(console.log(("" + (data('day_of_week', i)) + ": ") + ("" + (data('low', i)) + "-") + ("" + (data('high', i)) + " F  ") + ("" + (data('condition', i)))));
          }
          return _results;
        }
      });
    }
    return phantom.exit();
  });

}).call(this);
