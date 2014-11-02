/**
 * Created by ARF-Design on 30.10.2014.
 */
angular.module('respiratoryFrequency').factory('FrequencyCalculator', function () {
  var liveData,
    slopesArray,
    calculatedSlopesArray,
    slopeStatusOldValue,
    slopeStatusNewValue,
    frequencyCounter,
    valuesWhereSlopeChanged,
    startTimestamp,
    currentTimestamp,
    currentSecond,
    frequencyLastMinute,
    minutesCounter,
    valuesToCheck;

  // init-function to be sure, that all values are set back every time a measurement starts
  var init = function() {
    liveData = [];
    slopesArray = [];
    calculatedSlopesArray = [];
    slopeStatusOldValue = "";
    slopeStatusNewValue = "";
    frequencyCounter = 0;
    valuesWhereSlopeChanged = [];
    valuesToCheck = [];
    currentSecond = 0;
    currentTimestamp = 0;
    minutesCounter = 1;
    frequencyLastMinute = 0;
  };

  // method which calculates the respiratory-frequency -
  var mainFrequency = function(data, timestamp) {
    liveData = data;
    currentTimestamp = timestamp;

    // start slope-calculation only when at least two values are available
    if (liveData.length > 1) {

      calculateSlope(liveData);
      calculateFrequency();
    }
    //calculateSlope(liveData);
  };

  // method to calculate the breath-frequency and to set the UI-values for the user
  var calculateFrequency = function() {
    currentSecond = new Date(currentTimestamp - startTimestamp).getSeconds();

    var currentBreathFrequency = getBreathFrequency();

    if(currentBreathFrequency > 0) {

      if(currentSecond === 59) {
        frequencyLastMinute = currentBreathFrequency;
        setFrequencyLastMinute("Atemfrequenz " + minutesCounter + ". Minute: " + frequencyLastMinute + "x /min");
        frequencyCounter = 0;
        minutesCounter++;
      }
      setFrequencyCounter("Atemzüge aktuell: " + currentBreathFrequency + "x");

    } else {
      setFrequencyCounter("Atemzüge aktuell: -");
    }
  };

  // this method calculates the current slope for every new value in comparison with the last
  var calculateSlope = function(values) {
    valuesToCheck = [];

    slopesArray[0] = values[values.length - 2];
    slopesArray[1] = values[values.length - 1];

    var currentSlope = ((slopesArray[1].z - slopesArray[0].z) / (slopesArray[1].timestamp - slopesArray[0].timestamp)) / 100000;

    valuesToCheck.push({"currentSlope": currentSlope, "timestampLast": slopesArray[1].timestamp, "zLast":slopesArray[1].z, "timestampFirst": slopesArray[0].timestamp, "zFirst":slopesArray[0].z});

    checkIfSlopeChanged(valuesToCheck);
  };

  // this method is checking if the slope changes across the values in order to calculate turning-points
  // this turning-points are being stored in an array with z-value and timestamp for each point
  var checkIfSlopeChanged = function(value) {
    var help = value;

    calculatedSlopesArray[1] = help[0].currentSlope;

    if(calculatedSlopesArray.length === 0) {

      if(calculatedSlopesArray[1] < 0) {
        slopeStatusOldValue = "negative";

      } else if(calculatedSlopesArray[1] > 0) {
        slopeStatusOldValue = "positive";

      } else {
        slopeStatusOldValue = "zero";
      }

    }  else {

      if(calculatedSlopesArray[0] < 0) {
        slopeStatusOldValue = "negative";

      } else if(calculatedSlopesArray[0] > 0) {
        slopeStatusOldValue = "positive";

      } else {
        // do nothing
      }
    }

    if(calculatedSlopesArray[1] < 0) {
      slopeStatusNewValue = "negative";

    } else if (calculatedSlopesArray[1] > 0) {
      slopeStatusNewValue = "positive";

    } else {
      // do nothing
    }

    // always when an old and a new slope-value are different, count it as a new turning-point
    if(slopeStatusNewValue != slopeStatusOldValue) {
      frequencyCounter++;

      // save all points, where the slope changes
      valuesWhereSlopeChanged.push({"timestamp": help[0].timestampFirst, "z": help[0].zFirst});

      // store for the second points of the slope-calculation
      // valuesWhereSlopeChanged.push({"timestamp": help[0].timestampLast, "z": help[0].zLast});
    }

    // exchange the old slope-value with the one from the latest value
    calculatedSlopesArray[0] = calculatedSlopesArray[1];
  };

  var getBreathFrequency = function() {
    var current = ((frequencyCounter - 1) / 2);
    return current;
  };

  // method which gets back the values of all turning-points - necessary to sign them in the live-diagram
  var getBreathPoints = function() {
    return valuesWhereSlopeChanged;
  };

  var setStartTimestamp = function(value) {
    startTimestamp = value;
  };

  return {
    init: init,
    mainFrequency: mainFrequency,
    getBreathPoints: getBreathPoints,
    setStartTimestamp: setStartTimestamp
  };
});