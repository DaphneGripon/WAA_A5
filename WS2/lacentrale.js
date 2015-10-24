var http = require('http');
var bl = require('bl');
var cheerio = require('cheerio');

module.exports = function(car, callback)
{
			var link = 'http://www.lacentrale.fr/cote-voitures-' + car.brand + '-' + car.model + '--' + car.releaseDate + '-.html';
			var tabVersion = [];
			var i = 0;
			var finalTab = [];
			console.log('url LaCentrale:'+link);
			http.get(link,
				function(result)
				{
					result.pipe(bl(
						function(err,data)
						{
							if(err)
								callback(err, null);
							else
							{
								data = data.toString();
								$ = cheerio.load(data);
								$('table#TabAnnHomeCote tr').each(function(key, value)
								{
										var version ="";
										var fueltype = "";
										$(value.children).each(function(key, value)
										{
											if(value.name == 'td')
											{
												var type = value.attribs.class;
												if(type == 'tdSD QuotMarque')
												{
													version = $(value).find('a').text();
												}
												else if(type == 'tdSD QuotNrj')
												{
													fueltype = $(value).find('a').text().toLowerCase();
												}
												else if(type == 'tdSD QuotBoite')
												{
													gearBox = $(value).find('a').text().toLowerCase();
													if(fueltype == car.fuel.toLowerCase() && gearBox == car.gearBox.toLowerCase())
													{
														tabVersion.push(version);
														i++;
													}
												}
											}
										}
									);
								});

								console.log("Number of versions: "+tabVersion.length);
								getHttpForLink2(0, tabVersion, finalTab, car, callback);
							};
							}
						))
						}
					).on('error', function(e) {
						callback(e, null);
					})

};

/*
@function gets the Argus price for all the different versions in the tabVersion
@param i: the index in the tab of links/versions
@param tabVersion: an array containing all the links for the versions corresponding
										to the chosen car
@param tab: the array to be returned containing the name, price and color
						(green for good deal, red for bad one) for each versions of the car
@param car: json object containing all the information about the car in the LBC ad
@param callback: the callback to be called at the end, or in case of error
*/
function getHttpForLink2(i, tabVersion, tab, car, callback)
{
	if(i<tabVersion.length)
	{
		var newVersion = tabVersion[i].toLowerCase().replace('(','%28').replace(')','%29').replace(/ /g,'+').replace(/-/g,'_').replace(/&/g,'%5E');
		link = 'http://www.lacentrale.fr/fiche_cote_auto_flat.php?marque='+car.brand+'&modele='+car.model+'&millesime='+car.releaseDate+'&version='+newVersion+'&type=perso&km='+car.kilometers+'&fh=0&fdt='+car.releaseDate+'-01';
		http.get(link,function(result2) {
			result2.pipe(bl(function(err2,data2)
			{
				data2 = data2.toString();
				$ = cheerio.load(data2);
				var priceArgus = parseInt($('span#cote_perso').text().replace(/ /g, ''));
				var colorClass = priceArgus >= car.price ? 'good' : 'bad';
				var object = {
					'version': tabVersion[i],
					'price' : priceArgus,
					'color' : colorClass
				};
				tab.push(object);
				getHttpForLink2(i+1, tabVersion, tab, car, callback);
			}));
		}).on('error', function(e) {
			callback(e, null);
		});
	}
	else
	{
		console.log(tab);
		callback(null, tab);
	}
}
