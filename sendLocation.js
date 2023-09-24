const { database } = require("./cloudConfig");
const { ref, set,push } = require("firebase/database");

function sendLocationToCloud(busID, latitude, longitude, time) {
    const locationRef = ref(database, `/busLocation/${busID}`);
      // Create a new child location with a unique key
    const newLocationEntry = push(locationRef);
    set(newLocationEntry, {
        latitude: latitude,
        longitude: longitude,
        time: time
    });
}

module.exports = sendLocationToCloud;
