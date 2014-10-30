/**
 * Created by ARF-Design on 30.10.2014.
 */
angular.module('respiratoryFrequency').factory('FrequencyCalculator', function () {

  var liveData = [];
  var slopesArray = [];
  var calculatedSlopesArray = [];
  var counter = 0;
  //var help = [{"timestamp":1, "z":9.534}, {"timestamp":2, "z":9.854}, {"timestamp":3, "z":9.294}, {"timestamp":4, "z":8.844}, {"timestamp":5, "z":9.294}];

  var calculateFrequency = function(data) {
    liveData = data;
    counter++;

    if (counter > 4) {
      calculateSlope(liveData);
      counter = 0;
    }
    setFrequencyCounter(5);
  }

  // calculate the current slope with two values, the window is 5 values, so that the 3 values between are ignored
  var calculateSlope = function(values) {

    slopesArray[0] = values[values.length - 5];
    slopesArray[1] = values[values.length - 1];

    /*console.log(new Date(slopesArray[0].timestamp).getSeconds());
     console.log(new Date(slopesArray[0].timestamp).getMilliseconds());
     console.log(slopesArray[0].z);

     console.log(new Date(slopesArray[1].timestamp).getSeconds());
     console.log(new Date(slopesArray[1].timestamp).getMilliseconds());
     console.log(slopesArray[1].z);*/

    var currentSlope = ((slopesArray[1].timestamp - slopesArray[0].timestamp) / (slopesArray[1].z - slopesArray[0].z)) / 100000;

    console.log(currentSlope);

    var values = [{"currentSlope": currentSlope, "timestampLast": slopesArray[1].timestamp, "zLast":slopesArray[1].z, "timestampFirst": slopesArray[0].timestamp, "zFirst":slopesArray[0].z}];

    checkIfSlopeChange(values);
  }

  var checkIfSlopeChange = function(values) {
    calculatedSlopesArray = [];

    if(calculatedSlopesArray) {
      calculatedSlopesArray[0] = values[0].currentSlope;
    }

    calculatedSlopesArray[1] = values[0].currentSlope;


    calculatedSlopesArray[0] = calculatedSlopesArray[1];
  };

  return {
    calculateFrequency: calculateFrequency
  };
});