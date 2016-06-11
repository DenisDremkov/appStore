

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
// $scope.$on('$locationChangeSuccess', function(event) {
// 	  // var element = document.getElementById('admin_wrap');
// 	  console.log( document.getElementById('admin_wrap'))
// 	});
// 	$scope.$on('$locationChangeStart', function(event) {
// 	  // var element = document.getElementById('admin_wrap');
// 	  console.log( document.getElementById('admin_wrap'))
// 	});
	// var app = angular.module('app', []);
	// app.run(function ($rootScope) {
	// 	$rootScope.$on('$locationChangeSuccess', function () {
	// 		console.log('$locationChangeSuccess changed!', new Date());
	// 	});
	// });

	// //remove arhives
	// $scope.removeDay = function() {$http.get("http://localhost:3000/removeDayARHIV")}
	// $scope.removeMonth = function() {$http.get("http://localhost:3000/removeMonthARHIV")}
	// $scope.removeYear = function() {$http.get("http://localhost:3000/removeYearARHIV")}
	// //set arhiv
	// $scope.setDayARHIV = function() {$http.get("http://localhost:3000/setDayARHIV")}
	// $scope.setMonthARHIV = function() {$http.get("http://localhost:3000/setMonthARHIV")}
	// $scope.setYearARHIV = function() {$http.get("http://localhost:3000/setYearARHIV")}

// (function() {
// 		var 	arr = [],
// 				eee1,
// 				eee2,
// 				eee0,
// 				fff1,
// 				fff2,
// 				fff0,
// 				Json;

// 		for (var i = 0; i < 10000000; i++) {
// 			arr.push(i + "dfg4h5d65f4gh54d6fg4h6d54fgh")
// 		}
// 		console.log(arr)
// 		zzz1 = (new Date()).getTime();
// 		// Json = JSON.stringify([1, 'false', false])
// 		JSON.stringify(arr)
// 		zzz2 = (new Date()).getTime();
// 		zzz0 = zzz2 - zzz1;
// 		console.log(zzz0)
		// eee1 = (new Date()).getTime();
		// for (var i = 0; i < 20000000; i++) {
		// 	if (arr[i]==10000000) {
		// 		eee2 = (new Date()).getTime();
		// 		eee0 = eee2 - eee1;
		// 		console.log('массив' + String(eee0))
		// 	}
		// }

		// fff1 = (new Date()).getTime();
		// arr.indexOf(10000000)
		// fff2 = (new Date()).getTime();
		
		
		// fff0 = fff2 - fff1;
		// console.log('индексоф' + String(fff0))

	// })()