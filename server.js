

const sendLocationToCloud = require("./sendLocation");

function incrementValues(latitude, longitude, time) {
    // Incrementing latitude and longitude by a small value for testing
    const newLatitude = latitude + 0.001;
    const newLongitude = longitude + 0.001;
    const newTime = time + 1;

    return {
        latitude: newLatitude,
        longitude: newLongitude,
        time: newTime
    };
}

let currentValues = {
    latitude: 27.647386,
    longitude: 85.274718,
    time: 235317
};

function sendIncrementedLocation(busID) {
    currentValues = incrementValues(currentValues.latitude, currentValues.longitude, currentValues.time);
    console.log(currentValues);  // Log the new values
    sendLocationToCloud(busID, currentValues.latitude, currentValues.longitude, currentValues.time);
}

// Call the function directly to send incremented location
sendIncrementedLocation(540);

// Set an interval to also send incremented location data every 1 minute (60,000 milliseconds)
setInterval(() => {
    sendIncrementedLocation(540);
}, 60000);