(function() {
  var address, output, page, size;

  page = require('webpage').create();

  if (phantom.args.length < 2 || phantom.args.length > 3) {
    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat]');
    console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
    phantom.exit();
  } else {
    address = phantom.args[0];
    output = phantom.args[1];
    page.viewportSize = {
      width: 600,
      height: 600
    };
    if (phantom.args.length === 3 && phantom.args[1].substr(-4) === ".pdf") {
      size = phantom.args[2].split('*');
      if (size.length === 2) {
        page.paperSize = {
          width: size[0],
          height: size[1],
          border: '0px'
        };
      } else {
        page.paperSize = {
          format: phantom.args[2],
          orientation: 'portrait',
          border: '1cm'
        };
      }
    }
    page.open(address, function(status) {
      if (status !== 'success') {
        console.log('Unable to load the address!');
        return phantom.exit();
      } else {
        return window.setTimeout((function() {
          page.render(output);
          return phantom.exit();
        }), 200);
      }
    });
  }

}).call(this);
