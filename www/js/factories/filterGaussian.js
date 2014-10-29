angular.module('respiratoryFrequency').factory('FilterGaussian', function () {
  var sigma, k = 0;
  var coefficients = [];

  function setSigma(value) {
    sigma = value;
  }

  function setK(value) {
    k = value;
  }

  function getK() {
    return k;
  }

  function calculateGaussianDistribution(x) {
    return (1/(sigma * Math.sqrt(2*Math.PI))) * Math.exp(-(x * x) / (2 * (sigma * sigma)));
  }

  function calculateNormFactor(k) {
    var normFactor = 2 + calculateGaussianDistribution(0, sigma) / calculateGaussianDistribution(k, sigma);
    var tempNormFactor = 0;

    for(var i = 1; i < k - 1; i++) {
      tempNormFactor = tempNormFactor + (calculateGaussianDistribution(i, sigma) / calculateGaussianDistribution(k, sigma));
    }

    normFactor = normFactor + 2 * tempNormFactor;
    return normFactor;
  }

  function calculateCoefficients() {
    var normFactor = calculateNormFactor(k);
    for(var i = 0; i < 2 * k; i++) {
      if(i === 0 || i === 2 * k) {
        coefficients.push(1 / normFactor);
      }
      else if(i < k) {
        coefficients.push((calculateGaussianDistribution(k - i) / calculateGaussianDistribution(k)) / normFactor);
      }
      else if(i === k) {
        coefficients.push((calculateGaussianDistribution(0) / calculateGaussianDistribution(k)) / normFactor);
      }
      else {
        coefficients.push((calculateGaussianDistribution(i - k) / calculateGaussianDistribution(k)) / normFactor);
      }
    }
  }

  function calculateFilteredArray(data) {
    var value = 0;
    for(var i = 0; i < data.length; i++) {
      for(var j = i-k; j < i + k; j ++) {
        var coefficientsIndex = (j - i) + coefficients.length / 2;
        // coefficients-Array does not overlap the data array
        if(j >= 0 && j < data.length) {
          value += data[j] * coefficients[coefficientsIndex];
        }
        // calculate filtered data when the coefficients-Array overlap the data-Array on the left side
        else if(j < 0) {
          value += data[j * (-1)] * coefficients[coefficientsIndex];
        }
        // calculate filtered data when the coefficients-Array overlap the data-Array on the right side
        else {
          value += data[2 * data.length - j -2] * coefficients[coefficientsIndex];
        }
      }
    }
    return value;
  }

  return {
    setSigma: setSigma,
    setK: setK,
    getK: getK,
    calculateCoefficients: calculateCoefficients,
    calculateFilteredArray: calculateFilteredArray
  }
});