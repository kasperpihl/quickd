(function() {
  var el;

  window.cbfunc = function(data) {
    var item, list, names, _i, _len;
    list = data.query.results.results.result;
    names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      console.log([item.name.replace(/\s/ig, ' '), ':', names[item.atItsBestUntil], 'to', names[item.atItsBestFrom]].join(' '));
    }
    return phantom.exit();
  };

  el = document.createElement('script');

  el.src = 'http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20bbc.goodfood.seasonal%3B&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=window.cbfunc';

  document.body.appendChild(el);

}).call(this);
