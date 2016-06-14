angular.module('AdminMainCtrl',[])

.controller('adminMainCtrl', ['$scope', '$http', 'adminMainFactory', function($scope,  $http, adminMainFactory) {
	'use strict';
	$scope.currentTab = 'products';
	$scope.db = {
		products : undefined,
		users : undefined,
		analitika: undefined
	};
	$scope.url = 'http://localhost:3000/get';
	$scope.currentTemplate = 'template/admin/admin-products.html';
	// getStartData
	$scope.toggleTabs = function(typeDb, event) {
		event.preventDefault();
		switch (typeDb) {
			case "products":
				$scope.currentTab = 'products';
				$scope.currentTemplate = 'template/admin/admin-products.html';
				break;
			case "users":
				$scope.currentTab = 'users';
				$scope.currentTemplate = 'template/admin/admin-users.html';
				break;
			case "analitika":
				$scope.currentTab = 'analitika';
				$scope.currentTemplate = 'template/admin/admin-analitika.html';
				break;
		}
	}
}]);
	// случайные значения включительно по сегодняшний или вчерашний день
// var setAllArhivRandomValues = function  () {	
// 	'use strict';
// 	var objDay;
// 	var thisMonth;
// 	var dayinMonth;
// 	var i;
// 	var j;
// 	var k;
// 	var m;
// 	var y;
// 	var summVisitsMonth = 0;
// 	var summUniqVisitsSumm = 0;
// 	var arrMonth = [31, 28, 31, 30, 31]
// 	var arrMonthDays;
// 	var arrYear = [];
// 	var arrYearJSON = [];
// 	var thisMonthJSON;
// 	var todayDate;
// 	console.log('kkkk')
// 	for (i = 0; i <  arrMonth.length; i++) {
// 		dayinMonth = arrMonth[i];
// 		summVisitsMonth = 0
// 		summUniqVisitsSumm = 0
// 		arrMonthDays = [];
// 		//create all days for this month
// 		for (j = 1; j < dayinMonth; j++) {
// 			objDay = {};
// 			objDay.day = j;
// 			objDay.visits = Math.ceil(Math.random()*50) + 100;
// 			summVisitsMonth += objDay.visits;	
// 			objDay.uniqVisits = Math.ceil(Math.random() * 100);
// 			summUniqVisitsSumm += objDay.uniqVisits
// 			arrMonthDays.push(objDay)	
// 		}
// 		//summ visits and summ uniq visits
// 		thisMonth = {};
// 		thisMonth.month = i;
// 		thisMonth.visits = summVisitsMonth;
// 		thisMonth.uniqVisits = summUniqVisitsSumm;
// 		thisMonth.days = arrMonthDays;
// 		thisMonthJSON = JSON.stringify(thisMonth)
// 		arrYear.push(thisMonth)
// 		arrYearJSON.push(thisMonthJSON)
		
// 		// models.analitikaYear.find({}, function(err, data) {
// 		// 	// for (y = 0; y < arrYear.length; y++) {
// 		// 	data[0].months.push(thisMonthJSON)
// 		// 	// }
// 		// 	data[0].save(function(err, doc) {
// 		// 		//save may
// 		// 		if (doc &&  (i == 4)) {
// 		// 			models.analitikaMonth.find({}, function(err, data) {
// 		// 				if (data[0]) {
// 		// 					todayDate = new Date().getDate();
// 		// 					console.log(todayDate)
// 		// 					arrMonthDays.length = todayDate
// 		// 					// for ( m = 0; m < (todayDate-1); m++) {
// 		// 					data[0].days = (arrMonthDays)
// 		// 					data[0].save()
// 		// 					// }
// 		// 				}
// 		// 			})
// 		// 		}
// 		// 	})
// 		// })
// 	}
// 	console.log(arrYear)
// 	console.log(arrYearJSON)
// }
// setAllArhivRandomValues()