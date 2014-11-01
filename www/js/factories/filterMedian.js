angular.module('respiratoryFrequency').factory('FilterMedian', function () {

  /**
  * ## Median Filter
  */

  /**
   * variable windowSize: amount of values that are processed by this filter
  */
  var windowSize = 20;

  /**
   * @public
   * @function getWindowSize
   * @return {number}
   */
  function getWindowSize() {
    return windowSize;
  }



  function setWindowSize(value) {
    windowSize = Math.floor(value);
  }

  /**
   * @public
   * @function calculate
   *
   * @param {Array} unfilteredValues Array that needs to be filtered
   *
   * @return {number} median
   */

  function calculate(unfilteredValues) {
    var tmpUnfilteredValues = unfilteredValues.slice();
    tmpUnfilteredValues.sort(function (a, b) {
      return a.z - b.z;
    });

    var halfOfLength = tmpUnfilteredValues.length / 2;

    if (windowSize % 2 === 0) {
      var z = (tmpUnfilteredValues[halfOfLength].z + tmpUnfilteredValues[halfOfLength + 1].z) / 2;
      return Math.floor(z*10)/10;
    }
    else {
      var z = tmpUnfilteredValues[Math.floor(halfOfLength) + 1].z;
      return Math.floor(z * 10)/10;
    }
  }

  /**
   * @return {Object} Object with public functions
   */
  return {
    calculate: calculate,
    setWindowSize: setWindowSize,
    getWindowSize: getWindowSize
  }
});
