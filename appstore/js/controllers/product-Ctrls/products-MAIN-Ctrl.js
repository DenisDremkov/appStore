

angular.module('ProductsMainCtrl',[])

.controller('productsMainCtrl', ['$scope', '$rootScope', 'productsMainFactory', function($scope, $rootScope, productsMainFactory) {
	'use strict';
	//MAIN DATA STORE
	
	$scope.data = {
		numberProductsView : 8,
		//===============CONSTANTS==================================================
		ALL_PRODUCTS : {}, 																										
		MIN_AND_MAX_VALUES : undefined,
		// values for checkbox in "search"
		all_brends : undefined,	
		//===============CURRENT PRODUCTS===========================================
		currentTypeProducts : "tablet",
		// full list current products
		currentProducts : undefined,												
		// all brends for current products
		brendsThisProducts : undefined, 											
		//	value of last page in pagination
		amountPages : undefined,													
		// current page in pagination
		currentPage : undefined,													
		//===================SALE=======================================================
		carouselSale : [1,2,3,4,5],
		//===================SEARCH======================================================
		//sliders created in Search-controller	
		slidersView : undefined,													
		//filter
		search : {
			searchBrend : undefined,
			searchModel : undefined
		},
		productsWithSale : false,
		//====================COMPARE====================================================	
		compareProducts : [],
		
		//=====================INFO=====================================================
		// productInfo : undefined,
		currentProductInfo : undefined, 		
		//url
		url : {
			startData : 'http://localhost:3000/getStartData',
			bar : '../../template/products/products-sale.html',
			getProducts : 'http://localhost:3000/get',
			getComments : 'http://localhost:3000/getComments',
			setComment : 'http://localhost:3000/setComment',
			setReiting : 'http://localhost:3000/setReiting',
			setBasket : 'http://localhost:3000/setProductBasket',
			deleteBasket : 'http://localhost:3000/deleteProductBasket'
		},
		//===================ACTIVE ITEMS====================================================
		activeItems : {
			currentProducts : "tablet",
			productsBar : "sale",
			mainList : true
		},
		//buttons basket
		checkedButtonsCompare : {},
		checkedButtonsBasket : {},
		raitings : undefined,	//ранее рейтингованные товары (в предыдущих сессиях и в этой)
	};

	//VIEW
	$scope.view_mainList = undefined;
	
	//after first load page  create view (tablets)
	productsMainFactory.getStartData($scope);
	
	//toggle products (tablet, laptop)
	$scope.toggleProducts = function(typeProducts, event) {
		productsMainFactory.toggleProducts(typeProducts, event, $scope)
		if ($scope.data.activeItems.productsBar === "search") {
			$scope.$broadcast('createNewSliders');
			$scope.$broadcast('createNewCheckox');
		}
	};
	//toggle bar (sale, search, compare, info)
	$scope.toggleBar = function(typeBar, event) {
		event.preventDefault();
		productsMainFactory.toggleBar(typeBar, $scope);
	}
	$scope.showInfo = function(product) {
		$scope.data.url.bar = "../../template/products/products-info.html"
		$scope.data.activeItems.productsBar = 'info';
		$scope.data.activeItems.mainList = false;
		$scope.data.currentProductInfo = product;
	}
	$scope.addCompare = function(product) {
		productsMainFactory.addCompare(product, $scope)
	}	
	//listeners for change view
	$scope.$on('$includeContentLoaded', function() {
		if ($scope.data.activeItems.productsBar === "search") {
			$scope.$broadcast('createNewSliders');
			$scope.$broadcast('createNewCheckox');
		}
		if ($scope.data.activeItems.productsBar === "info") {
			$scope.$broadcast('showInfoProduct', $scope.data.currentProductInfo)
		}
		if ($scope.data.activeItems.productsBar === "compare") {
			$scope.$broadcast('arrCompareProducts', $scope.data.compareProducts);
			$scope.data.activeItems.mainList = false;
		}
	})
	
	//от каждого скоупа по отдельности
	$scope.$on('newPageFromPagination', function() {
		productsMainFactory.createView($scope)
	});
	$scope.$on('newValuesCheckbox', function() {
		productsMainFactory.createView($scope)
	});
	$scope.$on('newValuesSliders', function() {
		productsMainFactory.createView($scope)
	});
	$scope.$on('toggleSale', function() {
		productsMainFactory.createView($scope)
	});
	$scope.$on('removeCheckButton', function(e, id) {
		delete $scope.data.checkedButtonsCompare[id];
	});

	// add and delete product to  basket
	//set product to compare controller
	$scope.$watch('rootUser', function(newVal) { // rootscope
		if (newVal.basket) {
			var arrBasketProducts = newVal.basket;
			for (var i = 0; i < arrBasketProducts.length; i++) {
				$scope.data.checkedButtonsBasket[arrBasketProducts[i]._id] = true;
			}
		}
	})
	$scope.toggleProductBasket = function(product) {
		if($rootScope.rootUser.rights === 'user') {
			productsMainFactory.toggleProductBasket(product, $scope)} 
		else { $rootScope.$emit('showWebAssistant', "Вам необходимо зарегестрироваться") }
	}
}]);