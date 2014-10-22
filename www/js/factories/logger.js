angular.module('respiratoryFrequency').factory('Logger', function () {

    var startTimestamp = 0, timeFrame = 60 * 1000; // seconds
    var data = ["Timestamps,z-Value"];
    var loggingActive;

    var initializeStart = function() {
        startTimestamp = Date.now();
        loggingActive = true;
    }

    var getStartTimestamp = function() {
        return startTimestamp;
    }

    var getTimeFrame = function() {
        return timeFrame;
    }

    // activate or deactivate logger
    var getLoggingActive = function() {
        return loggingActive;
    }

    var setLoggingActive = function(value) {
        loggingActive = value;
    }

    var collectData = function(z, currentTimestamp) {
        data.push(currentTimestamp + "," + z);
    }

    var gotFS = function(fs) {
        fs.root.getFile('log.csv', {create: true}, gotFileEntry, fail);
    }

    var gotFileEntry = function(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    var gotFileWriter = function(fileWriter) {
        fileWriter.onwriteend = function(e) {
            alert('Write completed.');
        };

        fileWriter.onerror = function(e) {
            alert('Write failed: ' + e.toString());
        };

        fileWriter.write(data.join([separator = "\n"]));
    }

    var fail = function(err) {
        alert("Error code: " + err.code);
    }

    var log = function() {

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    return {
        collectData: collectData,
        initializeStart: initializeStart,
        getStartTimestamp: getStartTimestamp,
        getTimeFrame: getTimeFrame,
        getLoggingActive: getLoggingActive,
        setLoggingActive: setLoggingActive,
        log: log
    }
});