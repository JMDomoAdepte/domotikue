var express = require("express");
var logfmt = require("logfmt");
var app = express();
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res) {
    var params = querystring.parse(url.parse(req.url).query);
    res.writeHead(200, {"Content-Type": "text/plain"});
    if ('debut' in params && 'fin' in params) {
		  var urltrajet = 'http://maps.google.fr/maps?saddr='+params['debut'] +'&daddr='+params['fin'];  
		  var request = require('request');
		  request({ 'uri' : urltrajet }, function (err, response, body){
		  	if (err || response.statusCode != 200) {
		      callback({'tts': "L'action a échoué"});
		      return;
		    }
		    var $ = require('cheerio').load(body, { xmlMode: true, ignoreWhitespace: false, lowerCaseTags: false });
		    var traffic = $('html.no-maps-mini body.kui div#main.cs div#inner div#page div div#panel.panel-width div#spsizer.cs div div#opanel4.opanel div#panel4.subpanel div#panel_dir.dir div#dir_altroutes.noprint ol#dir_altroutes_body.dir-altroute-mult li#altroute_0.dir-altroute div.dir-altroute-inner div.altroute-aux span').text() ;
		    traffic = traffic.replace('min', 'minutes');		  
			    app.get('/', function(req, res) {
			    res.send(traffic);
				});		
		  });   
        res.write('Vous partez de ' + params['debut'] + 'et vous allez à ' + params['fin']);
    }
    else {
        res.write('Vous devez avoir un point de départ et un point d arrivée, non ?');
    }
    res.end();
});


app.use(logfmt.requestLogger());


  









var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});