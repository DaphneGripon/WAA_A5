'use strict';

function load()
{
  var paragraph = document.getElementById("rentalsDetails");
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


  var id = 'N/A';
  var driver = 'N/A';
  var pickupDate = 'N/A';
  var returnDate = 'N/A';
  var car_id = 'N/A';
  var distance = 'N/A';
  var pricePerKm = 0;
  var pricePerDay = 0;
  var price = 0;
  var duration = 0;
  paragraph.innerHTML =  "Rentals:<br><br>";
  for(var i = 0; i < rentals.length; i++)
  {
    console.log(rentals[i]);
    id = rentals[i].id;
    car_id = rentals[i].car_id;
    distance = rentals[i].distance;
    driver = rentals[i].driver.firstName + ' ' + rentals[i].driver.lastName;
    pickupDate = rentals[i].pickupDate;
    returnDate = rentals[i].returnDate;
    var d1 = new Date(pickupDate);
    var d2 = new Date(returnDate);
    duration = (d2.getTime() - d1.getTime()) / 86400000 + 1;

    for(var j = 0; j < cars.length; j++)
    {
        if(cars[j].id == car_id)
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
          price = distance * pricePerKm + durationPrice;
          alert(distance+"*"+ pricePerKm+"+"+durationPrice+"="+price);
          break;
        }
    }
    paragraph.innerHTML +=  driver + " rented the " + car_id + " car for ";
    paragraph.innerHTML +=  duration + "days and drove ";
    paragraph.innerHTML +=  distance + "km for a total of ";
    paragraph.innerHTML +=  "<span style='color:red;font-weight:bold;'>" + price + "</span><br>";
  }
}
