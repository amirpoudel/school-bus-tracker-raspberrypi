
const sendLocationToCloud = require("./sendLocation.js")

const SerialPort = require('serialport');
const Readline = require('serialport').parsers.Readline;

const port = new SerialPort('/dev/ttyAMA0', { baudRate: 9600 });

const parser = new Readline();
port.pipe(parser);

const moment = require('moment-timezone')

console.log("script Runnig")


function nmeaToDecimal(value, direction) {
    const degree = parseInt(value / 100, 10);
    const decimalMinutes = value - (degree * 100);
    let decimalDegree = degree + decimalMinutes / 60;

    // Adjust for N, S, E, W directions
    if (direction === 'S' || direction === 'W') {
        decimalDegree *= -1;
    }

    return decimalDegree;
};
function formatDecimal(value, places = 6) {
    return parseFloat(value.toFixed(places));
}


function convertUTCToTimeZone(timeStr, timeZone = 'Asia/Kathmandu') {
    const hour = timeStr.substring(0, 2);
    const minute = timeStr.substring(2, 4);
    const second = timeStr.substring(4, 6);

    // Construct a UTC moment object
    const utcMoment = moment.utc(`${hour}:${minute}:${second}`, 'HH:mm:ss');

    // Convert to the desired timezone
    return utcMoment.tz(timeZone);
}

function knotsToKmH(knots) {
    return knots * 1.852;
}






const gps = {
		 latitude : null,
		 longitude : null,
         speed : null,
         course : null,
         altitude : null,
         date : null,
         time : null
		}
   
   
   	
parser.on('data', (line) => {
	
	

	
    const nmeaSentence = line.split(',');
    let shouldPrint = false;
    console.log(nmeaSentence);

    switch(nmeaSentence[0]) {
        case '$GPGGA':
        case '$GNGGA':
            gps.time = convertUTCToTimeZone(nmeaSentence[1]).format('HH:mm:ss');
            gps.latitude = formatDecimal(nmeaToDecimal(parseFloat(nmeaSentence[2]), nmeaSentence[3]))
            gps.longitude = formatDecimal(nmeaToDecimal(parseFloat(nmeaSentence[4]), nmeaSentence[5]));
            gps.altitude = nmeaSentence[9];
            shouldPrint = true;
            break;
        case '$GPRMC':
        case '$GNRMC':
            gps.time = convertUTCToTimeZone(nmeaSentence[1]).format('HH:mm:ss');
           gps.latitude = formatDecimal(nmeaToDecimal(parseFloat(nmeaSentence[3]), nmeaSentence[4]));
           gps.longitude = formatDecimal(nmeaToDecimal(parseFloat(nmeaSentence[5]), nmeaSentence[6]));
           gps.speed = knotsToKmH(nmeaSentence[7])
           gps.course = nmeaSentence[8];
           gps.date = nmeaSentence[9];
            shouldPrint = true;
            break;
    }
     if (isNaN(gps.latitude) || isNaN(gps.longitude)) {
        shouldPrint = false;
        console.log(gps);
        console.log(" latitude and longitude is NaN . not updating cloud")
    }
    if (lastKnownLatitude === gps.latitude && lastKnownLongitude === gps.longitude) {
        shouldPrint = false;
        console.log("Last Known Location and Current Location is Same")
    }


    if (shouldPrint) {
        console.log(gps);
        sendLocationToCloud('BA-1-KHA-3456',gps.latitude,gps.longitude,gps.speed,gps.course,gps.altitude,gps.time)
    }
});














