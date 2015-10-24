module.exports = function(link, callback){
	var bl = require('bl');
	var http = require('http');
	var car;
	http.get(link, function(result) {
		console.log('url LeBonCoin:' + link);
		result.pipe(bl(function(err,data) {
			if(err)
				callback(err, null);
			else
			{
				data = data.toString();
				var brand = data.substring(data.indexOf('<td itemprop="brand">')+21,data.indexOf('<th>Mod')-85);
				var model = data.substring(data.indexOf('<td itemprop="model">')+21,data.indexOf('<th>Ann')-58);
				var releaseDate = data.substring(data.indexOf('<td itemprop="releaseDate">')+73,data.indexOf('<th>Kilom')-155);
				var kilom = data.substring(data.indexOf('<th>Kilom')+54,data.indexOf('<th>Carburant :</th>')-86);
				var fuel = data.substring(data.indexOf('<th>Carburant :</th>')+45,data.indexOf('te de vitesse :</th>')-90);
				var gearBox = data.substring(data.indexOf('te de vitesse :</th>')+45,data.lastIndexOf('<div class="clearer"></div>')-464);
				var city = data.substring(data.indexOf('<td itemprop="addressLocality">')+31,data.indexOf('<th>Code postal :</th>')-103);
				var postalCode = data.substring(data.indexOf('<td itemprop="postalCode">')+26,data.indexOf('<tr itemprop="geo"')-103);
				var price = data.substring(data.indexOf('priceCurrency')+134,data.indexOf('availableAtOrFrom')-294);
				var finalprice = price.substring(price.indexOf('">')+2,price.length);
				var picture = data.substring(data.indexOf('<a id="image" onclick="return nextImage();" class="images" style="background-image: url(')+89,data.indexOf('<div class="thumbs_carousel_window">')-251);

				if(gearBox === 'Manuelle')
					gearBox = 'mécanique';

				brand = brand.toLowerCase().replace('-','_');
				car =
				{
					"brand" : brand.charAt(0).toUpperCase() + brand.slice(1),
					"model" : model.toLowerCase().replace('-','-'),
					"releaseDate" : releaseDate,
					"kilometers" : kilom.replace(' ',''),
					"fuel" : fuel,
					"gearBox" : gearBox,
					"city" : city,
					"postalCode" : postalCode.replace(' ',''),
					"price" : finalprice.replace(' ',''),
					"img" : picture
				};
				console.log(car);
				callback(null, car);
			}}))
		}//end of result.pipe
	).on('error', function(e) {
		callback(e, null);
	});
};
