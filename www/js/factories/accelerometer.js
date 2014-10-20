angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout, Logger) {
    var z = 0, countdownID;
    var buttonText = "Start";
    var watchId;
    var storage = window.localStorage;

    //Init array in localStorage
    storage.setItem("zValues", JSON.stringify(new Array()));

    var button = function () {
        if (!navigator.accelerometer) {
            //Because alert triggers "$apply already in progress" we use setTimeout(0)
            setTimeout(function () {
                alert("No accelerometer available")
            }, 0);
            return;
        }

        if (watchId) {
            buttonText = "Start";
            navigator.accelerometer.clearWatch(watchId);
            watchId = null;

            console.log(JSON.stringify(storage.getItem("zValues")));
            storage.setItem("zValues", JSON.stringify(new Array()));
        } else {
            buttonText = "Stop";
            //Logger.initializeStart();

            watchId = navigator.accelerometer.watchAcceleration(
                function (acceleration) {
                    z = Math.floor(acceleration.z * 100) / 100;

                    var zValues = JSON.parse(storage.getItem("zValues"));
                    zValues.push(z);
                    storage.setItem("zValues", JSON.stringify(zValues));
                    console.log(z);

                    // collect data for 60 seconds
                    /*if(Date.now() - Logger.getStartTimestamp() < Logger.getTimeFrame()) {
                     Logger.collectData(z);
                     }
                     else if(Logger.getLoggingActive()) {
                     // Datei schreiben!
                     Logger.log();
                     Logger.setLoggingActive(false);
                     }*/

                }.bind(this), function () {
                    alert("Beschleunigung konnte nicht abgefragt werden");
                }, {
                    frequency: 50
                });
        }
    }

    var getZ = function () {
        return z;
    }

    var getZValues = function(){
        return JSON.parse(storage.getItem("zValues")) || [];
    }

    return {
        button: button,
        buttonText: buttonText,
        getZ: getZ,
        getZValues: getZValues
    }
});