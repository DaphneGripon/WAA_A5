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
      "distance": 100,
      "options":{
        "deductibleReduction": false
      }
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
      "distance": 300,
      "options":{
        "deductibleReduction": true
      }
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
      "distance": 1000,
      "options":{
        "deductibleReduction": true
      }
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
  var deductibleReduction = rental.options.deductibleReduction;

  for(var j = 0; j < cars.length; j++)
  {
      if(cars[j].id == rental.car_id)
      {
        pricePerKm = cars[j].pricePerKm;
        pricePerDay = cars[j].pricePerDay;

        var durationPrice = getDurationPrice(duration, pricePerDay);
        price = rental.distance * pricePerKm + durationPrice;
        result +=  "#" + rental.id + ":<br> From " + pickupDate.toString()
                + " to " + returnDate + "(" + duration + " days), driven "
                + rental.distance + "kms.<br>";
        var comm = computeCommission(duration, price, deductibleReduction);
        for(var index = 0; index < comm.money.length; index++)
        {
          var party = comm.money[index];
          result += "-" + party.who + " : " + party.type + " : " + party.amount
                  + "E.<br>"
        }
        result +=  "<br><br>";
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

/*
* @function returns the duration price part of the rental's total price
* @param : duration : the duration of the rental
* @param : pricePerDay : the daily fee for renting
*/
function getDurationPrice(duration, pricePerDay)
{
  var tenPercent = pricePerDay - 10*pricePerDay/100;
  var thirtyPercent = pricePerDay - 30*pricePerDay/100;
  var fiftyPercent = pricePerDay - 50*pricePerDay/100;

  if(duration <= 1)
  {
    return pricePerDay;
  }
  else if(duration <= 4)
  {
    return pricePerDay + (duration - 1) * (tenPercent);
  }
  else if(duration <= 10)
  {
    return pricePerDay + 3 * (tenPercent) + (duration - 4)*thirtyPercent;
  }
  else
  {
    return pricePerDay + 3 * (tenPercent) + 6 * thirtyPercent + (duration - 10) * fiftyPercent;
  }
}

/*
* @function returns the commission for a rental
* @param : duration : length of a rental
* @param : price : price for the rental
*/
function computeCommission(duration, price, deductibleReduction)
{
  //Commission is 30%
  var halfCom = (price * 30/100) / 2;
  //Insurance takes half of the commission, so 15%
  //Assistance takes 1 per day
  //Drivy takes the rest
  var drivy = (halfCom - duration) + (deductibleReduction ? 4 * duration : 0);

  var result = {
    "money": [
      {
        "who": "driver",
        "type": "DEBIT",
        "amount": (price + (deductibleReduction ? 4 * duration : 0))
      },
      {
        "who": "owner",
        "type": "CREDIT",
        "amount": (70*price/100)
      },
      {
        "who": "insurance",
        "type": "CREDIT",
        "amount": (Math.round(10 * halfCom) / 10)
      },
      {
        "who": "assistance",
        "type": "CREDIT",
        "amount": (duration)
      },
      {
        "who": "drivy",
        "type": "CREDIT",
        "amount": (Math.round(10 * drivy) / 10)
      }
    ]
  };

  return result;
}
