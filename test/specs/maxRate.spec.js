import axios from '../../index.js';
import http from 'http';
import assert from 'assert';

describe('maxRate Throttling', function () {
  var server;
  var url;

  beforeEach(function (done) {
    server = http.createServer(function (req, res) {
      req.on('data', function () {});
      req.on('end', function () {
        res.writeHead(200);
        res.end('OK');
      });
    });

    server.listen(0, function () {
      url = 'http://localhost:' + server.address().port;
      done();
    });
  });

  afterEach(function (done) {
    server.close(done);
  });

  it('should throttle the upload speed', function (done) {
    var originalSetTimeout = setTimeout;
    var totalDelay = 0;
    
    // Mock global setTimeout
    global.setTimeout = function (cb, ms) {
      totalDelay += ms;
      return originalSetTimeout(cb, 0);
    };

    var payloadSize = 5000;
    var rateLimit = 1000;
    var expectedDelay = 4000; 
    
    var payload = Buffer.alloc(payloadSize).fill('x');

    axios.post(url, payload, {
      maxRate: rateLimit
    }).then(function () {
      global.setTimeout = originalSetTimeout;

      if (totalDelay >= expectedDelay * 0.9) {
        done(); 
      } else {
        done(new Error('Upload too fast. Delay: ' + totalDelay + 'ms. Expected > ' + expectedDelay + 'ms'));
      }
    }).catch(function(err) {
      global.setTimeout = originalSetTimeout;
      done(err);
    });
  });
});