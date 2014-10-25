angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout, Logger, FilterMedian) {
  var countdownID;
  var buttonText = "Start";
  var isWatching;
  var liveStorage = [];
  var liveDurationInMs = 20000;
  var startTimestamp = "";

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
      navigator.accelerometer.clearWatch(isWatching);
      isWatching = null;
    } else {
      setStartTimestamp();
      buttonText = "Stop";
      liveStorage = new Array();
      Logger.initializeStart();

      var i = 0;

      isWatching = navigator.accelerometer.watchAcceleration(
        function (acceleration) {
          var currentValues = {
            "timestamp": acceleration.timestamp,
            "z": Math.floor(acceleration.z * 100) / 100
          };
          unfilteredData.push(currentValues.z);

          if (unfilteredData.length >= medianFilterWindowSize) {
            var filteredValue = {
              "timestamp": acceleration.timestamp,
              "z": 0
            };

            filteredValue.z = FilterMedian.calculateMedian(unfilteredData);
            unfilteredData.shift();

            // Fill live storage only with values of 20 seconds
            liveStorage.push(filteredValue);
            if (liveStorage[0].timestamp < currentValues.timestamp - liveDurationInMs) {
              liveStorage.shift();
            }
          }
        }.bind(this), function () {
          alert("Beschleunigung konnte nicht abgefragt werden");
        }, {
          frequency: 65
        });
    }
  }

  // calculate the time pased from the beginning
  var getTimeSinceStart = function(currentValues) {
    var timeSinceStart = (currentValues.timestamp - getStartTimestamp()),
      timestampInMinutes = new Date(timeSinceStart).getMinutes(),
      timestampInSeconds = new Date(timeSinceStart).getSeconds(),
      timestampInMilliseconds = new Date(timeSinceStart).getMilliseconds();
      return (timestampInMinutes + "min " + timestampInSeconds + "s " + timestampInMilliseconds + "ms");
  }

  var getLatestZ = function () {
    return liveStorage[liveStorage.length - 1]["z"] || 0;
  }

  var getLiveValues = function () {
    return liveStorage;
  }

  var setStartTimestamp = function() {
    startTimestamp = Date.now();
  }

  var getStartTimestamp = function() {
    return startTimestamp;
  }

  var getButtonText = function() {
    return buttonText;
  }

  return {
    button: button,
    //buttonText: buttonText,
    getLatestZ: getLatestZ,
    getButtonText: getButtonText,
    getLiveValues: getLiveValues,
    getStartTimestamp: getStartTimestamp
  }
})
;
