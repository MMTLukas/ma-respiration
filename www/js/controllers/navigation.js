angular.module('respiratoryFrequency').controller('NavigationController', function ($scope) {
  this.tab = 1;

  // Methods for the menu-buttons
  this.selectTab = function(setTab) {
    this.tab = setTab;
  };

  this.isSelected = function(checkTab) {
    return this.tab === checkTab;
  };

  // Methods for the swipe-function
  this.goToLiveView = function() {
    this.selectTab(1);
  };

  this.goToArchiv = function() {
    this.selectTab(2);
  };
});