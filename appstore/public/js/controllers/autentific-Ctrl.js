

angular.module('AutentificCtrl',[])

.controller('autentificCtrl', ['$scope', 'autentificFactory', 'Upload', '$rootScope',   function($scope, autentificFactory, Upload, $rootScope) {
	'use strict';
	
	// autentificated user
	$rootScope.rootUser = {};	
	// login and registr user
	$scope.user = {
		"username" : undefined,
		"password" : undefined,
		"password_" : undefined,
		"email" : 'eee@eee.ua',
		"session" : false
	};
	//image avatar
	$scope.avatarImg = undefined,
	//active items
	$scope.activItems = {
		"loginMain" : false,
		"private_account" : true,
		"loginForm" : true,
		"registrForm" : false,
		"tab_login" : true,
		"tab_registr" : false
	};
	//url
	$scope.url = {
		"session" : "http://localhost:3000/inspectSession",
		"login" : "http://localhost:3000/login",
		"registr" : "http://localhost:3000/registr",
		"logOut" : "http://localhost:3000/logOut",
		"postAvatar" : "http://localhost:3000/postAvatar",
		"postBasket" : "http://localhost:3000/postProductBasket",
		"deleteBasket" : "http://localhost:3000/deleteProductBasket"
	};

	autentificFactory.inspectSession($scope);

	$scope.login = function(action) {
		autentificFactory.login($scope)
	};
	$scope.logOut = function() {
		autentificFactory.logOut($scope)
	};	
	$scope.toggleTabs = function(nameTab) {
		autentificFactory.toggleTabs(nameTab, $scope)
	};
	$scope.showLoginForm = function() {
		$scope.activItems.loginMain = true;
	};
	$scope.closeLoginForm = function() {
		$scope.activItems.loginMain = false;
	};	
	$scope.registr = function() {
		autentificFactory.registr($scope, Upload)
	};	
}]);
