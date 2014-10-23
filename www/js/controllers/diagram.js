angular.module('respiratoryFrequency').controller('diagramCtrl', function ($scope, Accelerometer, $interval) {
    var HEIGHT = window.innerHeight - 222;
    var WIDTH = window.innerWidth;

    var canvas = d3.select("#diagram")
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    var MARGINS = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    setInterval(function () {
        canvas.selectAll("*").remove();

        var lineData = Accelerometer.getLiveValues();

        var xRange = d3.scale.linear()
            .range([MARGINS.left, WIDTH - MARGINS.right])
            .domain([d3.min(lineData, function (d) {
                return d.timestamp;
            }), d3.max(lineData, function (d) {
                return d.timestamp;
            })]);

        var yRange = d3.scale.linear()
            .range([HEIGHT - MARGINS.top, MARGINS.bottom])
            .domain([d3.min(lineData, function (d) {
                return d.z;
            }), d3.max(lineData, function (d) {
                return d.z;
            })]);

        var xAxis = d3.svg.axis()
            .scale(xRange)
            .tickSize(5)
            .tickFormat(function (d) {
                return new Date(d).getSeconds();
            })
            .tickSubdivide(true);

        var yAxis = d3.svg.axis()
            .scale(yRange)
            .orient("left")
            .tickSize(5)
            .tickSubdivide(true);

        canvas.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
            .call(xAxis);
        canvas.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (MARGINS.left) + ",0)")
            .call(yAxis);

        //Line generator function
        //The coordinates will get transformed according to the x- and yRange
        var lineFunction = d3.svg.line()
            .x(function (d) {
                return xRange(d.timestamp);
            })
            .y(function (d) {
                return yRange(d.z);
            })
            .interpolate("basis");  //linear -> straight lines, basis -> round lines

        canvas.append("svg:path")
            .attr("d", lineFunction(lineData))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("fill", "none")
    }, 200);
});