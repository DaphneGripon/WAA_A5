'use strict';

//Variables
var data = {
  "cars": [
    {
      "id": "p306",
      "vehicule": "peugeot 306",
      "pricePerDay": 20,
      "pricePerKm": 0.10
    },
    {
      "id": "rr-sport",
      "pricePerDay": 60,
      "pricePerKm": 0.30
    },
    {
      "id": "p-boxster",
      "pricePerDay": 100,
      "pricePerKm": 0.45
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
      "returnDate": "2015-09-14",
      "distance": 150
    },
    {
      "id": "2-rs-92",
      "driver": {
        "firstName": "Rebecca",
        "lastName": "Solanas"
      },
      "car_id": "rr-sport",
      "pickupDate": "2015-09-09",
      "returnDate": "2015-09-13",
      "distance": 550
    },
    {
      "id": "3-sa-92",
      "driver": {
        "firstName": " Sami",
        "lastName": "Ameziane"
      },
      "car_id": "p-boxster",
      "pickupDate": "2015-09-12",
      "returnDate": "2015-09-14",
      "distance": 100
    }
  ]
};
var cars = data.cars;
var rentals = data.rentals;

console.log(data);

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
        price = rental.distance * pricePerKm + duration * pricePerDay;
        result +=  "#" + rental.id + ":<br>" + driver + " rented the "
                + rental.car_id + " car for " + duration + "days ("
                + pricePerDay + "E/day) and drove " + rental.distance + "km("
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
