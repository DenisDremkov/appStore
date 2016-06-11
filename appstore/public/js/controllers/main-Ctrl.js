

angular.module('MainCtrl',[])

.controller('mainCtrl', ['$scope',  '$rootScope', function($scope, $rootScope) {
	'use strict';
		//WEB ASSISTANT
	//====================================================
	$scope.webAssistant = 0;
	$scope.webAssistantMessage = undefined;
	$rootScope.$on('showWebAssistant', function(e, message) {
		$scope.webAssistantMessage = message;
		$scope.webAssistant++;
	})
		//SPINNER BG
	//====================================================
	$rootScope.mainSpinner = false;
	$rootScope.$on('startSpinner', function() {
		$rootScope.mainSpinner = true;
		// $('body').css('overflow','hidden')
	})
	$rootScope.$on('stopSpinner', function() {
		$rootScope.mainSpinner = false;
		// $('body').css('overflow','visible')
	})
	



	$scope.deleteUsers = function() {$http.get('http://localhost:3000/deleteUsers')}
	$scope.addUsers = function() {$http.get('http://localhost:3000/addRandomUsers')}

	
}]);
