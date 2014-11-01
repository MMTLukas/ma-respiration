angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout, FrequencyCalculator, FilterMedian, FilterAverage, FilterGaussian) {
  var countdownID;
  var toggleText = "Start";
  var isWatching;
  var liveStorage = [];
  var liveDurationInMs = 20000;
  var frequencyInMs = 65;
  var windowInMs = 650;
  var startTimestamp = "";

  var rawData = [];
  var firstFilteredData = [];
  var secondFilteredData = [];

  FilterGaussian.setSigma(3);
  FilterGaussian.setK(7);
  FilterGaussian.calculateCoefficients();

  FilterAverage.setWindowSize(windowInMs/frequencyInMs);
  FilterMedian.setWindowSize(windowInMs/frequencyInMs);

  var medianWindowSize = FilterMedian.getWindowSize();
  var averageWindowSize = FilterAverage.getWindowSize();
  var gaussianWindowSize = 2 * FilterGaussian.getK();

  var start = function () {
    FrequencyCalculator.init();
    setFrequencyCounter("Atemfrequenz: " + "-" + "x /min");
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
          "z": Math.floor(acceleration.z*10)/10
        };
        rawData.push(currentData.z);

        if (rawData.length >= medianWindowSize) {
          currentData.z = FilterMedian.calculate(rawData);
          firstFilteredData.push(currentData.z)
          rawData.shift();
        }

        if (firstFilteredData.length >= averageWindowSize) {
          currentData.z = FilterAverage.calculate(firstFilteredData);
          firstFilteredData.shift();
          liveStorage.push({"timestamp": currentData.timestamp, "z": currentData.z});
        }

        /*if (rawData.length >= gaussianWindowSize) {
         currentData.z = FilterGaussian.calculateFilteredArray(rawData);
         rawData.shift();
         liveStorage.push({"timestamp": currentData.timestamp, "z": currentData.z});
         }*/

        if (liveStorage.length > 0 && liveStorage[0].timestamp < currentData.timestamp - liveDurationInMs) {
          liveStorage.shift();
        }

        FrequencyCalculator.calculateFrequency(liveStorage);

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
      //sinus();
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

  var getToggleButtonText = function () {
    return toggleText;
  }

  var sinus = function() {
    var sinusValues = [];
    for (var i = 0; i < 24*Math.PI; i++) {
      sinusValues.push({"z": Math.sin(i), "timestamp": sinusValues.length});
      if(i > 0) {
        FrequencyCalculator.calculateFrequency(sinusValues);
      }
    }
  };

  return {
    toggle: toggle,
    sinus: sinus,
    getToggleButtonText: getToggleButtonText,
    getLiveValues: getLiveValues,
    getStartTimestamp: getStartTimestamp
  }
});
