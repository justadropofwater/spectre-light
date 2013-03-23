var express = require('express')
, moment = require('moment')
, colors = require('colors');
var app = express();

colors.setTheme({
	silly: 'rainbow',
	input: 'blue',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});

app.use(express.static(__dirname + '/public'));

app.get('/time', function(req, res){
	var time = moment().format("h:mm:ss a");
	console.log('The time is now ' + time.info);
	res.send(time);
});

app.listen(3000);
console.log('locked and loaded'.silly);
console.log('Please navigate to http://localhost:3000 in your favorite browser.'.info);