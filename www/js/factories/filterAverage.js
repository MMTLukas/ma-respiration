angular.module('respiratoryFrequency').factory('FilterAverage', function () {

  /**
   * ## Simple Moving Average Algorithm
   */

  /**
   windowSize: amount of values that are processed by this filter
   */

  var windowSize = 20;

  function getWindowSize() {
    return windowSize;
  }

  function calculate(unfilteredValues) {
    var tmpUnfilteredValues = unfilteredValues.slice();

    var sum = tmpUnfilteredValues.reduce(function(a, b) {
      return a + b;
    });

    return sum /= tmpUnfilteredValues.length;
  }

  return {
    calculate: calculate,
    getWindowSize: getWindowSize
  }
});