var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.querySelector("#data .message").innerHTML = "Beschleunigungs-Sensor nicht vorhanden";
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        var message = document.querySelector("#data .message");
        var axes = document.querySelectorAll("#data .axis");
        message.innerHTML = "Beschleunigung wird abgefragt...";



    }
};

window.onload = function(){
  angular.module('respiratoryFrequency', []);
}


