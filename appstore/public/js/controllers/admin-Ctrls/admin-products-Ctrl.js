angular.module('AdminProductsCtrl',[])

.controller('adminProductsCtrl', ['$scope', 'adminProductsFactory', '$http', 'Upload', function($scope, adminProductsFactory,  $http, Upload) {
	'use strict';
	//constanta
	$scope.DB = {
		'tablet' : {
			russ : "Планшеты",
			value : undefined,
			img : 'tablet.png'
		},
		'laptop' : {
			russ : "Ноутбуки",
			value : undefined,
			img : 'laptop.png'
		}
	}
	$scope.currentDb = {
		name : undefined
	}
	$scope.numProductsInView = 10; // for pagination
	$scope.view = undefined;

	$scope.$watch('view', function(newVal) {
		if (newVal) {
			var lastPagePagination = Math.ceil(newVal.length/$scope.numProductsInView);
			$scope.$broadcast('changePagination', lastPagePagination)
			$scope.viewWithPagination = $scope.view.slice(0, $scope.numProductsInView)	
		}
		
	})
	$scope.$on('newPageFromPagination', function(e, pageNumber) {
		// console.log(pageNumber)
		var begin = (pageNumber-1)*$scope.numProductsInView;
		var end =  begin + $scope.numProductsInView
		$scope.viewWithPagination = $scope.view.slice(begin, end)	
	});
	$scope.viewWithPagination = undefined;
	$scope.productAction = {
		search : true,
		add : false,
		edit : false
	} 
	$scope.search = {
		id : undefined,
		brand : undefined,
		model : undefined
	}
	$scope.product_id = undefined;
	$scope.product_val = {
		kind : undefined,
		brand : undefined,
		model : undefined,
		guarantee : undefined,
		price : undefined,
		operSystem : undefined,
		cpu : undefined,
		numCores : undefined,
		memory : undefined,
		ramMemory : undefined,
		screenDiagonal : undefined,
		screenResolution : undefined,
		frontCamera : undefined,
		mainCamera : undefined,
		battery : undefined,
		colours : [],
		img : {
			small : undefined,
			big : undefined,
			slide1 : undefined,
			slide2 : undefined,
			slide3 : undefined,
			slide4 : undefined
		},
		sale : {
			bool : undefined,
			discount : undefined,
			descript : undefined
		},
		raiting : {
			val : 1,
			num : 1,
			sum : 1
		},
		comments : {
			sumComments : undefined,
			comments : [{
				user : undefined,
				date : undefined,
				text : undefined
			}]
		}
	};
	$scope.product_newColour = undefined;
	$scope.product_sale =  {
		'bool' : true,
		'discount' : undefined,
		'descript' : undefined
	}
	$scope.product_img = {
		small 		: {'file' : undefined, 'load_img_begin' : false, 'loaded' : false}, 
		big 			: {'file' : undefined, 'load_img_begin' : false, 'loaded' : false}, 
		slide1 		: {'file' : undefined, 'load_img_begin' : false, 'loaded' : false}, 
		slide2 		: {'file' : undefined, 'load_img_begin' : false, 'loaded' : false}, 
		slide3 		: {'file' : undefined, 'load_img_begin' : false, 'loaded' : false}, 
		slide4 		: {'file' : undefined, 'load_img_begin' : false, 'loaded' : false} 
		// slide5 		: {'file' : undefined, 'load_img_begin' : false, 'loaded' : false, 'btn_add' : true, 'btn_check' : false} 
	};
	$scope.valid = {
		kind : 					{'value' : true, 'pattern' : '^[a-zA-Z0-9]+$'},
		brand : 					{'value' : true, 'pattern' : '^[a-zA-Z0-9]+$'},
		model : 					{'value' : true, 'pattern' : '^[a-zA-Z0-9]+$'},
		guarantee :  			{'value' : true, 'pattern' : '^[ 0-9]+$'},
		price : 					{'value' : true, 'pattern' : '^[ 0-9]+$'},
		operSystem : 			{'value' : true, 'pattern' : undefined},
		cpu : 					{'value' : true, 'pattern' : '^[a-zA-Z0-9]+$'},
		numCores : 				{'value' : true, 'pattern' : '^[ 0-9]+$'},
		memory : 				{'value' : true, 'pattern' : '^[ 0-9]+$'},
		ramMemory : 			{'value' : true, 'pattern' : '^[ 0-9]+$'},
		screenDiagonal : 		{'value' : true, 'pattern' : '\-?\d+(\.\d{0,})?'},
		screenResolution : 	{'value' : true, 'pattern' : undefined},
		frontCamera : 			{'value' : true, 'pattern' : '\-?\d+(\.\d{0,})?'},
		mainCamera : 			{'value' : true, 'pattern' : '\-?\d+(\.\d{0,})?'},
		battery : 				{'value' : true, 'pattern' : '^[ 0-9]+$'},
		colour : 				{'value' : true, 'pattern' : '^#?([a-f0-9]{6}|[a-f0-9]{3})$'},
		sale : 					{'value' : true, 'pattern' : '^[ 0-9]+$'}
	};
	$scope.valid_btn = {
		btn_setProductDb : true,
		btn_setImgDb : false
	};
	$scope.url = 'http://localhost:3000';
	$scope.serverAnswer = undefined;
	
	$scope.getDb = function(nameDb, event) {
		$scope.product_val.kind = nameDb;
		$scope.currentDb.name = nameDb;
		event.preventDefault()
		adminProductsFactory.getDb(nameDb, $scope)
	}
	// listeners
	$scope.$on('changeDbAddNew', function(e, data) {
		 $scope.product_val.kind = data;
	});
	$scope.toggleView = function(nameView) {
		switch (nameView) {
			case "search":
				$scope.productAction.search = true;
				$scope.productAction.add = false;
				$scope.productAction.edit = false;
				break;
			case "add":
				$scope.productAction.search = false;
				$scope.productAction.add = true;
				$scope.productAction.edit = false;
				break;
			case "edit":
				$scope.productAction.search = false;
				$scope.productAction.add = false;
				$scope.productAction.edit = true;
				break;
		}
	};
	// validation - class for input
	$scope.setClass = function(prop) {
		if($scope.valid[prop].value) {return 'valid_input'}
		else {return 'invalid_input'}
	}
	// validation input
	$scope.validInput = function(prop) {
		adminProductsFactory.validationInput(prop, $scope)
	};
	// colors
	$scope.addNewColor = function() {
		var index;
		index = $scope.product_val.colours.indexOf($scope.product_newColour);
		if (index < 0) {$scope.product_val.colours.push($scope.product_newColour)}
	};
	$scope.removeColor = function(color) {
		var index;
		index = $scope.product_val.colours.indexOf(color);
		$scope.product_val.colours.splice(index, 1)
	};
	$scope.validationAddColor = function() {
		adminProductsFactory.validationAddColor($scope)
	}
	$scope.setProductDb = function() {
		adminProductsFactory.setProductDb($scope)
	}
	$scope.setImgDb = function() {
		adminProductsFactory.setImgDb($scope, Upload)
	};
	$scope.deleteProduct = function(id) {
		adminProductsFactory.deleteProduct(id, $scope)

	}
	$scope.editProduct = function(id) {
		adminProductsFactory.editProduct(id, $scope)

	}


	// // watchers && listeners
	// 
	// $scope.$watch('img.imgMainSmall', function() {
	// 	console.log('www')
	// })
	//добавить удалить готовый
	var toggle = true;
	$scope.addgotovii = function() {
		console.log(toggle)
		if (toggle) {
			$scope.product_val.brand = 'brandTest',
			$scope.product_val.model = 'modelTest',
			$scope.product_val.guarantee = 12,
			$scope.product_val.price = 555,
			$scope.product_val.operSystem = 'operSystemtest',
			$scope.product_val.cpu = 'cpuTest',
			$scope.product_val.numCores = 6,
			$scope.product_val.memory = 9,
			$scope.product_val.ramMemory = 6,
			$scope.product_val.screenDiagonal = 10.5,
			$scope.product_val.screenResolution = '1024*768',
			$scope.product_val.frontCamera = 0.5,
			$scope.product_val.mainCamera = 11.3,
			$scope.product_val.battery = 2500,
			$scope.product_colours = ['#111', '#555', '#999'],
			$scope.product_sale.bool = true;
			$scope.product_sale.discount	= 5,
			$scope.product_sale.descript = 'descript descriptions dfgsdfsgdfgs dfgsdffff ffffdffff fffffffff ffffffffff ffffffffff ffffffffffff fffffffffff ffffffffffffff ffffff'
			toggle = false
		}
		else {
			$scope.product_val.brand = undefined,
			$scope.product_val.model = undefined,
			$scope.product_val.guarantee = undefined,
			$scope.product_val.price = undefined,
			$scope.product_val.operSystem = undefined,
			$scope.product_val.cpu = undefined,
			$scope.product_val.numCores = undefined,
			$scope.product_val.memory = undefined,
			$scope.product_val.ramMemory = undefined,
			$scope.product_val.screenDiagonal = undefined,
			$scope.product_val.screenResolution = undefined,
			$scope.product_val.frontCamera = undefined,
			$scope.product_val.mainCamera = undefined,
			$scope.product_val.battery= undefined
			$scope.product_colours = undefined,
			$scope.product_sale.bool = undefined;
			$scope.product_sale.discount	= undefined,
			$scope.product_sale.descript = undefined
			toggle = true
		}		
	};
}]);




	// angular.module('appPhone')

	// .directive('adminForm', function($http, $timeout) {
	//   return {
	//   	restrict:"E",
	//    templateUrl: './../../template/admin.html',
	//     link:function(scope,element,attrs) {
	//     	scope.adminThisPhone = null;
	//     	scope.newColor = null;
	//     	scope.editColor = null;
	//     	scope.dangerMessage = null;
	//     	scope.adminTabs = {
	//     		goods: true,
	//     		users: true
	//     	};
	//     	scope.adminThisPhone = {
	// 			brend: null,
	// 			model: null,
	// 			processor: null,
	// 			display: null,
	// 			camera: null,
	// 			memory: null,
	// 			color: [],
	// 			otherDescr: null,
	// 			reiting: null,
	// 			price: null,
	// 			img: 'img/1/1.png',
	// 			imgmore: "img/1/1.png, img/1/2.png, img/1/3.png",
	// 			comments: [
	// 				{
	// 					user: null,
	// 					time: null,
	// 					text: null
	// 				}
	// 			]
	// 		}
	//     	scope.adminTabsToggle = function(select, event) {
	//     		if (select==="goods") {
	//     			scope.adminTabs.goods = true;
	//     			scope.adminTabs.users = true;
	//     		}
	//     		else {
	//     			scope.adminTabs.goods = true;
	//     			scope.adminTabs.users = true;
	//     		}
	//     		$(event.target).parent().addClass('active');
	//     		$(event.target).parent().siblings().removeClass('active')
	//     	};
	//     	scope.adminEdit = function(phone) {
	//     		scope.adminThisPhone = phone;
	//     	};
	// 		scope.adminDelete = function(id) {
	// 			var id_ = {id:id};
	// 			// удаляем сам телефон из бд
				
	// 			$http.post('https://mobile-face-it.herokuapp.com/deleteGoods', id_)
	// 			// $http.post('http://localhost:3000/deleteGoods', id_)
	// 			.success(function(result) {
	// 				scope.dangerMessage = result +"Корзины польз-ей обновлены";
	// 				$timeout(function() {
	// 					scope.dangerMessage = " ";
	// 				}, 2500)
	// 			})
 //            .error(function(error) {
 //            	console.log(error)
 //            });
 //            // удаляем телефон из корзин покупателей
 //            $http.post('https://mobile-face-it.herokuapp.com/deleteBasketGoods', id_)
 //            // $http.post('http://localhost:3000/deleteBasketGoods', id_)
	// 			.success(function(result) {
	// 				console.log(result)
	// 			})
 //            .error(function(error) {
 //            	console.log(error)
 //            });
 //            //scope
 //            var arrPhones1 = scope.main_Goods_constant;
	// 			var arrPhones2 = scope.main_Goods;
 //            for (var i = 0; i < arrPhones1.length; i++) {
 //            	if (arrPhones1[i]._id == id) {
 //            		arrPhones1.splice(i,1)
 //            		break;
 //            	}
 //            }
 //            for (var i = 0; i < arrPhones2.length; i++) {
 //            	if (arrPhones2[i]._id == id) {
 //            		arrPhones2.splice(i,1)
 //            		break;
 //            	}
 //            }
	// 		};
	// 		scope.generateColor = function() {
	// 			if (scope.editColor) {
	// 				var clientColor = (scope.editColor).toLowerCase()
	// 				var regExp = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/;
	// 				if (regExp.test(clientColor)) {
	// 					scope.newColor = clientColor;
	// 				}
	// 				else {
	// 					scope.newColor = "";
	// 				}
	// 			}
	// 		};
	// 		scope.addNewColor = function(event) {
	// 			event.preventDefault();
	// 			var messageElem = angular.element(document.getElementById("addColorMessage"));
	// 			var regExp = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/;
	// 			var phoneColors = scope.adminThisPhone.color;
	// 			var arrColorsLength = (scope.adminThisPhone.color).length;
	// 			var counter;
	// 			if (scope.editColor) {
	// 				var clientColor = (scope.editColor).toLowerCase();
	// 				var newColor = (scope.editColor).toLowerCase();
	// 				if (arrColorsLength == 0) {
	// 					if (regExp.test(clientColor)) {
	// 						(scope.adminThisPhone.color).push(newColor)
	// 					}
	// 					else {
	// 						(angular.element(messageElem)).val("введите цвет согласно формата");
	// 						setTimeout(function() {
	// 							(angular.element(messageElem)).val("")
	// 						}, 2500)
	// 					}
	// 				}
	// 				else {
	// 					if (regExp.test(clientColor)) {
	// 						for (var i = 0; i < phoneColors.length; i++) {
	// 							if (phoneColors[i]===newColor) {
	// 								counter = 1;
	// 								(angular.element(messageElem)).val("цвет уже добавлен")
	// 								setTimeout(function() {
	// 									(angular.element(messageElem)).val(" ")
	// 								},1500)
	// 								break;
	// 							}
	// 						}
	// 						if (!counter) {
	// 							(scope.adminThisPhone.color).push(newColor)
	// 						}
	// 					}
	// 					else {
	// 						(angular.element(messageElem)).val("введите цвет согласно формата");
	// 						setTimeout(function() {
	// 							(angular.element(messageElem)).val("")
	// 						}, 2500)
	// 					}
	// 				}
	// 			}
	// 			else {
	// 				(angular.element(messageElem)).val("введите символы")
	// 			}
	// 		};
	// 		//удаляем цвет у телефона и элемент из дом-дерева
	// 		scope.deleteColor = function(e, phone) {
	// 			e.preventDefault();
	// 			var elem = angular.element(e.target).parent().parent();
	// 			var color = ((elem.attr("style")).split(" "))[1];
	// 			var phoneColors = phone.color;
	// 			var colorIndex;
	// 			var newArrColors;
	// 			for (var i = 0; i < phoneColors.length; i++) {
	// 				if (phoneColors[i] === color) {
	// 					colorIndex = i;
	// 					break;
	// 				}
	// 			}
	// 			phoneColors.splice(colorIndex, 1)
	// 		};
	// 		// подсветка полей для ввода нового товара
	// 		scope.addNewPhone = function() {
	// 			var a = (angular.element(document.getElementsByClassName("admin_right")))[0];
	// 			var arrInput = angular.element(a).find("input");
	// 			var textarea = angular.element(a).find("textarea");
	// 			arrInput.addClass("danger_admin");
	// 			textarea.addClass("danger_admin");
	// 			setTimeout(function() {
	// 				arrInput.removeClass("danger_admin");
	// 				textarea.removeClass("danger_admin");
	// 			},6000)
	// 			scope.adminThisPhone = {
	// 				// nppGenerate: "addAdmin",
	// 				brend: null,
	// 				model: null,
	// 				processor: null,
	// 				display: null,
	// 				camera: null,
	// 				memory: null,
	// 				color: [],
	// 				otherDescr: null,
	// 				reiting: null,
	// 				price: null,
	// 				img: 'img/1/1.png',
	// 				imgmore: "img/1/1.png, img/1/2.png, img/1/3.png",
	// 				comments: [
	// 					{
	// 						user: null,
	// 						time: null,
	// 						text: null
	// 					}
	// 				]
	// 			}
	// 		}
	// 		//отправка нового товара в бд
	// 		scope.addGoodsDb = function() {
	// 			var newPhone = scope.adminThisPhone;
	// 			if (newPhone._id) {
	// 				scope.dangerMessage = "телефон уже есть в бд, нажмите-'обновить'";
	// 				$timeout(function() {
	// 					scope.dangerMessage = " ";
	// 				}, 2500)
	// 			}
	// 			else {
	// 				$http.post('https://mobile-face-it.herokuapp.com/addNewPhone', newPhone)
	// 				// $http.post('http://localhost:3000/addNewPhone', newPhone)
	// 				.success(function(result) {
	// 					if (result.id) {
	// 						scope.dangerMessage = "телефон добавлен в БД";
	// 						$timeout(function() {
	// 							scope.dangerMessage = "";
	// 						},2000)
	// 						scope.adminThisPhone = {
	// 							// nppGenerate: "addAdmin",
	// 							brend: null,
	// 							model: null,
	// 							processor: null,
	// 							display: null,
	// 							camera: null,
	// 							memory: null,
	// 							color: [],
	// 							otherDescr: null,
	// 							reiting: null,
	// 							price: null,
	// 							img: 'img/1/1.jpg',
	// 							imgmore: "img/1/1.jpg, img/1/2.jpg, img/1/3.jpg",
	// 							comments: [
	// 								{
	// 									user: null,
	// 									time: null,
	// 									text: null
	// 								}
	// 							]
	// 						};
	// 						newPhone._id = result.id;
	// 						(scope.main_Goods_constant).push(newPhone)							
	// 					}
	// 					else {
	// 						scope.dangerMessage = result;
	// 					}
	// 				})
	//             .error(function(error) {
	//             	scope.dangerMessage = "ошибка!";
	//             });
	// 			}	
	// 		};
	// 		scope.validFormAdmin = function(event) {
	// 			var thisElem = event.target;
	// 			var pattern = (angular.element(thisElem)).attr("pattern");
	// 			var thisElemVal = (angular.element(thisElem)).val()
	// 			var re = thisElemVal.search(pattern)
	// 			if (re == -1) {
	// 				(angular.element(thisElem)).addClass('danger_error_val')
	// 			}
	// 			else {
	// 				(angular.element(thisElem)).removeClass('danger_error_val')
	// 			}
	// 		}
	// 		scope.adminDeleteComment = function(e, phone) {
	// 			var elem = angular.element(e.target).parent().parent();
	// 			var time = elem.find("span").text();
	// 			var arrComments = phone.comments;
	// 			var commentIndex;
	// 			for (var i = 0; i < arrComments.length; i++) {
	// 				if (arrComments[i].time === time) {
	// 					commentIndex = i;
	// 					break;
	// 				}	
	// 			}
	// 			arrComments.splice(commentIndex, 1)
	// 		}
	// 		scope.updateDb=function() {
	// 			if (scope.adminThisPhone._id) {
	// 				var str = JSON.stringify(scope.adminThisPhone)
	// 				var newObj = JSON.parse(str);
	// 				$http.post('https://mobile-face-it.herokuapp.com/updateGoods', newObj)
	// 				// $http.post('http://localhost:3000/updateGoods', newObj)
	// 				.success(function(result) {
	// 					scope.dangerMessage = result;
	// 					scope.dangerMessage = "инф-я обновлена";
	// 					$timeout(function() {
	// 						scope.dangerMessage = "";
	// 					},2500)
						
	// 				})
	//             .error(function(error) {
	//             	scope.dangerMessage = "ошибка записи в бд";
	//             });
	// 			}
	// 			else {
	// 				scope.dangerMessage = "вы пытаетесь обновить несущ-ий в бд телефон";
	// 				$timeout(function() {
	// 					scope.dangerMessage = "";
	// 				},2500)
	// 			}
	// 		}
	// 		//admin delete user
	// 		scope.deleteUserDb=function(user) {
	// 			var userId = {};
	// 			userId.id = user._id
	// 			var userName = user.username;
	// 			var elem = angular.element(document.getElementById("danger_delete_user"))
	// 			var message = "пользователь: " + userName + " удален";
	// 			var index;
	// 			$http.post('https://mobile-face-it.herokuapp.com/deleteUser', userId)
	// 			// $http.post('http://localhost:3000/deleteUser', userId)
	// 			.success(function(result) {
	// 				angular.element(elem).val(message)
	// 				var arr = scope.thisUser.allUsers;
	// 				for (var i = 0; i < arr.length; i++) {
	// 					if (arr[i]._id === user._id) {
	// 						arr.splice(i,1)
	// 						break;
	// 					}
	// 				}
	// 				$timeout(function() {
	// 					angular.element(elem).val("")
	// 				},2500)
					
	// 			})
 //            .error(function(error) {
 //            	angular.element(elem).val("ошибка записи в бд");
 //            });
	// 		}
	//     }
	//   };
	// });