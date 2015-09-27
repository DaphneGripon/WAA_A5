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
  ],
  "rentalModifications": [
    {
      "id": 1,
      "rentalId": "1-pb-92" ,
      "end_date": "2015-09-13",
      "distance": 150
    },
    {
      "id": 2,
      "rentalId": "3-sa-92",
      "pickupDate": "2015-09-01"
    }
  ]
};
console.log(data);
var cars = data.cars;
var rentals = data.rentals;
var modifs = data.rentalModifications;

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
  var duration =  getDayDifference( rental.pickupDate, rental.returnDate);
  var deductibleReduction = rental.options.deductibleReduction;

  for(var j = 0; j < cars.length; j++)
  {
      if(cars[j].id == rental.car_id)
      {
        pricePerKm = cars[j].pricePerKm;
        pricePerDay = cars[j].pricePerDay;

        var durationPrice = getDurationPrice(duration, pricePerDay);
        price = rental.distance * pricePerKm + durationPrice;
        result +=  "#" + rental.id + ":<br> From " + rental.pickupDate + " to "
                + rental.returnDate + "(" + duration + " days), driven "
                + rental.distance + "kms.<br>";
        var currentRental = { "duration" : duration, "price" : price };
        var modRental;
        //Check for rental modifications
        for(var mod = 0; mod < modifs.length; mod++)
        {
          if(modifs[mod].rentalId == rental.id)
          {
            var newR = modifs[mod];
            var n_Distance = newR.distance ? newR.distance : rental.distance;
            var n_Start = newR.pickupDate ? newR.pickupDate : rental.pickupDate;
            var n_End = newR.end_date ? newR.end_date : rental.returnDate;
            duration = getDayDifference(n_Start, n_End);
            durationPrice = getDurationPrice(duration, pricePerDay);
            price = n_Distance * pricePerKm + durationPrice;
            modRental = { "duration" : duration, "price" : price };
            break;
          }
        }

        var comm = computeComm(modRental, currentRental, deductibleReduction);
        for(var indexD = 0; indexD < comm.debts.length; indexD++)
        {
          var party = comm.debts[indexD];
          result += "-" + party.who + " : " + party.type + " : " + party.amount
                  + "E.<br>";
        }
        if(comm.newDebts)
        {
          result += "<div class='changes'>RENTAL MODIFICATIONS:<br>";
          for(var indexNB = 0; indexNB < comm.debts.length; indexNB++)
          {
            var party = comm.newDebts[indexNB];
            result += "-" + party.who + " : " + party.type + " : " + party.amount
                    + "E.<br>";
          }
          result+= "</div>";
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
  var d1 = new Date(date1);
  var d2 = new Date(date2);
  return (d2.getTime() - d1.getTime()) / (60 * 60 * 24 * 1000) + 1;
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
function computeComm(modRental, newRental, deductibleReduction)
{
  var debts;
  var newDebts;
  var result;

  if(newRental)
  {
    var price = newRental.price;
    var duration = newRental.duration;

    //Commission is 30% of the price
    //Insurance takes half of the commission, so 15%
    //Assistance takes 1 per day
    //Drivy takes the rest

    var insurance = getHalfComm(price);
    var driver = getDriverComm(price, duration, deductibleReduction);
    var owner = getOwnerComm(price);
    var assistance = (duration);
    var drivy = getDrivyComm(insurance, duration, deductibleReduction);

    debts = [
        {
          "who": "driver",
          "type": (driver >= 0 ? "CREDIT" : "DEBIT"),
          "amount": Math. abs(driver)
        },
        {
          "who": "owner",
          "type": (owner >= 0 ? "CREDIT" : "DEBIT"),
          "amount": Math.abs(owner)
        },
        {
          "who": "insurance",
          "type": (insurance >= 0 ? "CREDIT" : "DEBIT"),
          "amount": Math.abs(insurance)
        },
        {
          "who": "assistance",
          "type": (assistance >= 0 ? "CREDIT" : "DEBIT"),
          "amount": Math.abs(assistance)
        },
        {
          "who": "drivy",
          "type": (drivy >= 0 ? "CREDIT" : "DEBIT"),
          "amount": Math.abs(drivy)
        }
      ];

    if(modRental)
    {
      console.log(computeComm(null, modRental, deductibleReduction));

      duration = modRental.duration;
      price = modRental.price;

      insurance = getHalfComm(price) - insurance;
      driver = getDriverComm(price, duration, deductibleReduction) - driver;
      owner = getOwnerComm(price) - owner;
      assistance = (duration) - assistance;
      drivy = getDrivyComm(getHalfComm(price), duration, deductibleReduction) - drivy;

      newDebts = [
          {
            "who": "driver",
            "type": (driver >= 0 ? "CREDIT" : "DEBIT"),
            "amount": Math.abs(driver)
          },
          {
            "who": "owner",
            "type": (owner >= 0 ? "CREDIT" : "DEBIT"),
            "amount": Math.abs(owner)
          },
          {
            "who": "insurance",
            "type": (insurance >= 0 ? "CREDIT" : "DEBIT"),
            "amount": Math.abs(insurance)
          },
          {
            "who": "assistance",
            "type": (assistance >= 0 ? "CREDIT" : "DEBIT"),
            "amount": Math.abs(assistance)
          },
          {
            "who": "drivy",
            "type": (drivy >= 0 ? "CREDIT" : "DEBIT"),
            "amount": Math.abs(drivy)
          }
        ];
    }
    result = {debts, newDebts};
  }
  return result;
};

function getHalfComm(price)
{
  var amount = (price * 30/100) / 2;
  //return (Math.round(10 * amount) / 10);
  return amount;
};

function getDrivyComm(halfCom, duration, deductibleReduction)
{
  //Insurance takes half of the commission, so 15%
  //Assistance takes 1 per day
  //Drivy takes the rest
  var amount = (halfCom - duration) + (deductibleReduction ? 4 * duration : 0);
  return amount;
};

function getDriverComm(price, duration, deductibleReduction)
{
  return -(price + (deductibleReduction ? 4 * duration : 0));
};

function getOwnerComm(price)
{
  return (70*price/100);
};

function getInsuranceComm()
{

};
