angular.module('respiratoryFrequency').controller('diagramCtrl', function ($scope, Accelerometer, $interval) {
  var canvas = d3.select("#diagram");
  var HEIGHT = 1000;
  var WIDTH = 500;
  var MARGINS = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
  }
  var xRange = d3.scale.linear()
    .range([MARGINS.left, WIDTH - MARGINS.right])
    .domain([d3.min(lineData, function (d) {
      return d.x;
    }), d3.max(lineData, function (d) {
      return d.x;
    })])

  var lineData = [
    {
      "x": 1,
      "y": 5
    },
    {
      "x": 20,
      "y": 20
    },
    {
      "x": 40,
      "y": 10
    },
    {
      "x": 60,
      "y": 40
    },
    {
      "x": 80,
      "y": 5
    },
    {
      "x": 100,
      "y": 60
    }
  ];

  var xRange = d3.scale.linear()
    .range([40, 400])  //The amount of the svg which will be covered
    .domain([d3.min(sampleData, function (d) {    //Defines the minimum and maximum value by d3 via variable
      return (d.x);
    }), d3.max(sampleData, function (d) {
      return d.x;
    })]);

  var yRange = d3.scale.linear()
    .range([HEIGHT - MARGINS.top, MARGINS.bottom])
    .domain([d3.min(lineData, function (d) {
      return d.y;
    }), d3.max(lineData, function (d) {
      return d.y;
    })]);

  //The axis need to be scaled to the defined ranges
  var xAxis = d3.svg.axis()
    .scale(xRange)
    .tickSize(5)
    .tickSubdivide(true);
  var yAxis = d3.svg.axis()
    .scale(yRange)
    .orient("left")
    .tickSize(5)
    .tickSubdivide(true);
  ;

  //Add the axis to the svg added previously
  canvas.append("svg:g").call(xAxis).attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")";
    canvas.append("svg:g").call(yAxis).attr("transform", "translate(" + (MARGINS.left) + ",0)");

  var circles = canvas.selectAll("circle").data(sampleData);
  circles
    .enter()
    .insert("circle")
    .attr("cx", function (d) {
      return xRange(d.x);
    })
    .attr("cy", function (d) {
      return yRange(d.y);
    })
    .attr("r", 10)
    .style("fill", "red");

});