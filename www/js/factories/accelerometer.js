angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout, Logger, FilterMedian) {
  var countdownID;
  var buttonText = "Start";
  var isWatching;
  var liveStorage = [];
  var liveDurationInMs = 20000;

  // Medianfilter
  var unfilteredData = [];
  var filteredData = [];
  var medianFilterWindowSize = FilterMedian.getWindowSize();

  var button = function () {
    if (!navigator.accelerometer) {
      //Because alert triggers "$apply already in progress" we use setTimeout(0)
      setTimeout(function () {
        alert("No accelerometer available")
      }, 0);
      return;
    }

    if (isWatching) {
      buttonText = "Start";
      //Logger.logFilteredData(filteredData);
      navigator.accelerometer.clearWatch(isWatching);
      isWatching = null;
    } else {
      buttonText = "Stop";
      liveStorage = new Array();
      Logger.initializeStart();

      isWatching = navigator.accelerometer.watchAcceleration(
        function (acceleration) {
          var currentValues = {
            "timestamp": acceleration.timestamp,
            "z": Math.floor(acceleration.z * 100) / 100
          };

          unfilteredData.push(currentValues.z);

          // calculate the time pased from the beginning
          var timeSinceStart = (currentValues.timestamp - Logger.getStartTimestamp()),
            timestampInMinutes = new Date(timeSinceStart).getMinutes(),
            timestampInSeconds = new Date(timeSinceStart).getSeconds(),
            timestampInMilliseconds = new Date(timeSinceStart).getMilliseconds(),
            logTimeMeasurement = (timestampInMinutes + "min " + timestampInSeconds + "s " + timestampInMilliseconds + "ms");

          if (unfilteredData.length >= medianFilterWindowSize) {

            var filteredValue = {
              "timestamp": acceleration.timestamp,
              "z": 0
            };
            //filteredData.push(logTimeMeasurement + ", " + FilterMedian.calculateMedian(unfilteredData));
            filteredValue.z = FilterMedian.calculateMedian(unfilteredData);

            unfilteredData.shift();

            // Fill live storage only with values of 20 seconds
            liveStorage.push(filteredValue);
            if (liveStorage[0].timestamp < currentValues.timestamp - liveDurationInMs) {
              liveStorage.shift();
            }
          }

          // collect data for 60 seconds
          /*
          if (currentValues.timestamp - Logger.getStartTimestamp() < Logger.getTimeFrame()) {
            Logger.collectData(currentValues.z, logTimeMeasurement);
          }
          */


        }.bind(this), function () {
          alert("Beschleunigung konnte nicht abgefragt werden");
        }, {
          frequency: 50
        });
    }
  }

  var getLatestZ = function () {
    return liveStorage[liveStorage.length - 1]["z"] || 0;
  }

  var getLiveValues = function () {
    return liveStorage;
  }

  return {
    button: button,
    buttonText: buttonText,
    getLatestZ: getLatestZ,
    getLiveValues: getLiveValues
  }
})
;
