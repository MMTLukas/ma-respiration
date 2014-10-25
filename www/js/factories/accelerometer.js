angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout, Logger, FilterMedian, FilterGaussian) {
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

  FilterGaussian.setSigma(50);
  FilterGaussian.setK(37);
  FilterGaussian.calculateNormFactor();

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
      //console.log("in if");
      //Logger.logFilteredData(filteredData);
      navigator.accelerometer.clearWatch(isWatching);
      isWatching = null;
    } else {
      setStartTimestamp();
      //console.log("in else");
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

          if (unfilteredData.length >= medianFilterWindowSize) {
            var filteredValue = {
              "timestamp": acceleration.timestamp,
              "z": 0
            };

            //filteredData.push(logTimeMeasurement + ", " + FilterMedian.calculateMedian(unfilteredData));
            filteredValue.z = FilterMedian.calculateMedian(unfilteredData.slice());

            unfilteredData.shift();
            // Fill live storage only with values of 20 seconds
            liveStorage.push(filteredValue);
            if (liveStorage[0].timestamp < currentValues.timestamp - liveDurationInMs) {
              liveStorage.shift();
            }
          }

          // collect data for 60 seconds
          /*if (currentValues.timestamp - getStartTimestamp < Logger.getTimeFrame()) {
            Logger.collectData(currentValues.z, logTimeMeasurement);
          }*/
        }.bind(this), function () {
          alert("Beschleunigung konnte nicht abgefragt werden");
        }, {
          frequency: 50
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

  return {
    button: button,
    buttonText: buttonText,
    getLatestZ: getLatestZ,
    getLiveValues: getLiveValues,
    getStartTimestamp: getStartTimestamp
  }
})
;
