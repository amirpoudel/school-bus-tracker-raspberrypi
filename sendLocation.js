const { database } = require("./cloudConfig");
const { ref, set,push,update } = require("firebase/database");




function sendLocationToCloud(busID, latitude, longitude,speed,course,altitude,time) {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
     // Update the current location for the bus
    const currentLocationRef = ref(database, `/busLocation/${busID}/currentLocation`);
    update(currentLocationRef, {
        latitude: latitude,
        longitude: longitude,
        speed:speed,
        course:course,
        altitude:altitude,
        time: time
    });
    
    // Push the location into the location history under the formatted date
    const historyLocationRef = ref(database, `/busLocation/${busID}/locationHistory/${formattedDate}`);
    const newLocationEntry = push(historyLocationRef);
    set(newLocationEntry, {
        latitude: latitude,
        longitude: longitude,
        speed:speed,
        course:course,
        altitude:altitude,
        time: time
    });
}

module.exports = sendLocationToCloud;
