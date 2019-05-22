// SPDX-License-Identifier: Apache-2.0

"use strict";

var app = angular.module("application", []);

// Angular Controller
app.controller("appController", function($scope, appFactory) {
  $("#success_holder").hide();
  $("#success_create").hide();
  $("#error_holder").hide();
  $("#error_query").hide();

  $scope.queryAllCannabis = function() {
    appFactory.queryAllCannabis(function(data) {
      var array = [];
      for (var i = 0; i < data.length; i++) {
        parseInt(data[i].Key);
        data[i].Record.Key = parseInt(data[i].Key);
        array.push(data[i].Record);
      }
      array.sort(function(a, b) {
        return parseFloat(a.Key) - parseFloat(b.Key);
      });
      $scope.all_cannabis = array;
    });
  };

  $scope.queryCannabis = function() {
    var id = $scope.cannabis_id;

    appFactory.queryCannabis(id, function(data) {
      $scope.query_cannabis = data;

      if ($scope.query_cannabis == "Could not locate cannabis") {
        console.log();
        $("#error_query").show();
      } else {
        $("#error_query").hide();
      }
    });
  };

  $scope.recordCannabis = function() {
    appFactory.recordCannabis($scope.cannabis, function(data) {
      $scope.create_cannabis = data;
      $("#success_create").show();
    });
  };

  $scope.changeHolder = function() {
    appFactory.changeHolder($scope.holder, function(data) {
      $scope.change_holder = data;
      if ($scope.change_holder == "Error: no cannabis catch found") {
        $("#error_holder").show();
        $("#success_holder").hide();
      } else {
        $("#success_holder").show();
        $("#error_holder").hide();
      }
    });
  };
});

// Angular Factory
app.factory("appFactory", function($http) {
  var factory = {};

  factory.queryAllCannabis = function(callback) {
    $http.get("/get_all_cannabis/").success(function(output) {
      callback(output);
    });
  };

  factory.queryCannabis = function(id, callback) {
    $http.get("/get_cannabis/" + id).success(function(output) {
      callback(output);
    });
  };

  factory.recordCannabis = function(data, callback) {
    //data.location = data.longitude + ", " + data.latitude;

    var cannabis =
      data.id +
      "-" +
      data.strain +
      "-" +
      data.thc +
      "-" +
      data.timestamp +
      "-" +
      data.holder +
      "-" +
      data.grower;

    $http.get("/add_cannabis/" + cannabis).success(function(output) {
      callback(output);
    });
  };

  factory.changeHolder = function(data, callback) {
    var holder = data.id + "-" + data.name;

    $http.get("/change_holder/" + holder).success(function(output) {
      callback(output);
    });
  };

  return factory;
});
