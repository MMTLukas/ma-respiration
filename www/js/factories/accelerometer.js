angular.module('respiratoryFrequency').factory('Accelerometer', function () {
  var z;

  var start = function(){
    if (navigator.accelerometer) {
      var watchID = navigator.accelerometer.watchAcceleration(
        function (acceleration) {
          this.z = Math.floor(acceleration.z * 100) / 100;
        }, function () {
          alert("Beschleunigung konnte nicht abgefragt werden");
        }, {
          frequency: 10
        }).bind(this);
    }
    else {
      return false;
    }
  }

  var getZ = function(){
    return z;
  }

  return {
    start: start,
    getZ: getZ
  }
});