angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout, FilterMedian, FilterAverage, FilterGaussian) {
  var countdownID;
  var toggleText = "Start";
  var isWatching;
  var liveStorage = [];
  var liveDurationInMs = 20000;
  var frequencyInMs = 65;
  var startTimestamp = "";

  var rawData = [];
  var firstFilteredData = [];
  var secondFilteredData = [];

  FilterGaussian.setSigma(3);
  FilterGaussian.setK(7);
  FilterGaussian.calculateCoefficients();

  var medianWindowSize = FilterMedian.getWindowSize();
  var averageWindowSize = FilterAverage.getWindowSize();
  var gaussianWindowSize = 2 * FilterGaussian.getK();




  var start = function () {
    setStartTimestamp();
    toggleText = "Stop";
    liveStorage = [];
    rawData = [];
    firstFilteredData = [];
    secondFilteredData = [];

    isWatching = navigator.accelerometer.watchAcceleration(
      function (acceleration) {

        //Currently only for development
        //TODO: Display spinning wheal for user
        if (rawData.length <= 0) {
          console.log("It will take " +
          (frequencyInMs * medianWindowSize +
          frequencyInMs * averageWindowSize +
          frequencyInMs * gaussianWindowSize) +
          " ms till data will be displayed");
        }

        var currentData = {
          "timestamp": acceleration.timestamp,
          "z": acceleration.z
        };
        rawData.push(currentData.z);


        if (rawData.length >= medianWindowSize) {
          currentData.z = FilterMedian.calculate(rawData);
          firstFilteredData.push(currentData.z);
          rawData.shift();
        }


        if (firstFilteredData.length >= averageWindowSize) {
          currentData.z = FilterAverage.calculate(firstFilteredData);
          firstFilteredData.shift();
          secondFilteredData.push(currentData.z);
        }

        if (secondFilteredData.length >= gaussianWindowSize) {
          currentData.z = FilterGaussian.calculateFilteredArray(secondFilteredData);
          secondFilteredData.shift();
          liveStorage.push({"timestamp": currentData.timestamp, "z": currentData.z});
        }

        if (liveStorage[0].timestamp < currentData.timestamp - liveDurationInMs) {
          liveStorage.shift();
        }
      }.bind(this), function () {
        alert("Beschleunigung konnte nicht abgefragt werden");
      }, {
        frequency: frequencyInMs
      });
  };

  var stop = function () {
    toggleText = "Start";
    navigator.accelerometer.clearWatch(isWatching);
    isWatching = null;
  };

  var toggle = function () {
    if (!navigator.accelerometer) {
      //Because alert triggers "$apply already in progress" we use setTimeout(0)
      setTimeout(function () {
        alert("No accelerometer available")
      }, 0);
      return;
    }

    if (isWatching) {
      stop();
    } else {
      start();
    }
  };

  var getLatestZ = function () {
    return liveStorage[liveStorage.length - 1]["z"] || 0;
  };

  var getLiveValues = function () {
    return liveStorage;
  };

  var setStartTimestamp = function () {
    startTimestamp = Date.now();
  };

  var getStartTimestamp = function () {
    return startTimestamp;
  };

  var getToggleButtonText = function() {
    return toggleText;
  }

  return {
    toggle: toggle,
    getToggleButtonText: getToggleButtonText,
    getLiveValues: getLiveValues,
    getStartTimestamp: getStartTimestamp
  }
});
