angular.module('AdminAnalitikaCtrl',[])

.controller('adminAnalitikaCtrl', ['$scope', '$http', 'adminAnalitikaFactory', function($scope,  $http, adminAnalitikaFactory) {
	'use strict';

	$scope.url = {
		getDb : 'http://localhost:3000/getAnalitikaDb'
	}
	$scope.activeView = {
		'arhivMonth' : true,
		'currentMonth' : false
		
	}
	$scope.toggleView = function(nameView) {
		if (nameView === 'currentMonth') {
			$scope.activeView.currentMonth = true;
			$scope.activeView.arhivMonth = false;
		}
		else {
			$scope.activeView.currentMonth = false;
			$scope.activeView.arhivMonth = true;
		}
	}


	//===================ALL MONTH THIS YEAR + PRESENT MONTH==========================
	$scope.dbYear = undefined;
	$scope.numberMonth = undefined;
	$scope.widthGraficItems = { 'width' : undefined	};
	$scope.maximumValueVisits = undefined;
	// set class (height for block )
	$scope.$watch('dbYear', function(newVal) {
		if (newVal) {
			$scope.setHeightItemGraficArhiv = function(indexMonth, typeVisits) {
				var dbVisits = $scope.dbYear[indexMonth][typeVisits];
				var viewHeight = String((300 * dbVisits) / $scope.maximumValueVisits) + 'px';
				return {	'height' : viewHeight }
			}
		}
	})
	
	//================CURRENT MONTH (DETAILS)===============
	$scope.currentMonthDays = undefined;
	$scope.currentMonthDaysWidth = { 'width' : undefined	};
	$scope.daysInCurrentMonth = undefined;
	$scope.maximumValueVisitsMonth = undefined;
	$scope.activeItemGrafic = {
		'date' : undefined
	}
	$scope.$watch('currentMonthDays', function(newVal) {
		console.log(newVal)
		if (newVal) {
			$scope.setHeightItemGraficCurrentMonth = function(indexDay, typeVisits) {
				var dbVisits = $scope.currentMonthDays[indexDay][typeVisits];
				var viewMarginBottom = String((300 * dbVisits) / $scope.maximumValueVisitsMonth) + 'px';
				return {	'margin-bottom' : viewMarginBottom }
			}
		}
	})
	$scope.hoverItemGrafic = function(index, event) {
		if (event === 'over') {	$scope.activeItemGrafic.date = index }
		else { $scope.activeItemGrafic.date = undefined	}
	}
	$scope.showDetails = function(indexMonth) {

		adminAnalitikaFactory.showDetails(indexMonth, $scope)
		// $rootScope.$emit('startSpinner')
		// // var
		// $scope.currentMonth = $scope.dbYear[indexMonth];
		// $scope.daysInCurrentMonth = $scope.currentMonth.days.length;
		// $scope.setHeightItemGraficCurrentMonth = function(indexMonth, typeVisits) {
		// 	var dbHeight = $scope.dbYear[indexMonth][typeVisits];
		// 	var viewHeight = String((300 * dbHeight) / $scope.maximumValueVisits) + 'px';
		// 	return {	'height' : viewHeight }
		// }
		// $rootScope.$emit('stopSpinner')
	}
	adminAnalitikaFactory.getDbYear($scope)
}]);
