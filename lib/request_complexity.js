var http = require("http");
var querystring = require('querystring');

function requestComplexity(inputText, verbose) {


  var send_data = querystring.stringify({
      'input_text' :  inputText
  });
  var get_options = {
      host: 'localhost',
      port: '3000',
      path: '/complexity' + (verbose ? '?mode=verbose': ''),
      method: 'GET',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(send_data)
      }
  };

  // Set up the request
  console.log("REQUEST Promise: ");
  return new Promise(function(resolve, reject) {
    console.log("Promise START");
    /*
    var ld_req = http.request(get_options, function(err, resp, body) {
      console.log("Request result:");
      if (err) {
        console.log("EEEEEEEEEEEEEEEEEEEEEEee", err.message);
        reject(err);
      } else {
        console.log("resolve");
        resolve(JSON.parse(body));
      }
    });
    console.log("send data:", send_data)
    ld_req.write(send_data);
    ld_req.end();

    */


    var ld_req = http.request(get_options, function(res_ld) {
        res_ld.setEncoding('utf8');
        res_ld.on('data', function (body) {
          console.log("on data");
          resolve(JSON.parse(body));
        }).on('error', (err) => {
          console.error(`Got error: ${err.message}`);
          reject(err);
        });;

    });

    ld_req.write(send_data);
    ld_req.end();

  });

}

module.exports = requestComplexity;
