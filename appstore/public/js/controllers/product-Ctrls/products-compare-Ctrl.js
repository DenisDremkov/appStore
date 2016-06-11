
angular.module('ProductsCompareCtrl',[])

.controller('productsCompareCtrl', ['$scope', 'productsCompareFactory',  function($scope, productsCompareFactory) {
		
		$scope.arrCompareProducts = undefined;
		$scope.valueMinMax = undefined;
		$scope.$on('arrCompareProducts', function(event, arr) {
			$scope.arrCompareProducts = arr;
		})
		$scope.sortItem = undefined;
		$scope.reverse = false;
		$scope.sortDown = function(option) {
			if (option === 'battery') {
				console.log('da')
			}
			$scope.sortItem = option;
			$scope.reverse = true;	
		};
		$scope.sortUp = function(option) {
			if (option === 'battery') {
				console.log('da')
			}
			$scope.sortItem = option;
			$scope.reverse = false;
		};
		$scope.deleteCompare = function(id) {
			for (var i = 0; i < $scope.arrCompareProducts.length; i++) {
				if ($scope.arrCompareProducts[i]._id === id) {
					$scope.$emit('removeCheckButton', id)
					$scope.arrCompareProducts.splice(i, 1);
					break;
				}
			}
		}
		$scope.addBasket = function(id) {

		}
		$scope.$watch('arrCompareProducts', function(newVal) {
			$scope.valueMinMax = productsCompareFactory.selectMinMaxValues(newVal);
			$scope.setClassMinMaxValues = function(option, value) {
				return productsCompareFactory.setClass(option, value, $scope)
			};				
		})
}]);




