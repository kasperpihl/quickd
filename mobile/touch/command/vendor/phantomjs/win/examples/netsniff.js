(function() {
  var createHAR, page;

  if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function() {
      var ms, pad;
      pad = function(n) {
        if (n < 10) {
          return '0' + n;
        } else {
          return n;
        }
      };
      ms = function(n) {
        if (n < 10) {
          return '00' + n;
        } else {
          if (n < 100) {
            return '0' + n;
          } else {
            return n;
          }
        }
      };
      return this.getFullYear() + '-' + pad(this.getMonth() + 1) + '-' + pad(this.getDate()) + 'T' + pad(this.getHours()) + ':' + pad(this.getMinutes()) + ':' + pad(this.getSeconds()) + '.' + ms(this.getMilliseconds()) + 'Z';
    };
  }

  createHAR = function(address, title, startTime, resources) {
    var entries;
    entries = [];
    resources.forEach(function(resource) {
      var endReply, request, startReply;
      request = resource.request;
      startReply = resource.startReply;
      endReply = resource.endReply;
      if (!request || !startReply || !endReply) return;
      return entries.push({
        startedDateTime: request.time.toISOString(),
        time: endReply.time - request.time,
        request: {
          method: request.method,
          url: request.url,
          httpVersion: 'HTTP/1.1',
          cookies: [],
          headers: request.headers,
          queryString: [],
          headersSize: -1,
          bodySize: -1
        },
        response: {
          status: endReply.status,
          statusText: endReply.statusText,
          httpVersion: 'HTTP/1.1',
          cookies: [],
          headers: endReply.headers,
          redirectURL: '',
          headersSize: -1,
          bodySize: startReply.bodySize,
          content: {
            size: startReply.bodySize,
            mimeType: endReply.contentType
          }
        },
        cache: {},
        timings: {
          blocked: 0,
          dns: -1,
          connect: -1,
          send: 0,
          wait: startReply.time - request.time,
          receive: endReply.time - startReply.time,
          ssl: -1
        }
      });
    });
    return {
      log: {
        version: '1.2',
        creator: {
          name: 'PhantomJS',
          version: phantom.version.major + '.' + phantom.version.minor + '.' + phantom.version.patch
        },
        pages: [
          {
            startedDateTime: startTime.toISOString(),
            id: address,
            title: title,
            pageTimings: {}
          }
        ],
        entries: entries
      }
    };
  };

  page = require('webpage').create();

  if (phantom.args.length === 0) {
    console.log('Usage: netsniff.js <some URL>');
    phantom.exit();
  } else {
    page.address = phantom.args[0];
    page.resources = [];
    page.onLoadStarted = function() {
      return page.startTime = new Date();
    };
    page.onResourceRequested = function(req) {
      return page.resources[req.id] = {
        request: req,
        startReply: null,
        endReply: null
      };
    };
    page.onResourceReceived = function(res) {
      if (res.stage === 'start') page.resources[res.id].startReply = res;
      if (res.stage === 'end') return page.resources[res.id].endReply = res;
    };
    page.open(page.address, function(status) {
      var har;
      if (status !== 'success') {
        console.log('FAIL to load the address');
      } else {
        page.title = page.evaluate(function() {
          return document.title;
        });
        har = createHAR(page.address, page.title, page.startTime, page.resources);
        console.log(JSON.stringify(har, void 0, 4));
      }
      return phantom.exit();
    });
  }

}).call(this);
