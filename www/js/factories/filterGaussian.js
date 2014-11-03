angular.module('respiratoryFrequency').factory('FilterGaussian', function () {

  /**
   * ## Gaussian Filter
   */


  /**
   * k: Half of the length of the calculated coefficients Array. Needs to be:
   */
  var k = 0;

  /**
   * sigma: Standard deviation.
   * @example ``2 * sigma <= k <= 3 * sigma``
   */
  var sigma = 0;

  /**
   * coefficients: Array of weighted values.
   */
  var coefficients = [];


  /**
   * @public
   * @function setSigma
   * @param {number} value
   */
  function setSigma(value) {
    sigma = value;
  }

  /**
   * @public
   * @function setK
   * @param {number} value
   */
  function setK(value) {
    k = value;
  }

  /**
   * @public
   * @function getK
   * @return {number}
   */
  function getK() {
    return k;
  }

  /**
   * @private
   * @function calculateGaussianDistribution
   * @param {number} x
   * @return {number} value Calculated by the formula of the gaussian (normal) distribution
   */
  function calculateGaussianDistribution(x) {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-(x * x) / (2 * (sigma * sigma)));
  }

  /**
   * @private
   * @function calculateNormFactor
   * @param {number} k
   * @return {number} Factor to normalize coefficients
   */
  function calculateNormFactor(k) {
    var normFactor = 2 + calculateGaussianDistribution(0, sigma) / calculateGaussianDistribution(k, sigma);
    var tempNormFactor = 0;

    for (var i = 1; i < k - 1; i++) {
      tempNormFactor = tempNormFactor + (calculateGaussianDistribution(i, sigma) / calculateGaussianDistribution(k, sigma));
    }

    normFactor = normFactor + 2 * tempNormFactor;
    return normFactor;
  }

  /**
   * @public
   * @function calculateCoefficients
   * @return {number} Factor to normalize coefficients
   */
  function calculateCoefficients() {
    var normFactor = calculateNormFactor(k);
    for (var i = 0; i < 2 * k; i++) {
      if (i === 0 || i === 2 * k) {
        coefficients.push(1 / normFactor);
      }
      else if (i < k) {
        coefficients.push((calculateGaussianDistribution(k - i) / calculateGaussianDistribution(k)) / normFactor);
      }
      else if (i === k) {
        coefficients.push((calculateGaussianDistribution(0) / calculateGaussianDistribution(k)) / normFactor);
      }
      else {
        coefficients.push((calculateGaussianDistribution(i - k) / calculateGaussianDistribution(k)) / normFactor);
      }
    }
  }

  /**
   * @public
   * @function calculateFilteredArray
   * @param {Array} data
   * @return {Array} The return value is calculated by multiplying the unfiltered values with the corresponding weighted coefficient.
   */
  function calculateFilteredArray(data) {

    var filteredData = [];
    for (var i = 0; i < data.length; i++) {

      var value = 0;

      for (var j = i - k; j < i + k; j++) {
        var coefficientsIndex = (j - i) + coefficients.length / 2;
        // coefficients-Array does not overlap the data array
        if (j >= 0 && j < data.length) {
          value += data[j].z * coefficients[coefficientsIndex];
          //console.log("VALUE:" + value);
        }
        // calculate filtered data when the coefficients-Array overlap the data-Array on the left side
        else if (j < 0) {
          value += data[j * (-1)].z * coefficients[coefficientsIndex];
        }
        // calculate filtered data when the coefficients-Array overlap the data-Array on the right side
        else {
          value += data[2 * data.length - j - 2].z * coefficients[coefficientsIndex];
        }

      }
      filteredData.push({"timestamp": data[i].timestamp, "z": value});
    }

    return filteredData.slice();
  }

  return {
    setSigma: setSigma,
    setK: setK,
    getK: getK,
    calculateCoefficients: calculateCoefficients,
    calculateFilteredArray: calculateFilteredArray
  }
});