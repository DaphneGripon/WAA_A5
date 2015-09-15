//'use strict';

function load()
{
  var paragraph = document.getElementById("rentalsDetails");
  paragraph.innerHTML =  "Rentals:<br><br>";
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

  for(var i = 0; i < rentals.length; i++)
  {
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
          price = distance * pricePerKm + duration * pricePerDay;
          break;
        }
    }
    paragraph.innerHTML +=  driver + " rented the " + car_id + " car for ";
    paragraph.innerHTML +=  duration + "days(" +pricePerDay+ "/day) and drove ";
    paragraph.innerHTML +=  distance + "km("+pricePerKm+ "/km) for a total of ";
    paragraph.innerHTML +=  "<span style='color:red;font-weight:bold;'>" + price + "</span><br>";
  }
}
