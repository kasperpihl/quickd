(function() {
  var fname, page;

  page = require('webpage').create();

  if (phantom.args.length !== 1) {
    console.log('Usage: imagebin.coffee filename');
    phantom.exit();
  } else {
    fname = phantom.args[0];
    page.open('http://imagebin.org/index.php?page=add', function() {
      page.uploadFile('input[name=image]', fname);
      page.evaluate(function() {
        document.querySelector('input[name=nickname]').value = 'phantom';
        document.querySelector('input[name=disclaimer_agree]').click();
        return document.querySelector('form').submit();
      });
      return window.setTimeout(function() {
        return phantom.exit();
      }, 3000);
    });
  }

}).call(this);
