
angular.module('AdminProductsCtrl')

.factory('adminProductsFactory', ['$http', '$timeout', function($http, $timeout) {
	'use strict';
	

	function clearAllValues(scope) {
		'use strict';
		var product_val = scope.product_val;
		var product_img = scope.product_img;
		var valid = scope.valid;
		var prop;
		for(prop in product_val) {
			if (prop !== 'kind' && prop !== 'colours') {
				scope.product_val[prop] = undefined;
			}
		}
		delete product_val.colours;
		product_val.colours = [];
		for(prop in product_img) {
			scope.product_img[prop].file = undefined;
			scope.product_img[prop].load_img_begin = undefined;
			scope.product_img[prop].loaded = undefined;
		}
		for(prop in valid) {
			scope.valid[prop].value = false;
		}
		scope.product_id = undefined;
		scope.product_sale.bool = undefined;
		scope.product_sale.discount = undefined;
		scope.product_sale.descript = undefined;
	}


	return {
      deleteProduct : function(id, scope) {
         scope.currentDb.name
         $http.post(scope.url + "/deleteProduct", {"id" : id, "productType" : scope.currentDb.name})
            .success(function(doc) {
               console.log(doc)
            })
            .error(function(err) {
               console.log(err)
               // message adminu
            })
      },
      editProduct : function(id, scope) {           
         // $http.post(scope.url + "/editProduct", {"id" : id, "productType" : scope.currentDb.name})
         // .success(function(doc) {
         //    scope.currentDb.name = doc.kind;
         //    scope.product_val.kind = doc.kind;
         //    scope.product_val.brand = doc.brand;
         //    scope.product_val.model = doc.model;
         //    scope.product_val.guarantee = doc.guarantee;
         //    scope.product_val.price = doc.price;
         //    scope.product_val.operSystem = doc.operSystem;
         //    scope.product_val.cpu = doc.cpu;
         //    scope.product_val.numCores = doc.numCores;
         //    scope.product_val.memory = doc.memory;
         //    scope.product_val.ramMemory = doc.ramMemory;
         //    scope.product_val.screenDiagonal = doc.screenDiagonal;
         //    scope.product_val.screenResolution = doc.screenResolution;
         //    scope.product_val.frontCamera = doc.frontCamera;
         //    scope.product_val.mainCamera = doc.mainCamera;
         //    scope.product_val.battery = doc.battery;
         //    scope.product_val.colours = doc.colours;
         //    scope.productAction = {
         //       search : false,
         //       add : false,
         //       edit : true
         //    }
         //    scope.product_id = doc._id;
         // })
         // .error(function(err) {
         //    console.log(err)
         //    // message adminu
         // })
        var i;
        var arr = scope.DB[scope.currentDb.name].value;
        var arrLength = arr.length;
        for (i = 0; i < arrLength; i++) {
          if (arr[i]._id) {
            scope.product_val = arr[i];
            scope.product_id = arr[i]._id;
            console.log(arr[i])
            break;
          } 
        }
        scope.productAction = {
          search : false,
          add : false,
          edit : true
        }
        // scope.product_id = doc._id;
      },

      getDb : function(nameDb, scope) {
         if (!scope.DB[nameDb].value) {
            scope.$emit('startSpinner')
            $http.post(scope.url + "/getDbAdmin", {'nameDb' : nameDb})
            .success(function(data) {
              // console.log(data)
               scope.DB[nameDb].value = data;
               scope.view = data;
               scope.$emit('stopSpinner')
            })
            .error(function(err) {
               //message for admin
               console.log(err)
               scope.$emit('stopSpinner')
            })
         }
         else {
            scope.view = scope.DB[nameDb].value;
         }
      },
		validationInput : function(prop, scope) {
			'use strict';
			var 	regExp,
					name,
					val,
					valid;
			val = scope.product_val[prop];
			if (scope.valid[prop].pattern) {
				regExp = new RegExp(scope.valid[prop].pattern);
				valid =  regExp.test(val);
			}
			else {
				valid = true
			};
			if (valid && val) { 
				scope.valid[prop].value = true 
			}
			else { 
				scope.valid[prop].value = false 
			}
		},
		validationAddColor : function(scope) {
			'use strict'
			var 	regExp,
					validColor;
			regExp = new RegExp(scope.valid.colour.pattern);
			validColor = regExp.test(scope.product_newColour);	
			if (validColor) {
				scope.valid.btn_addColor = true;
			}
			else {
				scope.valid.btn_addColor = false;
			}
		},

		setProductDb : function(scope) {
			'use strict';
			var prop;
			var valid = true;
			// for(prop in scope.valid) {
			// 	if (scope.valid[prop].value === false) {
			// 		valid = false;
			// 		break; 
			// 	}
			// }
			if (valid) {
				// random
				for (var i = 0; i < 20; i++) {
          
					$http.post(scope.url + "/setProductDb", randomarr[i])
					.success(function(doc) {
            scope.serverAnswer = doc.id
            scope.product_id = doc.id
						// if (doc.id) {	scope.product_id = doc.id	}
						// 	else {	scope.serverAnswer = doc	}
					})
					.error(function(err) {
						console.log(err);
						scope.serverAnswer = 'сбой при отправке данных, повторите'
						// message = 'сбой на сервере'
					})
				}
				// normal
    //     if (scope.product_sale.bool) { scope.product_val.sale = scope.product_sale}
    //     scope.product_val.sale = scope.product_sale; 
				// $http.post(scope.url + "/setProductDb", scope.product_val)
				// 	.success(function(doc) {
				// 		if (doc.id) {	scope.product_id = doc.id	}
				// 			else {	scope.serverAnswer = doc	}
				// 	})
				// 	.error(function(err) {
				// 		console.log(err);
				// 		scope.serverAnswer = 'сбой при отправке данных, повторите'
				// 		// message = 'сбой на сервере'
				// 	})
			}
         else {
            alert('ошибки при вводе')
         }
		},
		setImgDb : function(scope, Upload) {
			'use strict';
			var 	prop,
					allImg,
					id,
					counterForResetAllValues,
					valid,
					interval ;
			counterForResetAllValues = 0;
			allImg = scope.product_img;
			for (prop in allImg) {
				if(allImg[prop].file) {
					valid = true
				} 
				else { 
					valid = false; 
					break;
				}
			}
			if (valid) {
				interval = setInterval(function() {
					if (counterForResetAllValues == 6) {
						$timeout(function() {
							clearAllValues(scope)
						},1500)
						clearInterval(interval)
						
					}
				}, 500)
				id = scope.product_id;
				for(prop in allImg) {
					allImg[prop].load_img_begin = true;
				}
				for(prop in allImg) {
					Upload.upload({'url': scope.url + "/setImg_" + prop, 'data': { 
						'id': id, 
						'kindImg': prop, 
						'file': allImg[prop].file, 
						'typeDb': scope.product_val.kind}})
						.then(function(res) {
							if (res) {
								counterForResetAllValues++
							}
							scope.product_img[res.data.kindImg].load_img_begin = false;
							scope.product_img[res.data.kindImg].loaded = true;
							
						})
				}
			}	
			else {
				// message
				console.log('uuuu')
			}
		}
	}	
}]);
// returns a promise
// upload.then(function(resp) {}, function(resp) {}, function(evt) {});
// upload.catch(errorCallback);
// upload.finally(callback, notifyCallback);
var randomarr = [
  {
    "kind": "laptop",
    "brand": "htc",
    "model": "dolore",
    "guarantee": 18,
    "price": 7849,
    "operSystem": "Android 4.1",
    "cpu": "Core 2",
    "numCores": 7,
    "memory": 34,
    "ramMemory": 2048,
    "screenDiagonal": 6.5,
    "screenResolution": "1024*678",
    "frontCamera": 0.6,
    "mainCamera": 12,
    "battery": 3392,
    "colours": [
      "#999",
      "#444",
      "#666"
    ],
    "img": {
      "small": "3.png",
      "big": "3.png",
      "slide1": "8.png",
      "slide2": "6.png",
      "slide3": "6.png",
      "slide4": "6.png"
    },
    "sale": {
      "bool": false,
      "discount": 3,
      "descript": "eu sint anim id veniam nostrud eiusmod sit excepteur labore fugiat labore proident aliqua tempor ut voluptate aliquip est minim"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Craig Harding",
          "date": "2016-05-14T05:47:11 -03:00",
          "text": "id quis laborum elit nulla irure incididunt cupidatat occaecat mollit nulla est mollit officia ea et sint commodo officia fugiat"
        },
        {
          "user": "Agnes Bass",
          "date": "2016-05-02T02:44:17 -03:00",
          "text": "pariatur qui consectetur fugiat aliquip esse cillum deserunt deserunt proident adipisicing officia culpa consectetur cillum eiusmod cupidatat labore Lorem pariatur"
        }
      ]
    }
  },
  {
    "kind": "laptop",
    "brand": "htc",
    "model": "anim",
    "guarantee": 36,
    "price": 8357,
    "operSystem": "Android 4.05",
    "cpu": "Intel 2.0",
    "numCores": 8,
    "memory": 36,
    "ramMemory": 2048,
    "screenDiagonal": 6.4,
    "screenResolution": "1024*678",
    "frontCamera": 2.1,
    "mainCamera": 4,
    "battery": 3373,
    "colours": [
      "#333",
      "#555",
      "#666"
    ],
    "img": {
      "small": "2.png",
      "big": "4.png",
      "slide1": "6.png",
      "slide2": "6.png",
      "slide3": "9.png",
      "slide4": "2.png"
    },
    "sale": {
      "bool": true,
      "discount": 7,
      "descript": "proident occaecat ea dolor aliquip aliquip qui ut excepteur anim culpa exercitation quis laborum ex esse labore quis deserunt cillum"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Gross Day",
          "date": "2014-08-10T04:13:12 -03:00",
          "text": "elit laboris Lorem nulla ipsum ut laboris ea Lorem minim magna fugiat non elit sunt esse voluptate esse ex qui"
        },
        {
          "user": "Fowler Combs",
          "date": "2015-10-21T02:33:56 -03:00",
          "text": "ad esse tempor incididunt laborum qui fugiat excepteur eu velit ad est aliqua sit et quis deserunt esse velit veniam"
        }
      ]
    }
  },
  {
    "kind": "laptop",
    "brand": "htc",
    "model": "consequat",
    "guarantee": 18,
    "price": 6576,
    "operSystem": "Android 4.2",
    "cpu": "Artron",
    "numCores": 2,
    "memory": 18,
    "ramMemory": 512,
    "screenDiagonal": 6.9,
    "screenResolution": "1024*678",
    "frontCamera": 1.1,
    "mainCamera": 15,
    "battery": 2432,
    "colours": [
      "#333",
      "#777",
      "#222"
    ],
    "img": {
      "small": "9.png",
      "big": "4.png",
      "slide1": "3.png",
      "slide2": "3.png",
      "slide3": "7.png",
      "slide4": "7.png"
    },
    "sale": {
      "bool": true,
      "discount": 10,
      "descript": "consequat veniam laboris et occaecat excepteur mollit sit aliquip nulla dolore quis ad cupidatat duis occaecat velit laboris commodo voluptate"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Marisol Chapman",
          "date": "2016-04-17T05:22:11 -03:00",
          "text": "adipisicing cupidatat labore sunt sint nisi esse aliquip magna esse veniam ad excepteur laborum enim adipisicing voluptate cupidatat est duis"
        },
        {
          "user": "Kenya Savage",
          "date": "2014-09-01T12:19:38 -03:00",
          "text": "minim adipisicing commodo ipsum consequat fugiat pariatur minim tempor veniam veniam ut cupidatat id duis enim fugiat eu cupidatat officia"
        }
      ]
    }
  },
  {
    "kind": "laptop",
    "brand": "huawei",
    "model": "nostrud",
    "guarantee": 36,
    "price": 5707,
    "operSystem": "Android 4.2",
    "cpu": "Pentium 5",
    "numCores": 3,
    "memory": 25,
    "ramMemory": 1024,
    "screenDiagonal": 8.4,
    "screenResolution": "1024*678",
    "frontCamera": 0.5,
    "mainCamera": 9,
    "battery": 2003,
    "colours": [
      "#999",
      "#555",
      "#222"
    ],
    "img": {
      "small": "6.png",
      "big": "10.png",
      "slide1": "6.png",
      "slide2": "3.png",
      "slide3": "4.png",
      "slide4": "5.png"
    },
    "sale": {
      "bool": true,
      "discount": 10,
      "descript": "non excepteur est nisi ex in magna ipsum dolor cupidatat non consectetur tempor incididunt ut pariatur adipisicing adipisicing anim excepteur"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Lynne Todd",
          "date": "2015-07-31T07:51:17 -03:00",
          "text": "commodo aute adipisicing enim id fugiat adipisicing pariatur cillum incididunt quis duis occaecat officia amet aliquip eiusmod pariatur dolor nulla"
        },
        {
          "user": "Trisha Ortega",
          "date": "2015-02-25T07:42:31 -02:00",
          "text": "dolore ea aute ut nisi officia ipsum ad nulla id ex laboris velit ex enim ad laborum et irure elit"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "prestigio",
    "model": "aute",
    "guarantee": 18,
    "price": 2060,
    "operSystem": "Android 4.1",
    "cpu": "Core 2",
    "numCores": 2,
    "memory": 17,
    "ramMemory": 512,
    "screenDiagonal": 9.9,
    "screenResolution": "1024*512",
    "frontCamera": 1.4,
    "mainCamera": 5,
    "battery": 3196,
    "colours": [
      "#999",
      "#777",
      "#888"
    ],
    "img": {
      "small": "9.png",
      "big": "4.png",
      "slide1": "6.png",
      "slide2": "8.png",
      "slide3": "9.png",
      "slide4": "8.png"
    },
    "sale": {
      "bool": false,
      "discount": 7,
      "descript": "culpa cupidatat amet eu incididunt duis exercitation nulla officia aute elit amet aute voluptate ea ipsum sint labore deserunt est"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Kathryn Decker",
          "date": "2015-12-01T02:16:36 -02:00",
          "text": "qui adipisicing consectetur cillum aliqua fugiat fugiat incididunt commodo tempor laboris quis cupidatat esse quis deserunt ut aliquip est dolor"
        },
        {
          "user": "Violet Petty",
          "date": "2015-02-18T04:54:10 -02:00",
          "text": "culpa excepteur fugiat eiusmod ex sunt eu et exercitation consequat quis officia cupidatat culpa magna laborum incididunt eu velit Lorem"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "alcatel",
    "model": "fugiat",
    "guarantee": 18,
    "price": 3384,
    "operSystem": "Android 4.2",
    "cpu": "Core 2",
    "numCores": 6,
    "memory": 35,
    "ramMemory": 512,
    "screenDiagonal": 4.2,
    "screenResolution": "1024*512",
    "frontCamera": 2.8,
    "mainCamera": 4,
    "battery": 3633,
    "colours": [
      "#999",
      "#444",
      "#888"
    ],
    "img": {
      "small": "10.png",
      "big": "2.png",
      "slide1": "4.png",
      "slide2": "3.png",
      "slide3": "7.png",
      "slide4": "6.png"
    },
    "sale": {
      "bool": true,
      "discount": 6,
      "descript": "veniam minim non veniam excepteur deserunt aliquip eiusmod do amet qui non commodo fugiat do id esse non labore proident"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Guerra Powers",
          "date": "2016-03-28T03:13:07 -02:00",
          "text": "minim reprehenderit officia non non non ea nostrud commodo cillum excepteur et esse cillum aliquip tempor Lorem ad ex eiusmod"
        },
        {
          "user": "Hebert Franklin",
          "date": "2014-03-04T05:29:20 -02:00",
          "text": "ullamco cupidatat ullamco esse tempor elit labore aliqua esse sunt ullamco nisi elit ullamco nulla laborum nulla nisi officia quis"
        }
      ]
    }
  },
  {
    "kind": "laptop",
    "brand": "huawei",
    "model": "ea",
    "guarantee": 6,
    "price": 7875,
    "operSystem": "Android 4.2",
    "cpu": "Artron",
    "numCores": 6,
    "memory": 18,
    "ramMemory": 1024,
    "screenDiagonal": 8.2,
    "screenResolution": "2048*1024",
    "frontCamera": 0.9,
    "mainCamera": 7,
    "battery": 3113,
    "colours": [
      "#999",
      "#444",
      "#666"
    ],
    "img": {
      "small": "2.png",
      "big": "4.png",
      "slide1": "4.png",
      "slide2": "4.png",
      "slide3": "2.png",
      "slide4": "4.png"
    },
    "sale": {
      "bool": true,
      "discount": 1,
      "descript": "ullamco veniam veniam do sit proident Lorem ea ut excepteur pariatur id fugiat nulla minim dolore sit quis enim aliqua"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Mallory Talley",
          "date": "2015-10-26T04:51:06 -03:00",
          "text": "ullamco reprehenderit incididunt cillum aliqua voluptate irure dolor pariatur sunt proident aliqua exercitation cillum culpa eu cupidatat Lorem consectetur aliqua"
        },
        {
          "user": "Debora Kerr",
          "date": "2015-10-21T12:03:30 -03:00",
          "text": "non amet culpa consectetur esse esse sint elit nostrud enim sunt sint in velit laborum nulla et velit pariatur consequat"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "lenovo",
    "model": "pariatur",
    "guarantee": 36,
    "price": 6681,
    "operSystem": "Android 4.1",
    "cpu": "Artron",
    "numCores": 2,
    "memory": 40,
    "ramMemory": 512,
    "screenDiagonal": 8.2,
    "screenResolution": "1024*678",
    "frontCamera": 1.7,
    "mainCamera": 6,
    "battery": 3325,
    "colours": [
      "#333",
      "#777",
      "#666"
    ],
    "img": {
      "small": "8.png",
      "big": "5.png",
      "slide1": "6.png",
      "slide2": "3.png",
      "slide3": "9.png",
      "slide4": "2.png"
    },
    "sale": {
      "bool": true,
      "discount": 4,
      "descript": "dolor excepteur pariatur ex laborum exercitation laboris minim et labore qui commodo qui id ipsum nisi magna sunt excepteur Lorem"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Lorraine Trevino",
          "date": "2015-10-01T12:12:26 -03:00",
          "text": "eiusmod irure eiusmod anim culpa esse incididunt aute anim cillum dolor enim proident mollit in commodo sunt do pariatur minim"
        },
        {
          "user": "Kelly Vincent",
          "date": "2015-12-08T09:48:47 -02:00",
          "text": "quis veniam dolore Lorem laborum aute voluptate elit nostrud nostrud pariatur aliqua nulla esse excepteur do proident eiusmod excepteur ut"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "sony",
    "model": "excepteur",
    "guarantee": 6,
    "price": 5279,
    "operSystem": "Android 4.2",
    "cpu": "Intel 2.0",
    "numCores": 4,
    "memory": 36,
    "ramMemory": 1024,
    "screenDiagonal": 6.8,
    "screenResolution": "2048*1024",
    "frontCamera": 2.9,
    "mainCamera": 6,
    "battery": 3182,
    "colours": [
      "#111",
      "#777",
      "#888"
    ],
    "img": {
      "small": "1.png",
      "big": "2.png",
      "slide1": "9.png",
      "slide2": "5.png",
      "slide3": "10.png",
      "slide4": "6.png"
    },
    "sale": {
      "bool": true,
      "discount": 8,
      "descript": "ad officia incididunt ex duis mollit aliquip velit aliquip Lorem quis cupidatat ex in id anim duis ex mollit elit"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Celina Kinney",
          "date": "2014-10-03T09:50:23 -03:00",
          "text": "commodo cillum id nostrud reprehenderit pariatur ad esse labore consectetur labore Lorem cupidatat quis consectetur proident nostrud excepteur minim do"
        },
        {
          "user": "Carey Wade",
          "date": "2015-02-20T08:52:13 -02:00",
          "text": "pariatur consectetur est tempor magna enim veniam in cupidatat tempor est occaecat pariatur minim do eiusmod in qui elit ex"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "benq",
    "model": "eu",
    "guarantee": 18,
    "price": 4509,
    "operSystem": "Android 4.2",
    "cpu": "Core 2",
    "numCores": 8,
    "memory": 26,
    "ramMemory": 512,
    "screenDiagonal": 8.7,
    "screenResolution": "1024*678",
    "frontCamera": 0.7,
    "mainCamera": 9,
    "battery": 3963,
    "colours": [
      "#111",
      "#444",
      "#666"
    ],
    "img": {
      "small": "5.png",
      "big": "1.png",
      "slide1": "4.png",
      "slide2": "7.png",
      "slide3": "1.png",
      "slide4": "1.png"
    },
    "sale": {
      "bool": false,
      "discount": 5,
      "descript": "irure sit ut dolor ex mollit dolor anim exercitation magna dolor elit occaecat dolore pariatur nisi sunt ut officia tempor"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Holloway Ingram",
          "date": "2014-08-31T10:38:03 -03:00",
          "text": "minim pariatur laborum do in culpa ea labore est occaecat ullamco proident proident qui est laborum anim officia commodo in"
        },
        {
          "user": "Hardy Quinn",
          "date": "2016-04-12T07:57:17 -03:00",
          "text": "ea quis culpa velit voluptate cupidatat pariatur anim Lorem voluptate proident minim aliqua officia nulla occaecat enim ea labore do"
        }
      ]
    }
  },
  {
    "kind": "laptop",
    "brand": "lenovo",
    "model": "qui",
    "guarantee": 12,
    "price": 9495,
    "operSystem": "Android 4.2",
    "cpu": "Intel 2.0",
    "numCores": 8,
    "memory": 9,
    "ramMemory": 1024,
    "screenDiagonal": 9.6,
    "screenResolution": "2048*1024",
    "frontCamera": 0.5,
    "mainCamera": 10,
    "battery": 2761,
    "colours": [
      "#111",
      "#555",
      "#888"
    ],
    "img": {
      "small": "8.png",
      "big": "9.png",
      "slide1": "6.png",
      "slide2": "2.png",
      "slide3": "3.png",
      "slide4": "2.png"
    },
    "sale": {
      "bool": true,
      "discount": 4,
      "descript": "veniam minim nulla nulla minim exercitation eu sit officia sint cupidatat minim duis minim esse nostrud et aliqua laboris in"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Della Small",
          "date": "2015-02-24T07:49:11 -02:00",
          "text": "tempor mollit officia mollit magna aliquip Lorem sunt esse ullamco cupidatat fugiat exercitation enim ut exercitation ullamco voluptate deserunt tempor"
        },
        {
          "user": "Franco Fitzpatrick",
          "date": "2016-03-07T12:32:45 -02:00",
          "text": "sit cupidatat irure sit enim ea eiusmod ex laborum deserunt dolor dolore nulla aliqua labore quis nostrud dolore tempor proident"
        }
      ]
    }
  },
  {
    "kind": "laptop",
    "brand": "lg",
    "model": "commodo",
    "guarantee": 12,
    "price": 9045,
    "operSystem": "Android 4.1",
    "cpu": "Intel 2.0",
    "numCores": 2,
    "memory": 18,
    "ramMemory": 1024,
    "screenDiagonal": 7.4,
    "screenResolution": "2048*1024",
    "frontCamera": 3,
    "mainCamera": 11,
    "battery": 3401,
    "colours": [
      "#333",
      "#777",
      "#666"
    ],
    "img": {
      "small": "2.png",
      "big": "3.png",
      "slide1": "10.png",
      "slide2": "1.png",
      "slide3": "2.png",
      "slide4": "4.png"
    },
    "sale": {
      "bool": false,
      "discount": 3,
      "descript": "sunt ipsum ut incididunt sunt adipisicing qui Lorem anim sunt adipisicing dolor tempor ad ad quis esse id ex ex"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Ruth Jones",
          "date": "2015-08-18T12:43:52 -03:00",
          "text": "velit consectetur pariatur deserunt est et commodo cupidatat adipisicing aliqua voluptate ad elit in veniam ad occaecat mollit ullamco proident"
        },
        {
          "user": "Angelique Bartlett",
          "date": "2014-12-10T09:54:49 -02:00",
          "text": "cupidatat dolore veniam voluptate culpa labore officia quis quis quis aliquip do cillum nisi et officia elit deserunt dolor cupidatat"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "acer",
    "model": "consectetur",
    "guarantee": 12,
    "price": 3304,
    "operSystem": "Android 4.0",
    "cpu": "Core 3 Duo",
    "numCores": 7,
    "memory": 10,
    "ramMemory": 2048,
    "screenDiagonal": 8.2,
    "screenResolution": "1024*512",
    "frontCamera": 0.7,
    "mainCamera": 8,
    "battery": 3424,
    "colours": [
      "#333",
      "#555",
      "#888"
    ],
    "img": {
      "small": "6.png",
      "big": "5.png",
      "slide1": "6.png",
      "slide2": "1.png",
      "slide3": "10.png",
      "slide4": "7.png"
    },
    "sale": {
      "bool": true,
      "discount": 5,
      "descript": "tempor sint et laborum non aute mollit minim qui ut nulla occaecat velit incididunt deserunt minim commodo ipsum eiusmod duis"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Burns Thomas",
          "date": "2016-05-25T08:59:13 -03:00",
          "text": "laborum ullamco et ut magna reprehenderit nostrud adipisicing sunt exercitation pariatur eiusmod ea ea fugiat ipsum ut fugiat cillum dolore"
        },
        {
          "user": "Rhoda Owens",
          "date": "2016-02-10T02:04:51 -02:00",
          "text": "irure veniam reprehenderit id ad cupidatat deserunt id consequat consequat cupidatat dolore eu Lorem enim quis laborum occaecat nostrud enim"
        }
      ]
    }
  },
  {
    "kind": "laptop",
    "brand": "benq",
    "model": "anim",
    "guarantee": 24,
    "price": 7610,
    "operSystem": "Android 4.2",
    "cpu": "Core 2",
    "numCores": 3,
    "memory": 37,
    "ramMemory": 512,
    "screenDiagonal": 9.5,
    "screenResolution": "1024*512",
    "frontCamera": 1.8,
    "mainCamera": 12,
    "battery": 3045,
    "colours": [
      "#999",
      "#777",
      "#888"
    ],
    "img": {
      "small": "4.png",
      "big": "3.png",
      "slide1": "7.png",
      "slide2": "10.png",
      "slide3": "9.png",
      "slide4": "7.png"
    },
    "sale": {
      "bool": false,
      "discount": 4,
      "descript": "ipsum consequat duis nulla aute occaecat sunt anim aliqua sit cupidatat et culpa cupidatat nostrud do deserunt nisi dolore pariatur"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Serrano Daniel",
          "date": "2014-07-28T01:32:10 -03:00",
          "text": "consectetur exercitation cillum in aliqua proident nostrud veniam proident commodo reprehenderit culpa tempor cupidatat mollit nostrud nostrud occaecat et velit"
        },
        {
          "user": "Christensen Hays",
          "date": "2015-08-19T05:49:24 -03:00",
          "text": "laboris mollit sunt occaecat non minim pariatur est amet tempor esse fugiat laboris et esse ullamco anim minim sint velit"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "meizu",
    "model": "qui",
    "guarantee": 24,
    "price": 9489,
    "operSystem": "Android 4.0",
    "cpu": "Core 2",
    "numCores": 6,
    "memory": 27,
    "ramMemory": 512,
    "screenDiagonal": 8.5,
    "screenResolution": "1024*678",
    "frontCamera": 1.4,
    "mainCamera": 15,
    "battery": 2997,
    "colours": [
      "#111",
      "#777",
      "#666"
    ],
    "img": {
      "small": "7.png",
      "big": "1.png",
      "slide1": "10.png",
      "slide2": "1.png",
      "slide3": "8.png",
      "slide4": "1.png"
    },
    "sale": {
      "bool": true,
      "discount": 4,
      "descript": "duis velit enim culpa ipsum mollit commodo consequat sunt veniam in velit veniam sunt sunt veniam nisi incididunt aliqua amet"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Holcomb Floyd",
          "date": "2015-09-21T01:24:01 -03:00",
          "text": "laboris anim pariatur et nostrud qui non esse anim deserunt sint reprehenderit id reprehenderit magna esse cillum eiusmod Lorem aliqua"
        },
        {
          "user": "Sykes Hayden",
          "date": "2015-11-27T02:47:29 -02:00",
          "text": "dolor minim ad adipisicing ad proident ipsum nostrud laboris irure eiusmod nisi commodo nostrud velit ut irure deserunt velit reprehenderit"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "fly",
    "model": "reprehenderit",
    "guarantee": 24,
    "price": 3606,
    "operSystem": "Android 4.2",
    "cpu": "Artron",
    "numCores": 4,
    "memory": 34,
    "ramMemory": 1024,
    "screenDiagonal": 7.8,
    "screenResolution": "2048*1024",
    "frontCamera": 1.1,
    "mainCamera": 10,
    "battery": 2788,
    "colours": [
      "#999",
      "#777",
      "#888"
    ],
    "img": {
      "small": "8.png",
      "big": "1.png",
      "slide1": "3.png",
      "slide2": "2.png",
      "slide3": "10.png",
      "slide4": "1.png"
    },
    "sale": {
      "bool": false,
      "discount": 1,
      "descript": "excepteur Lorem quis eiusmod est reprehenderit id aliquip aliqua cupidatat dolore quis elit quis in exercitation labore nisi officia excepteur"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Marietta Grimes",
          "date": "2014-01-28T09:18:43 -02:00",
          "text": "id eu consequat ut nisi pariatur irure veniam ullamco aliqua aliquip sint ut occaecat sint consequat labore tempor tempor elit"
        },
        {
          "user": "Carrillo Dillon",
          "date": "2014-07-03T07:48:42 -03:00",
          "text": "velit eu fugiat id aliquip nisi duis amet elit sit ipsum elit nulla magna sit eu qui elit aliqua anim"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "htc",
    "model": "culpa",
    "guarantee": 36,
    "price": 6239,
    "operSystem": "Android 4.2",
    "cpu": "Pentium 5",
    "numCores": 5,
    "memory": 13,
    "ramMemory": 2048,
    "screenDiagonal": 6.2,
    "screenResolution": "2048*1024",
    "frontCamera": 1.4,
    "mainCamera": 10,
    "battery": 2256,
    "colours": [
      "#333",
      "#555",
      "#888"
    ],
    "img": {
      "small": "1.png",
      "big": "8.png",
      "slide1": "7.png",
      "slide2": "7.png",
      "slide3": "9.png",
      "slide4": "3.png"
    },
    "sale": {
      "bool": true,
      "discount": 6,
      "descript": "elit sunt et consequat minim consequat anim pariatur aliqua commodo occaecat eiusmod adipisicing eu qui ea irure veniam tempor voluptate"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Hull Wood",
          "date": "2014-05-10T12:09:56 -03:00",
          "text": "id aliqua ut cupidatat deserunt nisi esse quis tempor eu esse ea aliqua eu occaecat consequat do incididunt laboris tempor"
        },
        {
          "user": "Harrell Simpson",
          "date": "2014-05-25T04:22:05 -03:00",
          "text": "cupidatat occaecat do nostrud aute adipisicing nisi enim velit ullamco tempor dolore commodo labore in irure dolore sunt laborum laboris"
        }
      ]
    }
  },
  {
    "kind": "tablet",
    "brand": "huawei",
    "model": "dolore",
    "guarantee": 12,
    "price": 4533,
    "operSystem": "Android 4.2",
    "cpu": "Core 2",
    "numCores": 2,
    "memory": 19,
    "ramMemory": 1024,
    "screenDiagonal": 5,
    "screenResolution": "2048*1024",
    "frontCamera": 1.2,
    "mainCamera": 10,
    "battery": 3402,
    "colours": [
      "#999",
      "#555",
      "#888"
    ],
    "img": {
      "small": "3.png",
      "big": "5.png",
      "slide1": "8.png",
      "slide2": "10.png",
      "slide3": "4.png",
      "slide4": "2.png"
    },
    "sale": {
      "bool": true,
      "discount": 8,
      "descript": "eu excepteur aliquip minim adipisicing ea eiusmod est ea culpa labore sint laboris consectetur pariatur ipsum nulla in duis tempor"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Rasmussen Haney",
          "date": "2016-05-16T01:08:48 -03:00",
          "text": "sunt amet elit anim reprehenderit adipisicing ea mollit occaecat incididunt mollit esse duis id nisi reprehenderit eiusmod sunt est incididunt"
        },
        {
          "user": "French Church",
          "date": "2015-06-17T08:35:35 -03:00",
          "text": "Lorem incididunt eu commodo pariatur et ipsum laborum duis labore elit proident culpa in ea proident et adipisicing sit non"
        }
      ]
    }
  },
  {
    "kind": "laptop",
    "brand": "sony",
    "model": "aliquip",
    "guarantee": 6,
    "price": 2185,
    "operSystem": "Android 4.05",
    "cpu": "Pentium 5",
    "numCores": 5,
    "memory": 26,
    "ramMemory": 1024,
    "screenDiagonal": 5.1,
    "screenResolution": "1024*512",
    "frontCamera": 0.9,
    "mainCamera": 7,
    "battery": 3643,
    "colours": [
      "#111",
      "#444",
      "#888"
    ],
    "img": {
      "small": "1.png",
      "big": "9.png",
      "slide1": "9.png",
      "slide2": "6.png",
      "slide3": "4.png",
      "slide4": "9.png"
    },
    "sale": {
      "bool": true,
      "discount": 6,
      "descript": "eu cupidatat aliquip eu veniam aliqua excepteur consectetur dolor id duis excepteur et dolor nostrud adipisicing in consectetur eu in"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Stevenson Cline",
          "date": "2015-02-14T06:39:32 -02:00",
          "text": "laboris labore do ea elit in aliquip nulla ullamco reprehenderit proident ipsum ipsum enim occaecat ut tempor eiusmod nulla magna"
        },
        {
          "user": "Effie White",
          "date": "2015-04-10T07:55:25 -03:00",
          "text": "consequat veniam ut ut tempor cupidatat reprehenderit officia Lorem labore laboris esse commodo pariatur deserunt duis ex magna voluptate pariatur"
        }
      ]
    }
  },
  {
    "kind": "laptop",
    "brand": "acer",
    "model": "sint",
    "guarantee": 24,
    "price": 6485,
    "operSystem": "Android 4.0",
    "cpu": "Core 2",
    "numCores": 3,
    "memory": 13,
    "ramMemory": 1024,
    "screenDiagonal": 7.8,
    "screenResolution": "2048*1024",
    "frontCamera": 2.5,
    "mainCamera": 10,
    "battery": 3024,
    "colours": [
      "#333",
      "#555",
      "#666"
    ],
    "img": {
      "small": "8.png",
      "big": "2.png",
      "slide1": "5.png",
      "slide2": "3.png",
      "slide3": "10.png",
      "slide4": "5.png"
    },
    "sale": {
      "bool": false,
      "discount": 6,
      "descript": "irure tempor commodo ad ad esse commodo ipsum aliquip labore irure do ipsum non enim ad dolore mollit minim ex"
    },
    "raiting": {
      "val": 1,
      "num": 1,
      "sum": 1
    },
    "comments": {
      "sumComments": 2,
      "comments": [
        {
          "user": "Mildred Wallace",
          "date": "2014-12-05T05:46:34 -02:00",
          "text": "occaecat quis fugiat do sit veniam dolor tempor aliqua et ullamco enim tempor ea eu et pariatur enim occaecat excepteur"
        },
        {
          "user": "Susie Chang",
          "date": "2016-01-29T10:11:14 -02:00",
          "text": "elit sunt veniam consectetur do ut excepteur et elit cupidatat eiusmod sunt cillum incididunt fugiat voluptate sunt eiusmod sit sunt"
        }
      ]
    }
  }
]