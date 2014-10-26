angular.module('respiratoryFrequency').factory('FilterGaussian', function () {
  var windowSize = 20;

  function getWindowSize() {
    return windowSize;
  }

  function calculate(z) {
    return z;
  }

  return {
    calculate: calculate,
    getWindowSize: getWindowSize
  }
});