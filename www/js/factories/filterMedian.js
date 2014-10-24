angular.module('respiratoryFrequency').factory('FilterMedian', function () {
    var windowSize = 20;

    function getWindowSize() {
        return windowSize;
    }


  function calculateMedian(unfilteredValues) {
    unfilteredValues.sort(function (a, b) {
      return a - b;
    });

    var halfOfLength = unfilteredValues.length / 2;

    if (windowSize % 2 === 0) {
      return (unfilteredValues[halfOfLength] + unfilteredValues[halfOfLength + 1]) / 2;
    }
    else {
      return unfilteredValues[Math.floor(halfOfLength) + 1];
    }

  }


  return {
    calculateMedian: calculateMedian,
    getWindowSize: getWindowSize
  }
});