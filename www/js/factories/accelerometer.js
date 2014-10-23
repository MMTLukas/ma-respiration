angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout, Logger, FilterMedian) {
    var z = 0, countdownID, watchId = null;

    //for desktop debugging and current development - next 5 lines
    var countdown = function () {
        //console.log(z);
        countdownID = $timeout(countdown, 50);
    }
    countdownID = $timeout(countdown, 50);

    // Medianfilter
    var unfilteredData = [];
    var filteredData = [];
    var medianFilterWindowSize = FilterMedian.getWindowSize();

    var start = function () {
        Logger.initializeStart();

        if (navigator.accelerometer) {
            if(watchId){
                return;
            }

            watchId = navigator.accelerometer.watchAcceleration(
                function (acceleration) {
                    z = Math.floor(acceleration.z * 100) / 100;
                    unfilteredData.push(z);

                    // calculate the time pased from the beginning
                    var currentTimestamp = Date.now(),
                        timeSinceStart = (currentTimestamp - Logger.getStartTimestamp()),
                        timestampInMinutes = new Date(timeSinceStart).getMinutes(),
                        timestampInSeconds = new Date(timeSinceStart).getSeconds(),
                        timestampInMilliseconds = new Date(timeSinceStart).getMilliseconds(),
                        logTimeMeasurement = (timestampInMinutes + "min " + timestampInSeconds + "s " + timestampInMilliseconds + "ms");

                    //console.log(logTimeMeasurement);

                    if(unfilteredData.length >= medianFilterWindowSize) {
                        filteredData.push(logTimeMeasurement + ", " + FilterMedian.calculateMedian(unfilteredData));
                        unfilteredData = []; // clear array to avoid same values to be the median
                    }

                     // collect data for 60 seconds
                    if(currentTimestamp - Logger.getStartTimestamp() < Logger.getTimeFrame()) {
                        Logger.collectData(z, logTimeMeasurement);
                    }
                    else if(Logger.getLoggingActive()) {
                        // Datei schreiben!
                        Logger.log();
                        Logger.setLoggingActive(false);
                    }

                }.bind(this), function () {
                    alert("Beschleunigung konnte nicht abgefragt werden");
                }, {
                    frequency: 50
                });
        }
        else {
            alert("accelerometer is not there!");
        }
    }

    var stop = function(){
        Logger.logFilteredData(filteredData);
        navigator.accelerometer.clearWatch(watchId);
        watchId = null;
    }

    var getZ = function () {
        return z;
    }

    return {
        start: start,
        stop: stop,
        getZ: getZ
    }
});