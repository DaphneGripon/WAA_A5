'use strict';

var data = {
  "cars": [
    {
      "id": "p306",
      "vehicule": "peugeot 306",
      "pricePerDay": 20,
      "pricePerKm": 0.10
    }
  ],
  "rentals": [
    {
      "id": "1-pb-92",
      "driver": {
        "firstName": "Paul",
        "lastName": "Bismuth"
      },
      "car_id": "p306",
      "pickupDate": "2015-09-12",
      "returnDate": "2015-09-12",
      "distance": 100
    },
    {
      "id": "2-rs-92",
      "driver": {
        "firstName": "Rebecca",
        "lastName": "Solanas"
      },
      "car_id": "p306",
      "pickupDate": "2015-09-10",
      "returnDate": "2015-09-15",
      "distance": 300
    },
    {
      "id": "3-sa-92",
      "driver": {
        "firstName": " Sami",
        "lastName": "Ameziane"
      },
      "car_id": "p306",
      "pickupDate": "2015-08-31",
      "returnDate": "2015-09-13",
      "distance": 1000
    }
  ]
};
console.log(data);
var cars = data.cars;
var rentals = data.rentals;

var result = '';
for(var i = 0; i < rentals.length; i++)
{
  result += printRentalInfo(rentals[i]);
}

document.write(result);

/*
* @function returns the information and price for a particular rental.
* @param : rental : the rental object, from the json variable, containing
*                   useful information
*/
function printRentalInfo(rental)
{
  var result = '';
  var pricePerKm = 0;
  var pricePerDay = 0;
  var price = 0;
  var driver = rental.driver.firstName + ' ' + rental.driver.lastName;
  var pickupDate = new Date(rental.pickupDate);
  var returnDate = new Date(rental.returnDate);
  var duration =  getDayDifference( pickupDate, returnDate);

  for(var j = 0; j < cars.length; j++)
  {
      if(cars[j].id == rental.car_id)
      {
        pricePerKm = cars[j].pricePerKm;
        pricePerDay = cars[j].pricePerDay;
        var durationPrice = 0;
        var tenPercent = pricePerDay - 10*pricePerDay/100;
        var thirtyPercent = pricePerDay - 30*pricePerDay/100;
        var fiftyPercent = pricePerDay - 50*pricePerDay/100;

        if(duration <= 1)
        {
          durationPrice = pricePerDay;
        }
        else if(duration <= 4)
        {
          durationPrice = pricePerDay + (duration - 1) * (tenPercent);
        }
        else if(duration <= 10)
        {
          durationPrice = pricePerDay + 3 * (tenPercent) + (duration - 4)*thirtyPercent;
        }
        else
        {
          durationPrice = pricePerDay + 3 * (tenPercent) + 6 * thirtyPercent + (duration - 10) * fiftyPercent;
        }
        price = rental.distance * pricePerKm + durationPrice;
        result +=  "#" + rental.id + ":<br>" + driver + " rented the "
                + rental.car_id + " car for " + duration + " days ("
                + pricePerDay + "E/day) and drove " + rental.distance + "km ("
                + pricePerKm + "E/km) for a total of "
                + "<span style='color:red;font-weight:bold;'>" + price
                + "E</span><br><br>";
        break;
      }
  }
  return result;
};

/*
* @function returns how many days the date1 to date2 period makes
* @param : date1 : the start date of the period
* @param : date2 : the end date of the period
*/
function getDayDifference(date1, date2)
{
  return (date2.getTime() - date1.getTime()) / (60 * 60 * 24 * 1000) + 1;
};
