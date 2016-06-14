
angular.module('ProductsSearchCtrl',[])

.controller('productsSearchCtrl', ['$scope', 'productsSearchFactory',  function($scope, productsSearchFactory) {
		$scope.$on('createNewSliders', function() {
			productsSearchFactory.createNewSliders($scope, $scope.data)
		});
		$scope.$on('createNewCheckox', function() {
			$scope.data.brendsThisProducts = $scope.data.all_brends[$scope.data.currentTypeProducts]
		});				
		$scope.toggleCheckBox = function(brend) {
			$scope.data.brendsThisProducts[brend] = !$scope.data.brendsThisProducts[brend];
			$scope.$emit('newValuesCheckbox');
		};
		$scope.checkAllBrends = function() {
			var obj = $scope.data.brendsThisProducts;
			for (prop in obj) {obj[prop] = true}
			$scope.$emit('newValuesCheckbox');
		}
		$scope.clearCheckAllBrends = function() {
			var obj = $scope.data.brendsThisProducts;
			for (prop in obj) {obj[prop] = false}
			$scope.$emit('newValuesCheckbox');
		};
		$scope.inspectSale = function() {
			$scope.$emit('toggleSale');
		}
}]);




