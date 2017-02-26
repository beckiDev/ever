// Code goes here

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  $http;
  socket;
  awesomeThings = [];
  newThing = '';
  SearchService;

  /*@ngInject*/
  constructor($http, $scope, socket, SearchService) {
    this.$http = $http;
    this.socket = socket;
    $scope.search = function() {
      SearchService.query(function(repositories) {
        $scope.repositories = repositories;
        //socket.syncUpdates('repositories', $scope.repositories);
        console.log(repositories)
      })

    }
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }


  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
        this.socket.syncUpdates('thing', this.awesomeThings);
      });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}
function SearchService($resource) {
  'ngInject';
  return $resource('https://api/github.com/repositories/', {
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
