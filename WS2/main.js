var lbc = require('./leboncoin.js');
var lacentrale = require('./lacentrale.js');

module.exports = function(link){
  console.log(link);

	var carjson;
	lbc(link, function(err, car) {
		if(err)
			return console.log('ERRRRRROOOOOORRR', err);
		carjson = car;
		console.log(car);
	});
}
