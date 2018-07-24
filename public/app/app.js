(function () {

  'use strict';
  var app = angular.module('chat', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.modal', 'ngCookies']);

  app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', configRoutes]);

  function configRoutes ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'homeCtrl'
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'adminCtrl'
      })

    $urlRouterProvider.otherwise('/home');

    $locationProvider.html5Mode({
      enabled: true
    });

  };

  app.run(['$rootScope', '$timeout', '$state', '$cookies', function ($rootScope, $timeout, $state, $cookies) {

  }]);

}());
