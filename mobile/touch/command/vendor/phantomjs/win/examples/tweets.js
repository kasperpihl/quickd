(function() {
  var page, twitterId;

  page = require('webpage').create();

  twitterId = 'sencha';

  page.onConsoleMessage = function(msg) {
    return console.log(msg);
  };

  if (phantom.args.length < 1) {
    console.log('Usage: tweets.coffee [twitter ID]');
  } else {
    twitterId = phantom.args[0];
  }

  console.log("*** Latest tweets from @" + twitterId + " ***\n");

  page.open(encodeURI("http://mobile.twitter.com/" + twitterId), function(status) {
    if (status !== 'success') {
      console.log('Unable to access network');
    } else {
      page.evaluate(function() {
        var i, j, list, _len, _results;
        list = document.querySelectorAll('span.status');
        _results = [];
        for (j = 0, _len = list.length; j < _len; j++) {
          i = list[j];
          _results.push(console.log("" + (j + 1) + ": " + (i.innerHTML.replace(/<.*?>/g, ''))));
        }
        return _results;
      });
    }
    return phantom.exit();
  });

}).call(this);
