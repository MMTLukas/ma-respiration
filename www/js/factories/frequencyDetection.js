/**
 * Created by ARF-Design on 30.10.2014.
 */
angular.module('respiratoryFrequency').factory('FrequencyCalculator', function () {
  var liveData,
  slopesArray,
  calculatedSlopesArray,
  counter,
  slopeStatusOldValue,
  slopeStatusNewValue,
  frequencyCounter,
  valuesWhereSlopeChanged,
  startTimestamp,
  currentTimestamp,
  currentSecond,
  frequencyLastMinute,
  valuesToCheck;

  // init-function to be sure, that all values are set back every time a measurement starts
  var init = function() {
    liveData = [];
    slopesArray = [];
    calculatedSlopesArray = [];
    counter = 0;
    slopeStatusOldValue = "";
    slopeStatusNewValue = "";
    frequencyCounter = 0;
    valuesWhereSlopeChanged = [];
    valuesToCheck = [];
    currentSecond = 0;
    currentTimestamp = 0;
    frequencyLastMinute = 0;
  };

  // method which calculates the respiratory-frequency -
  var calculateFrequency = function(data, timestamp) {
    liveData = data;
    currentTimestamp = timestamp;

    if (counter > 1) {
      calculateSlope(liveData);
    } else {
      counter++;
    }

    calculateSlope(liveData);

    currentSecond = new Date(currentTimestamp - startTimestamp).getSeconds();

    var currentBreathFrequency = getBreathFrequency();

    if(currentBreathFrequency > 0) {
      if(currentSecond === 59) {
        frequencyLastMinute = currentBreathFrequency;
        setFrequencyLastMinute("Atemfrequenz letzte Minute: " + frequencyLastMinute + "x /min");
        frequencyCounter = 0;
      }
      setFrequencyCounter("Atemzüge: " + currentBreathFrequency + "x");
    } else {
      setFrequencyCounter("Atemzüge: -");
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
      //console.log(slopeStatusOldValue);
    }  else {

      if(calculatedSlopesArray[0] < 0) {
        slopeStatusOldValue = "negative";
      } else if(calculatedSlopesArray[0] > 0) {
        slopeStatusOldValue = "positive";
      } else {
        //slopeStatusOldValue = "zero";
      }
    }

    if(calculatedSlopesArray[1] < 0) {
      slopeStatusNewValue = "negative";
    } else if (calculatedSlopesArray[1] > 0) {
      slopeStatusNewValue = "positive";
    } else {
      //slopeStatusNewValue = "zero";
    }

    // always when an old and a new slope-value are different, count it as a new turning-point
    if(slopeStatusNewValue != slopeStatusOldValue) {
      //console.log("slope changed");
      frequencyCounter++;

      // save all points, where the slope changes

      valuesWhereSlopeChanged.push({"timestamp": help[0].timestampFirst, "z": help[0].zFirst});

      // store for the second point for the slope-calculation
      // valuesWhereSlopeChanged.push({"timestamp": help[0].timestampLast, "z": help[0].zLast});
    }

      //console.log(frequencyCounter);
      //console.log(valuesWhereSlopeChanged);

    // exchange the old slope-value with the one from the latest value
    calculatedSlopesArray[0] = calculatedSlopesArray[1];
  };

  var getBreathFrequency = function() {
    var current = ((frequencyCounter - 1) / 2);
    return current;
  };

  // method which gets back the values where someones' chest is down - necessary to sign them in the live-diagram
  var getBreathPoints = function() {
    return valuesWhereSlopeChanged;
  };

  var setStartTimestamp = function(value) {
    startTimestamp = value;
  };

  return {
    init: init,
    calculateFrequency: calculateFrequency,
    getBreathPoints: getBreathPoints,
    setStartTimestamp: setStartTimestamp
  };
});