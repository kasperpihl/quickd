(function() {
  var f, fibs, ticker;

  fibs = [0, 1];

  f = function() {
    console.log(fibs[fibs.length - 1]);
    fibs.push(fibs[fibs.length - 1] + fibs[fibs.length - 2]);
    if (fibs.length > 10) {
      window.clearInterval(ticker);
      return phantom.exit();
    }
  };

  ticker = window.setInterval(f, 300);

}).call(this);
