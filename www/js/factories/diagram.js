angular.module('respiratoryFrequency').factory('Diagram', function ($interval, Accelerometer, FrequencyCalculator) {
  var HEIGHT = window.innerHeight - 222;
  var WIDTH = window.innerWidth;
  var isDrawing = null;

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

  var toggle = function () {
    if (isDrawing) {
      stop();
    } else {
      start();
    }
  };

  var start = function () {
    isDrawing = $interval(function () {
      canvas.selectAll("*").remove();

      var lineData = Accelerometer.getLiveValues();
      var highsLowsData = FrequencyCalculator.getBreathPoints() || 0;

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
          var timeX = (new Date(d) - Accelerometer.getStartTimestamp());
          return new Date(timeX).getSeconds();
        })
        .tickSubdivide(true);

      var yAxis = d3.svg.axis()
        .scale(yRange)
        .orient("left")
        .tickSize(5)
        .tickFormat(function (d) {
          return Math.floor(d * 1000) / 1000;
        })
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
        .attr("stroke", d3.rgb("#F26C68"))
        .attr("stroke-width", 3)
        .attr("fill", "none");

      var circles = canvas.selectAll("circle").data(highsLowsData);
      circles.enter()
        .insert("circle")
        .attr("cx", function (d) {
          return xRange(d.timestamp);
        })
        .attr("cy", function (d) {
          return yRange(d.z);
        })
        .attr("r", 7)
        .style("fill", d3.rgb("#F26C68"));

      circles.enter()
        .insert("circle")
        .attr("cx", function (d) {
          return xRange(d.timestamp);
        })
        .attr("cy", function (d) {
          return yRange(d.z);
        })
        .attr("r", 4)
        .style("fill", d3.rgb("#FFCA5C"));
    }, 100);
  };

  var stop = function () {
    $interval.cancel(isDrawing);
    isDrawing = null;
  };

  return {
    toggle: toggle
  }
});