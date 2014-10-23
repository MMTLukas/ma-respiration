angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout, Logger) {
    var countdownID;
    var buttonText = "Start";
    var watchId;
    var liveStorage = new Array();
    var liveDurationInMs = 20000;

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

            console.log(liveStorage);
            liveStorage = new Array();
        } else {
            buttonText = "Stop";
            watchId = navigator.accelerometer.watchAcceleration(
                function (acceleration) {
                    var currentValues = new Array(acceleration.timestamp, Math.floor(acceleration.z * 100) / 100);
                    liveStorage.push(currentValues);

                    if(liveStorage[0][0] < currentValues[0]-liveDurationInMs){
                        liveStorage.shift();
                    }
                }.bind(this), function () {
                    alert("Beschleunigung konnte nicht abgefragt werden");
                }, {
                    frequency: 100
                });
        }
    }

    var getLatestZ = function () {
        return liveStorage[liveStorage.length-1]["z"] || 0;
    }

    var getLiveValues = function(){
        return liveStorage;
    }

    return {
        button: button,
        buttonText: buttonText,
        getLatestZ: getLatestZ,
        getLiveValues: getLiveValues
    }
});