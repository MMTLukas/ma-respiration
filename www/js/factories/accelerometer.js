angular.module('respiratoryFrequency').factory('Accelerometer', function ($timeout, FrequencyCalculator, FilterMedian, FilterAverage, FilterGaussian) {
  var countdownID;
  var toggleText = "Start";
  var isWatching;
  var diagramStorage = [];
  var calculatorStorage = [];
  var liveDurationInMs = 20000;
  var frequencyInMs = 65;
  var windowInMs = 650;
  var startTimestamp = "";
  var currentTimestamp = 0;

  var rawData = [];
  var medianFilteredData = [];
  var averageFilteredData = [];
  var gaussianFilteredData = [];

  FilterGaussian.setSigma(3);
  FilterGaussian.setK(7);
  FilterGaussian.calculateCoefficients();
  FilterAverage.setWindowSize(windowInMs / frequencyInMs);
  FilterMedian.setWindowSize(windowInMs / frequencyInMs);

  var medianWindowSize = FilterMedian.getWindowSize();
  var averageWindowSize = FilterAverage.getWindowSize();
  var gaussianWindowSize = 2 * FilterGaussian.getK();

  var start = function () {
    FrequencyCalculator.init();
    setFrequencyCounter("Atemzüge: -");
    setStartTimestamp();

    toggleText = "Stop";
    diagramStorage = [];
    calculatorStorage = [];
    rawData = [];
    medianFilteredData = [];
    averageFilteredData = [];
    gaussianFilteredData = [];

    var i = 0;

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
        rawData.push(currentData);

        if (rawData.length >= medianWindowSize) {
          var z = FilterMedian.calculate(rawData);
          medianFilteredData.push({
            "timestamp": currentData.timestamp,
            "z": z
          });
          rawData.shift();
        }

        if (medianFilteredData.length >= averageWindowSize) {
          var z = FilterAverage.calculate(medianFilteredData);
          averageFilteredData.push({
            "timestamp": currentData.timestamp,
            "z": z
          });
          medianFilteredData.shift();

          diagramStorage.push({
            "timestamp": currentData.timestamp,
            "z": z
          });
        }

        if (averageFilteredData.length >= gaussianWindowSize) {
          averageFilteredData.shift();

          if (gaussianFilteredData.length == 0) {
            gaussianFilteredData = gaussianFilteredData.concat(FilterGaussian.calculateFilteredArray(averageFilteredData.slice()));
          }
        }

        if (gaussianFilteredData.length > 0) {

          //TODO: Remove line below and uncomment comment lines below
          calculatorStorage = diagramStorage;
          /*
          calculatorStorage.push({
            "timestamp": currentData.timestamp,
            "z": gaussianFilteredData[0].z
          });
          */

          gaussianFilteredData.shift();
        }

        if (diagramStorage.length > 0 && diagramStorage[0].timestamp < currentData.timestamp - liveDurationInMs) {
          diagramStorage.shift();
        }

        FrequencyCalculator.calculateFrequency(calculatorStorage, currentData.timestamp);

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
    return diagramStorage[diagramStorage.length - 1]["z"] || 0;
  };

  var getLiveValues = function () {
    return diagramStorage.slice();
  };

  var setStartTimestamp = function () {
    startTimestamp = Date.now();
    FrequencyCalculator.setStartTimestamp(startTimestamp);
  };

  var getStartTimestamp = function () {
    return startTimestamp;
  };

  var getToggleButtonText = function () {
    return toggleText;
  };

  var sinus = function () {
    var sinusValues = [];
    for (var i = 0; i < 24 * Math.PI; i++) {
      sinusValues.push({"z": Math.sin(i), "timestamp": sinusValues.length});
      if (i > 0) {
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
