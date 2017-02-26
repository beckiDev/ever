// Code goes here
'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    $scope.search = function() {
      SearchService.query(function(repositories) {
        $scope.repositories = repositories;
        socket.syncUpdates('repositories', $scope.repositories);
      })

    }
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }
  }

function SearchService($resource) {
  'ngInject';
  return $resource('https://api/github.com/search/ever', {
      id: '@_id'
    })
  };

export default angular.module('everstringApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
