var app = require('express')();
var path = require('path');
var lbc = require('./leboncoin.js');
var lacentrale = require('./lacentrale.js');
var main = require('./main.js');
var serveStatic = require('serve-static');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(serveStatic(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/res?:url', function(req, res){
	var carjson;
	var finalTab;
	var link = req.query.url;
	lbc(link, function(err, car) {
		if(err)
		{
			res.render("error.html", {url:req.query.url});
			return console.error('ERROR', err);
		}
		else
		{
			carjson = car;
			lacentrale(car, function(err, tab) {
				if(err)
					console.error('ERRRRRROOOOOORRR', err);
				else
				{
					finalTab = tab;
				}
				console.log('-------------- finished.');
				if(finalTab)
					res.render("result.html",{car:car, finalTab:finalTab, url:req.query.url});
				else
					res.render("error.html", {url:req.query.url});
			});
		}
	});
});

app.listen(3000, function(){
	console.log('listening on port *:3000');
});
