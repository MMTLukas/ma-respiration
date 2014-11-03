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
    minutesCounter;

  var liveDurationInMs = 20000;

  // init-function to be sure, that all values are set back every time a measurement starts
  var init = function() {
    liveData = [];
    slopesArray = [];
    calculatedSlopesArray = [];
    slopeStatusOldValue = "";
    slopeStatusNewValue = "";
    frequencyCounter = 0;
    valuesWhereSlopeChanged = [];
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

      // if a minute is over, this lines display the breath-frequency for the last minute
      if(currentSecond === 59) {
        frequencyLastMinute = currentBreathFrequency;
        setFrequencyLastMinute("Atemfrequenz " + minutesCounter + ". Minute: " + frequencyLastMinute + "x /min");
        frequencyCounter = 0;
        minutesCounter++;
      }
      // display all new detected breaths
      setFrequencyCounter("Atemzüge aktuell: " + currentBreathFrequency + "x");

    } else {
      setFrequencyCounter("Atemzüge aktuell: -");
    }
  };

  // this method calculates the current slope for every new value in comparison with the last
  var calculateSlope = function(values) {

    slopesArray[0] = values[values.length - 2];
    slopesArray[1] = values[values.length - 1];

    var currentSlope = ((slopesArray[1].z - slopesArray[0].z) / (slopesArray[1].timestamp - slopesArray[0].timestamp)) / 100000;

    var timeStampFirstValue = slopesArray[0].timestamp;
    var zValueFirstValue = slopesArray[0].z;

    checkIfSlopeChanged(currentSlope, timeStampFirstValue, zValueFirstValue);
  };

  // this method is checking if the slope changes across the values in order to calculate turning-points
  // this turning-points are being stored in an array with z-value and timestamp for each point
  var checkIfSlopeChanged = function(slope, timestampFirst, zValueFirst) {

    // if there aren't yet any calculated slopes identifiers, set an initial slope identifier
    if(calculatedSlopesArray[0] === undefined) {
      if(slope < 0) {
        slopeStatusOldValue = "negative";

      } else if(slope > 0) {
        slopeStatusOldValue = "positive";

      } else {
        // don't set an slope identifier
      }
    } else {
      // if there is at least one slope identifier in the array, set the slope identifier for the new measured slope-value
      if(slope < 0) {
        slopeStatusNewValue = "negative";

      } else if (slope > 0) {
        slopeStatusNewValue = "positive";

      } else {
        // don't set an slope identifier
      }
      slopeStatusOldValue = calculatedSlopesArray[0];
    }

    // always when an old and a new slope-value are different, count it as a new turning-point
    if(slopeStatusNewValue != slopeStatusOldValue) {

      frequencyCounter++;

      // save all points, where the slope changes
      valuesWhereSlopeChanged.push({"timestamp": timestampFirst, "z": zValueFirst});

      // store for the second points of the slope-calculation
      // valuesWhereSlopeChanged.push({"timestamp": help[0].timestampLast, "z": help[0].zLast});
    }

    // exchange the old slope-identifier with the one from the newest slope-value
    calculatedSlopesArray[0] = slopeStatusNewValue;
  };

  // method which returns the current number of breaths
  var getBreathFrequency = function() {
    var current = ((frequencyCounter - 1) / 2);
    return current;
  };

  // method which gets back the values of all turning-points - necessary to sign them in the live-diagram
  var getBreathPoints = function() {
    // remove all values which are older than needed in live diagram
    if (valuesWhereSlopeChanged.length > 0 && valuesWhereSlopeChanged[0].timestamp < (new Date().getTime() - liveDurationInMs)) {
      valuesWhereSlopeChanged.shift();
    }

    return valuesWhereSlopeChanged;
  };

  // method to set save set the start-timestamp
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