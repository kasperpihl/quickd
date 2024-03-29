(function() {
  var page, url;

  page = require('webpage').create();

  url = 'http://lite.yelp.com/search?find_desc=pizza&find_loc=94040&find_submit=Search';

  page.open(url, function(status) {
    var results;
    if (status !== 'success') {
      console.log('Unable to access network');
    } else {
      results = page.evaluate(function() {
        var item, list, pizza, _i, _len;
        pizza = [];
        list = document.querySelectorAll('span.address');
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          item = list[_i];
          pizza.push(item.innerText);
        }
        return pizza;
      });
      console.log(results.join('\n'));
    }
    return phantom.exit();
  });

}).call(this);
