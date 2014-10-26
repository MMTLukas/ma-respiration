angular.module('respiratoryFrequency').controller('MenuController', function ($scope) {
  this.tab = 1;

  this.selectTab = function(setTab) {
    this.tab = setTab;
  };

  this.isSelected = function(checkTab) {
    return this.tab === checkTab;
  };

  this.goToLiveView = function() {
    this.selectTab(1);
  };

  this.goToArchiv = function() {
    this.selectTab(2);
  };
});