angular.module('respiratoryFrequency').factory('FilterGaussian', function () {

  var sigma, k = 0;

  function setSigma(value) {
    sigma = value;
  }

  function setK(value) {
    k = value;
  }

  function calculateGaussianDistribution(x) {
    return 1.0/(sigma * Math.sqrt(2.0*Math.PI)) * Math.exp(-(x * x) / (2 * (sigma * sigma)));
  }

  function calculateNormFactor() {
    var normFactor = 2 + calculateGaussianDistribution(0) / calculateGaussianDistribution(k)
    

  }

  return {
    setSigma: setSigma,
    setK: setK,
    calculateNormFactor: calculateNormFactor
  }
});