const SerialPort = require('serialport');
const Readline = require('serialport').parsers.Readline;

const port = new SerialPort('/dev/ttyAMA0', { baudRate: 9600 });

const parser = new Readline();
port.pipe(parser);

const moment = require('moment-timezone')


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


let gpsData = {
    latitude: null,
    longitude: null,
    speed: null,
    course: null,
    altitude: null,
    date: null,
    time: null
};



parser.on('data', (line) => {
    const nmeaSentence = line.split(',');
    let shouldPrint = false;

    switch(nmeaSentence[0]) {
        case '$GPGGA':
        case '$GNGGA':
            gpsData.time = convertUTCToTimeZone(nmeaSentence[1]).format('HH:mm:ss');
            gpsData.latitude = formatDecimal(nmeaToDecimal(parseFloat(nmeaSentence[2]), nmeaSentence[3]))
            gpsData.longitude = formatDecimal(nmeaToDecimal(parseFloat(nmeaSentence[4]), nmeaSentence[5]));
            gpsData.altitude = nmeaSentence[9];
            shouldPrint = true;
            break;
        case '$GPRMC':
        case '$GNRMC':
            gpsData.time = convertUTCToTimeZone(nmeaSentence[1]).format('HH:mm:ss');
            gpsData.latitude = formatDecimal(nmeaToDecimal(parseFloat(nmeaSentence[3]), nmeaSentence[4]));
            gpsData.longitude = formatDecimal(nmeaToDecimal(parseFloat(nmeaSentence[5]), nmeaSentence[6]));
            gpsData.speed = knotsToKmH(nmeaSentence[7])
            gpsData.course = nmeaSentence[8];
            gpsData.date = nmeaSentence[9];
            shouldPrint = true;
            break;
    }

    if (shouldPrint) {
        console.log(gpsData);
    }
});









