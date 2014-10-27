angular.module('respiratoryFrequency').factory('FilterGaussian', function () {

  var sigma, k = 0;
  var coefficients = [];

  function setSigma(value) {
    sigma = value;
  }

  function setK(value) {
    k = value;
  }

  function calculateGaussianDistribution(x) {
    //  there must be an error in this fomula...haven't found it yet...
    return (1/(sigma * Math.sqrt(2*Math.PI))) * Math.exp(-(x * x) / (2 * (sigma * sigma)));
  }

  function calculateNormFactor() {
    var normFactor = 2 + calculateGaussianDistribution(0) / calculateGaussianDistribution(k)
    var tempNormFactor = 0;

    for(var i = 1; i < k - 1; i++) {
      tempNormFactor = tempNormFactor + (calculateGaussianDistribution(i) / calculateGaussianDistribution(k));
    }

    normFactor = normFactor + 2 * tempNormFactor;
    return normFactor;
  }

  function calculateCoefficients() {
    var normFactor = calculateNormFactor();

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
    var filteredData = [];
    for(var i = 0; i < data.length; i++) {
      var value = 0;
      for(var j = 0; j < i - k; j ++) {
        
      }
    }





    /*
     def calculateFilteredArray(dataArray, coefficients)
      filteredData = Array.new
      dataArray.each_with_index do | data, i |
        value = 0
        for j in i-k..i+k
          coefficientsIndex = (j - i) + coefficients.length / 2
          if j >= 0 && j < dataArray.length
            value += dataArray[j] * coefficients[coefficientsIndex]
          elsif j < 0
            value += dataArray[j*(-1)] * coefficients[coefficientsIndex]
          elsif j >= dataArray.length
            value += dataArray[2 * (dataArray.length) - j - 2] * coefficients[coefficientsIndex]
          end
        end
        filteredData.push value
      end
      filteredData
     end
    */
  }

  return {
    setSigma: setSigma,
    setK: setK,
    calculateCoefficients: calculateCoefficients
  }
});