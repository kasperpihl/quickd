(function() {
  var el;

  window.cbfunc = function(data) {
    var globaldata, item, list, _i, _len;
    globaldata = data;
    list = data.query.results.movie;
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      console.log(item.title + ' [' + item.rating.MPAA.content + ']');
    }
    return phantom.exit();
  };

  el = document.createElement('script');

  el.src = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20movies.kids-in-mind&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=window.cbfunc";

  document.body.appendChild(el);

}).call(this);
