angular.module('respiratoryFrequency').factory('FilterMedian', function () {
  var windowSize = 20;

  function getWindowSize() {
    return windowSize;
  }

  function calculate(unfilteredValues) {
    var tmpUnfilteredValues = unfilteredValues.slice();

    tmpUnfilteredValues.sort(function (a, b) {
      return a - b;
    });

    var halfOfLength = tmpUnfilteredValues.length / 2;

    if (windowSize % 2 === 0) {
      return (tmpUnfilteredValues[halfOfLength] + tmpUnfilteredValues[halfOfLength + 1]) / 2;
    }
    else {
      return tmpUnfilteredValues[Math.floor(halfOfLength) + 1];
    }
  }

  return {
    calculate: calculate,
    getWindowSize: getWindowSize
  }
});