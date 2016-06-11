
angular.module('ProductsMainCtrl')

.factory('productsMainFactory', ['$http', '$rootScope',  function($http, $rootScope) {
	'use strict';

	return {
		getStartData : function(scope) {
			scope.$emit('startSpinner');
			$http.get(scope.data.url.startData)
				.success(function(res) {
					'use strict'
					var	startProducts;
					startProducts = res[scope.data.currentTypeProducts];
					scope.data.ALL_PRODUCTS[scope.data.currentTypeProducts] = startProducts;
					scope.data.currentProducts = startProducts;
					scope.data.all_brends = res.allBrends[0];
					scope.data.MIN_AND_MAX_VALUES = res.valMinMax[0];
					//lastPageInPagination
					scope.$watch('data.amountPages', function(newVal) {
						scope.$broadcast('changePagination', newVal)
					})
					scope.data.amountPages = Math.ceil((startProducts.length)/(scope.data.numberProductsView));
					//create start view
					scope.view_mainList = startProducts.slice(0, scope.data.numberProductsView);
					scope.$emit('stopSpinner');
				})
				.error(function(err) {console.log(err)});	
		},
		toggleProducts : function(currentProducts, event, scope) {
			'use strict';
			event.preventDefault();
			var 	url,
					currProductsArr,
					productsInView;
			productsInView = scope.data.numberProductsView;
			currProductsArr = scope.data.ALL_PRODUCTS[currentProducts];
			scope.data.activeItems.currentProducts = currentProducts;
			scope.data.currentTypeProducts = currentProducts;
			//if scope contains this data
			if (currProductsArr) {
				scope.data.currentProducts = currProductsArr;
				scope.data.amountPages = Math.ceil((currProductsArr.length)/(productsInView));
				scope.view_mainList = currProductsArr.slice(0, productsInView)
			}
			//if scope not contains this data
			else {
				scope.$emit('startSpinner');
				url = scope.data.url.getProducts + currentProducts,
				$http.get(url)
					.success(function(res) {
						scope.data.currentProducts = res;
						scope.data.ALL_PRODUCTS[currentProducts] = res;
						scope.data.amountPages = Math.ceil((res.length)/(productsInView));
						scope.view_mainList = res.slice(0, productsInView);
						scope.$emit('stopSpinner');	
					})
					.error(function(err) {console.log(err)});	
			}
			scope.data.activeItems.currentProducts = currentProducts;
		}, 
		toggleBar : function(typeBar, scope) {
			'use strict';
			scope.data.url.bar = "../../template/products/products-" + typeBar + ".html"
			scope.data.activeItems.productsBar = typeBar;
			if(typeBar === 'info')	{
				scope.data.activeItems.mainList = false;

			}
			else {
				scope.data.activeItems.mainList = true;
				scope.view_mainList = scope.data.ALL_PRODUCTS[scope.data.currentTypeProducts].slice( 0, scope.data.numberProductsView );
			} 	
		},
		createView : function(scope) {
			'use strict';
			var i;
			var thisProduct;
			var pushBoolean;
			var arrProducts = scope.data.currentProducts;
			var arrProductsLength  = arrProducts.length;
			var type = scope.data.currentTypeProducts;
			var brands = scope.data.all_brends[type];
			var userSliderValues = {};
			var arrSliders = scope.data.slidersView;
			var arrSlidersLength = arrSliders.length;
			var arrView = [];
			var sale = scope.data.productsWithSale;
			
			function compareValuesSlider(userValSlider, arr, product) {	
				'use strict';
				var i;
				var userValues;
				var productValue;
				var prop;				
				top:
				for (prop in userValSlider) {
					userValues = userValSlider[prop];
					productValue = product[prop];
					//raiting (because reiting - object)
					if ((typeof product[prop]) === "object") {
						productValue = product[prop].val;
					}
					else {
						productValue = product[prop]
					}
					if (	(productValue >= userValues.min)  && 	(productValue <= userValues.max)	 ) {
						continue top;
					}
					else {
						return false
					}
				}
				return true;	
			};
			for ( i = 0; i < arrSlidersLength; i++) {
				userSliderValues[arrSliders[i].nameSlider] = {};
				userSliderValues[arrSliders[i].nameSlider]['min'] = arrSliders[i].min;
				userSliderValues[arrSliders[i].nameSlider]['max'] = arrSliders[i].max;  
			}
			top:
			for (i = 0; i < arrProductsLength; i++) {
				thisProduct = arrProducts[i];
				// test brand
				if (brands[thisProduct.brand]) {
					if (sale) {
						// test sale
						if (thisProduct.sale.bool) {
							//test sliders value
							pushBoolean = compareValuesSlider(userSliderValues, arrView, thisProduct)
						}
						else {
							continue top;
						}
					}
					else {
						//test sliders value
						pushBoolean = compareValuesSlider(userSliderValues, arrView, thisProduct)
					}
					if (pushBoolean) {	
						arrView.push(thisProduct) 
					}
				}	
			}
			scope.view_mainList = arrView;
		},
		addCompare : function(product, scope) {
			'use strict';
			var	i,
					index,
					arr;
			arr = scope.data.compareProducts;
			if (arr.length == 0) {
				arr.push(product);
				scope.data.checkedButtonsCompare[product._id] = true;
			}
			else {
				for (i = 0; i < arr.length; i++) {
					if (arr[i]._id === product._id) {
						index = i;
						console.log(index)
						break;
					}
				}
				if (index || index == 0) {
					arr.splice(index,1);
					delete scope.data.checkedButtonsCompare[product._id];
				}
				else {
					if (arr.length > 8) {
						alert('не более 8')
						// message 
					}
					else {
						arr.push(product);
						scope.data.checkedButtonsCompare[product._id] = true;
					}
				}
			}
		},
		toggleProductBasket : function(product, scope) {
			'use strict';
			var objBasketId = scope.data.checkedButtonsBasket;
			var i;
			var userBasket;
			var newProductBasket;
			if (objBasketId[product._id]) {
				$http.post(scope.data.url.deleteBasket, {
						'userId' : $rootScope.rootUser._id, 
						'productId' : product._id})
						.success(function(doc) {
							if (doc.success) {
								delete objBasketId[product._id]; //uncheck btn
								userBasket = $rootScope.rootUser.basket;
								for (i = 0; i < userBasket.length; i++) {
									if (userBasket[i]._id === product._id) {
										userBasket.splice(i, 1)
										break;
									}
								}
							}
							else {
								$rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
							}
						})
						.error(function(err) {
							 $rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
						})
			}
			else {
				newProductBasket = {};
				newProductBasket.kind = product.kind;
				newProductBasket._id = product._id;
				newProductBasket.brand = product.brand;
				newProductBasket.model = product.model;
				newProductBasket.price = product.price;
				newProductBasket.imgSmall = product.img.small;
				$http.post(scope.data.url.setBasket, {'userId' : $rootScope.rootUser._id, 'product' : newProductBasket})
					.success(function(doc) {
						if (doc.success) {
							objBasketId[product._id] = true; // check btn
							$rootScope.rootUser.basket.push(newProductBasket)
						}
						else {
							$rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
						}
					})
					.error(function(err) {
						 $rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
					})
			}
			
		}
	}
}]);