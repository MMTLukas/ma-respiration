var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        //document.querySelector("#data .message").innerHTML = "Beschleunigungs-Sensor nicht vorhanden";
        var axes = document.querySelectorAll("#data .axis");
        axes[0].innerHTML = "X: 0.00";
        axes[1].innerHTML = "Y: 0.00";
        axes[2].innerHTML = "Z: 0.00";

        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        var message = document.querySelector("#data .message");
        var axes = document.querySelectorAll("#data .axis");
        message.innerHTML = "Beschleunigung wird abgefragt...";

        if (navigator.accelerometer) {
            var watchID = navigator.accelerometer.watchAcceleration(
                function (acceleration) {
                    var x = Math.floor(acceleration.x * 100) / 100;
                    var y = Math.floor(acceleration.y * 100) / 100;
                    var z = Math.floor(acceleration.z * 100) / 100;
                    message.innerHTML = "";
                    axes[0].innerHTML = "X: " + x;
                    axes[1].innerHTML = "Y: " + y;
                    axes[2].innerHTML = "Z: " + z;
                }, function () {
                    alert("Beschleunigung konnte nicht abgefragt werden");
                }, {
                    frequency: 10
                });
        }
        else {
            message.innerHTML = "Beschleunigungs-Sensor nicht vorhanden";
        }
    }
};


