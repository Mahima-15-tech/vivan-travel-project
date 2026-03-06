const http = require('https');

async function add(req, res) {

    const requestData = {
        "Auth_Header": {
          "UserId": "viviantravelsuat",
          "Password": "3B96F16F32C9AEB30C4DF9B3FBABAE964E4E1033",
          "IP_Address": "192.168.31.24",
          "Request_Id": "5500887959052",
          "IMEI_Number": "2232323232323"
        },
        "Travel_Type": 0,
        "Booking_Type": 0,
        "TripInfo": [
          {
            "Origin": "JAI",
            "Destination": "DEL",
            "TravelDate": "11/20/2024",
            "Trip_Id": 0
          }
        ],
        "Adult_Count": 1,
        "Child_Count": 0,
        "Infant_Count": 0,
        "Class_Of_Travel": 0,
        "InventoryType": 0,
        "Filtered_Airline": [
          {
            "Airline_Code": ""
          }
        ]
      };


    var options = {
        host: 'http://uat.etrav.in/airlinehost/AirAPIService.svc/JSONService/Air_Search',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        path: requestData,
        method: 'POST',
      };
      
      http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      }).end();
}





module.exports = {
    add,
};
