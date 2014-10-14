angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout) {
    var z = 0, countdownID, watchId = null;

    //for desktop debugging and current development - next 5 lines
    var countdown = function () {
        //console.log(z);
        countdownID = $timeout(countdown, 50);
    }
    countdownID = $timeout(countdown, 50);

    var start = function () {
        if (navigator.accelerometer) {
            if(watchId){
                return;
            }

            watchId = navigator.accelerometer.watchAcceleration(
                function (acceleration) {
                    z = Math.floor(acceleration.z * 100) / 100;
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