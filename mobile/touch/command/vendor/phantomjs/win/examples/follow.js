(function() {
  var follow, process, users;

  users = ['sencha', 'aconran', 'adityabansod', 'ambisinister', 'arnebech', 'ariyahidayat', 'arthurakay', 'bmoeskau', 'darrellmeyer', 'davidfoelber', 'DavidKaneda', 'donovanerba', 'edspencer', 'evantrimboli', 'ExtAnimal', 'jamieavins', 'jarrednicholls', 'jayrobinson', 'lojjic', 'luckymethod', 'merrells', 'mmullany', 'philogb', 'philstrong', 'rdougan', 'SubtleGradient', '__ted__', 'tmaintz', 'WesleyMoy', 'whereisthysting'];

  follow = function(user, callback) {
    var page;
    page = require('webpage').create();
    return page.open('http://mobile.twitter.com/' + user, function(status) {
      var data;
      if (status === 'fail') {
        console.log(user + ': ?');
      } else {
        data = page.evaluate(function() {
          return document.querySelector('div.timeline-following').innerText;
        });
        console.log(user + ': ' + data);
      }
      return callback.apply();
    });
  };

  process = function() {
    var user;
    if (users.length > 0) {
      user = users[0];
      users.splice(0, 1);
      return follow(user, process);
    } else {
      return phantom.exit();
    }
  };

  process();

}).call(this);
