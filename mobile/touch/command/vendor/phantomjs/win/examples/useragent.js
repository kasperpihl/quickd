(function() {
  var page;

  page = require('webpage').create();

  console.log('The default user agent is ' + page.settings.userAgent);

  page.settings.userAgent = 'SpecialAgent';

  page.open('http://www.httpuseragent.org', function(status) {
    if (status !== 'success') {
      console.log('Unable to access network');
    } else {
      console.log(page.evaluate(function() {
        return document.getElementById('myagent').innerText;
      }));
    }
    return phantom.exit();
  });

}).call(this);
