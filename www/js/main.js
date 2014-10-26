//On phonegap apps the load event get fired before the deviceready event
window.onload = function () {
  respiratoryFrequency.init();
};

window.respiratoryFrequency = {
  init: function () {
    //Only because for easier developing, check if we are on a desktop browser or on a mobile plattform
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      document.addEventListener("deviceready", this.start, false);
    } else {
      this.start();
    }
  },
  start: function () {
    //Because of phonegap and the needed plugins we have to start angular manually
    angular.bootstrap(document, ['respiratoryFrequency']);
  }
}

angular.module('respiratoryFrequency', []);
