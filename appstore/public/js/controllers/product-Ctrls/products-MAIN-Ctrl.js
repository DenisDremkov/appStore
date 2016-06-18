

angular.module('ProductsMainCtrl',[])

.controller('productsMainCtrl', ['$scope', '$rootScope', 'productsMainFactory', '$timeout', function($scope, $rootScope, productsMainFactory, $timeout) {
	'use strict';
	//MAIN DATA STORE
	
	$scope.data = {
		firstLoadDb : true,
		numberProductsView : 8,
		//===============CONSTANTS==================================================
		ALL_PRODUCTS : {}, 																										
		MIN_AND_MAX_VALUES : undefined,
		// values for checkbox in "search"
		all_brends : undefined,	
		//===============CURRENT PRODUCTS===========================================
		currentTypeProducts : "laptop",
		// full list current products
		currentProducts : undefined,												
		// all brends for current kind products
		brendsThisProducts : undefined, 											
		//	value of last page in pagination
		amountPages : undefined,													
		// current page in pagination
		currentPage : undefined,													
		//===================SALE=======================================================
		carouselShow : false,
		carouselView : undefined,
		//===================SEARCH======================================================
		//sliders created in Search-controller	
		slidersView : undefined,													
		//filter
		search : {
			searchModel : undefined
		},
		orderByListFromSearch : {
			nameProp : '-raiting.val'
		},
		productsWithSale : false,
		//====================COMPARE====================================================	
		compareProducts : [],
		
		//=====================INFO=====================================================
		// productInfo : undefined,
		currentProductInfo : undefined, 		
		//url
		url : {
			getDb : 'http://localhost:3000/getDb',
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
			currentProducts : "laptop",
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
	productsMainFactory.getData('laptop', $scope);
	
	//toggle products (tablet, laptop)
	$scope.toggleProducts = function(typeProducts, event) {
		$scope.data.compareProducts = [];
		$scope.data.checkedButtonsCompare = {};
		$scope.data.currentProductInfo = undefined;
		productsMainFactory.toggleBar('sale', $scope);
		productsMainFactory.getData(typeProducts, $scope, event)
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
	// $scope.carouselDuration = 3;
	// $scope.stopCarousel = function(action) {
	// 	if (action === 'enter') {
	// 		console.log('ent')
	// 		$scope.carouselDuration = 1000;
	// 	}
	// 	else {
	// 		console.log('leave')
	// 		$scope.carouselDuration = 3
	// 	}
		
	// }
	// change view от каждого скоупа по отдельности
	$scope.$on('newPageFromPagination', function(e, page) {
		productsMainFactory.createView($scope, page)
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
	//watch for change number compare products that animate number
	$scope.$watch('data.compareProducts.length', function(newVal, oldVal) { // rootscope
		if (newVal && newVal > oldVal) {
			$timeout(function() {
				$('#animate_number_compare').addClass('animate_number_compare')
			},1000)
			$timeout(function() {
				$('#animate_number_compare').removeClass('animate_number_compare')
			},3000)
		}
	})
	
	$scope.toggleProductBasket = function(product) {
		console.log('da')
		if($rootScope.rootUser.rights === 'user') {
			productsMainFactory.toggleProductBasket(product, $scope)} 
		else { $rootScope.$emit('showWebAssistant', "Вам необходимо зарегестрироваться") }
	}
}]);