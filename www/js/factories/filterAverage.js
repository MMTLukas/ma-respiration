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

  function setWindowSize(value) {
    windowSize = Math.floor(value);
  }

  function calculate(unfilteredValues) {
    var tmpUnfilteredValues = unfilteredValues.slice();
    var sum = 0;

    for (var i = 0; i < tmpUnfilteredValues.length; i++) {
      sum += tmpUnfilteredValues[i].z;
    }

    sum /= tmpUnfilteredValues.length;
    return Math.floor(sum * 10)/10;
  }

  return {
    calculate: calculate,
    setWindowSize: setWindowSize,
    getWindowSize: getWindowSize
  }
});