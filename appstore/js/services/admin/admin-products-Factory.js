
angular.module('AdminProductsCtrl')

.factory('adminProductsFactory', ['$http', '$timeout', '$rootScope', function($http, $timeout, $rootScope) {
   'use strict';
   function validation(scope) {
      var objValid = scope.valid;
      var regExp;
      var allValuesValid = true;
      var prop;
      var resultRe;
      for (prop in objValid) {
         if (scope.product_val[prop]) {
            regExp = new RegExp(objValid[prop].pattern);
            resultRe = regExp.test(scope.product_val[prop]) 
            objValid[prop].value = resultRe && scope.product_val[prop];
            if (!objValid[prop].value) {
               allValuesValid = false;
            }
         }
         else {
            objValid[prop].value = false;
            allValuesValid = false;
         }  
      }
      if (scope.product_val.sale.bool) {
         for (prop in scope.saleValid) {
            regExp = new RegExp(scope.saleValid[prop].pattern);
            resultRe = regExp.test(scope.product_val.sale[prop]) 
            scope.saleValid[prop].value = resultRe && scope.product_val.sale[prop];
            if (!scope.saleValid[prop].value) {
               allValuesValid = false;
            }        
         }
      }
      console.log('da')
      scope.valid_btn.btn_setProductDb = !allValuesValid;
   };
   function clearAllValues(scope) {
      'use strict';
      var product_val = scope.product_val;
      var product_img = scope.product_img;
      var valid = scope.valid;
      var prop;
      for(prop in product_val) {
         if (prop !== 'sale' && prop !== 'colours') {
            scope.product_val[prop] = undefined;
         }
      }
      product_val.colours = [0];
      for(prop in product_img) {
         scope.product_img[prop].file = undefined;
         scope.product_img[prop].load_img_begin = false;
         scope.product_img[prop].loaded = false;
      }
      for(prop in valid) {
         scope.valid[prop].value = false;
      }
      scope.saleValid.discount.value = false;
      scope.saleValid.descript.value = false;
      scope.product_id = undefined;
      scope.valid_btn.btn_setProductDb =  true
      scope.valid_btn.btn_setImgDb =  false
      scope.product_val.sale.bool = false;
      scope.product_kind = undefined;
      scope.product_val.sale.discount = undefined;
      scope.product_val.sale.descript = undefined;
      scope.togglePreparedProduct = true;
      scope.product_newColour = undefined;
   };
   return {
      addNewColor : function(scope) {
         var index;
         index = scope.product_val.colours.indexOf(scope.product_newColour);
         if (index < 0) {scope.product_val.colours.push(scope.product_newColour)}
      },
      removeColor : function(color, scope) {
         var index;
         index = scope.product_val.colours.indexOf(color);
         scope.product_val.colours.splice(index, 1)
      },
      toggleView : function(nameView, scope) {
         switch (nameView) {
            case "search":
               scope.productAction.search = true;
               scope.productAction.add = false;
               scope.productAction.edit = false;
               break;
            case "add":
               scope.productAction.search = false;
               scope.productAction.add = true;
               scope.productAction.edit = false;
               break;
            case "edit":
               scope.productAction.search = false;
               scope.productAction.add = false;
               scope.productAction.edit = true;
               break;
         }
      },
      findValues : function(scope) {
         scope.typeSearch.values = true;
         scope.typeSearch.pages = false;
         scope.search = scope.searchInputValues;
         scope.search = scope.searchInputValues;
         scope.search = scope.searchInputValues;
         scope.mainView = scope.view 
      },
      findPages : function(scope) {
         var lastPagePagination;
         scope.typeSearch.values = false;
         scope.typeSearch.pages = true;
         scope.search = undefined;
         scope.search = undefined;
         scope.search = undefined;
         lastPagePagination = Math.ceil(scope.view.length/scope.numProductsInView);
         scope.$broadcast('changePagination', lastPagePagination)
         scope.mainView = scope.view.slice(0, scope.numProductsInView)
      },
      getDb : function(nameDb, scope) {
         scope.product_val.kind = nameDb;
         scope.currentDb.name = nameDb;
         if (!scope.DB[nameDb].value) {
            scope.$emit('startSpinner')
            $http.post(scope.url + "/getDbAdmin", {'nameDb' : nameDb})
            .success(function(data) {
               scope.DB[nameDb].value = data;
               scope.numProducts[nameDb] = data.length;
               scope.view = data;
               scope.$emit('stopSpinner')
            })
            .error(function(err) {
               console.log(err)
               scope.$emit('stopSpinner')
            })
         }
         else {
            scope.view = scope.DB[nameDb].value;
         }
      },
      deleteProduct : function(id, scope) {
         $http.post(scope.url + "/deleteProduct", {"id" : id, "productType" : scope.currentDb.name})
         .success(function(doc) {
            if (doc.success) {
               $rootScope.$emit('showWebAssistant', "продукт удален из БД");
            }
            else {
               $rootScope.$emit('showWebAssistant', "сбой на сервере. обратитесь к сис. админу");
            }
         })
         .error(function(err) {console.log(err)})
      },
      validationAddColor : function(scope) {
         'use strict'
         var 	regExp,
               validColor;
         regExp = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$');
         console.log(scope.product_newColour)
         validColor = regExp.test(scope.product_newColour);	
         console.log(validColor)
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
         var i;
         for(prop in scope.valid) {
            if (scope.valid[prop].value === false) {
               valid = false;
               $rootScope.$emit('showWebAssistant', "введите данные согласно формата");
               break; 
            }
         }
         if (valid) {
            $rootScope.$emit('startSpinner')
            $http.post(scope.url + "/setProductDb", scope.product_val)
               .success(function(doc) {
                  if (doc.id) {  
                     scope.product_id = doc.id
                     scope.product_kind = scope.product_val.kind;
                     $rootScope.$emit('stopSpinner')
                     $rootScope.$emit('showWebAssistant', "продукт добавлен в базу, добавьте фотографии");  
                  }
                  else {
                     $rootScope.$emit('stopSpinner')
                      $rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже"); 
                  }
               })
               .error(function(err) {
                  $rootScope.$emit('stopSpinner')
                  $rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
               })
         }
         else {
             $rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
         }
      },
      setImgDb : function(scope, Upload, typeAction) {
         'use strict';
         var 	prop;
         var   allImg;
         var   id;
         var   counterForResetAllValues;
         var   valid;
         var   interval ;
         var   counterForResetAllValues = 0;
         var   kindProduct;
         var   idImg;
         allImg = scope.product_img;
         if (typeAction === 'add') {
             for (prop in allImg) {
               if(allImg[prop].file) {
                  valid = true
               } 
               else { 
                  valid = false; 
                  break;
               }
            }
         }
         else {
            valid = true;
         }
         if (valid) {
            interval = setInterval(function() {
               if (counterForResetAllValues == 0) {
                  clearInterval(interval)
                  $rootScope.$emit('showWebAssistant', "Все фотографии добавлены в БД");
                  $timeout(function() {
                      $('html, body').animate({scrollTop: 0},1500);
                  },1500)
                  $timeout(function() {
                     clearAllValues(scope)
                  },2000)
               }
            }, 100)
            id = scope.product_id;
            kindProduct = scope.product_kind
            for(prop in allImg) {
               if (typeAction === 'edit') {
                  idImg = scope.product_val.img[prop]
               }
               else {
                  idImg = undefined;
               }
               
               if (allImg[prop].file) {
                  allImg[prop].load_img_begin = true;
                  counterForResetAllValues++
                  console.log('da')
                  Upload.upload({'url': scope.url + "/setImgAdmin_" + prop + "_" + kindProduct, 'data': { 
                     'idImg' : idImg,
                     'id': id,
                     'typeAction' : typeAction,
                     'kindProduct' : kindProduct,
                     'kindImg': prop, 
                     'file': allImg[prop].file, 
                     'typeDb': scope.product_val.kind}})
                     .then(function(res) {
                        allImg[res.data.kindImg].load_img_begin = false;
                        allImg[res.data.kindImg].loaded = true;
                        counterForResetAllValues--
                     })
               }
            }
         }	
         else {
            $rootScope.$emit('showWebAssistant', "Вы добавили не все фотографии");
         }
      },
      getNumberDbProducts : function(scope) {
          $rootScope.$emit('startSpinner')
          $http.get(scope.url + '/getNumberDbProducts')
            .success(function(result) {
               var key;
               var prop;
               var pathForWatch;
               if (result.laptop == 0 && result.tablet == 0) {
                  $rootScope.$emit('showWebAssistant', 'в базе данных нет записей, добавьте бд')
                  $rootScope.$emit('stopSpinner')
                  $rootScope.$emit('setCtrlDescr', 'admin-products')
               }
               else {
                  scope.numProducts.laptop = result.laptop;
                  scope.numProducts.tablet = result.tablet;
                  $rootScope.$emit('stopSpinner')
                  $rootScope.$emit('setCtrlDescr', 'admin-products')
               }
               // main values
               for(prop in scope.valid) {
                  pathForWatch = 'product_val.' + prop;
                  scope.$watch(pathForWatch, function(newVal, oldVal) {
                     if (newVal !== oldVal) {
                        validation(scope)
                     }
                  })
               }
               // sale values
               for(prop in scope.product_val.sale) {
                  pathForWatch = 'product_val.sale.' + prop;
                  scope.$watch(pathForWatch, function(newVal, oldVal) {
                     if (newVal !== oldVal) {
                        validation(scope)
                     }
                  })
               }
            })
            .error(function(err) {
               $rootScope.$emit('showWebAssistant', 'сбой на сервере, повторите позже')
               $rootScope.$emit('stopSpinner')
            })
      },
      clearDb : function(scope) {
          $rootScope.$emit('startSpinner')
          $http.post(scope.url + "/clearProductCommentsImageDb", {})
            .success(function(doc) {
               if (doc.success) {
                  $rootScope.$emit('stopSpinner')
                  $rootScope.$emit('showWebAssistant', "Все БД с товарами, комментариями, изображениями очищены");
                  scope.numProducts.laptop = 0;
                  scope.numProducts.tablet = 0;
               } 
               else {
                  $rootScope.$emit('stopSpinner')
                  $rootScope.$emit('showWebAssistant', "сбой на сервере, обратитесь к сис. админу");
               }           
            })
            .error(function(err) {$rootScope.$emit('showWebAssistant', "возможен сбой на сервере, обратитесь к сис. админу");})
      },
      setRandomProductDb : function(numberRandom, scope) {
         if (numberRandom) {
            if (numberRandom>30 || numberRandom<=0 || (numberRandom%1 != 0)) {
               $rootScope.$emit('showWebAssistant', "не более 30 шт за один раз, число положительное, не равное 0, целое");  
            }
            else {
               $rootScope.$emit('startSpinner')
               $http.post(scope.url + "/setRandomsProductDb", {number : numberRandom})
                  .success(function(doc) {
                     if (doc.success) {
                        $rootScope.$emit('stopSpinner')
                        $rootScope.$emit('showWebAssistant', 'все ' + numberRandom + ' продуктов добавлены');
                     }
                  })
                  .error(function(err) {
                  $rootScope.$emit('stopSpinner')
                  $rootScope.$emit('showWebAssistant', "возможен сбой на сервере, обратитесь к сис. админу");
                  })
            }
            
         }
         else {
             $rootScope.$emit('showWebAssistant', "введите колличество продуктов");  
         } 
      },
      sokcetMessage : function(data, scope) {
         if (!scope.numProducts[data.kind]) {
            scope.numProducts[data.kind] = 0;
            scope.numProducts[data.kind]++ 
         }
         else {
            scope.numProducts[data.kind]++ 
         }
         if (data.counter % 5 == 0     &&   data.counter != data.delta) {
            $rootScope.$emit('showWebAssistant', 'осталось - ' + data.counter + ' продуктов из ' + data.delta)
         }
      },
      editProduct : function(id, scope) {
      scope.productAction = {
            search : false,
            add : false,
            edit : true
         }           
         // $http.post(scope.url + "/editProduct", {"id" : id, "productType" : scope.currentDb.name})
         //    .success(function(doc) {
         //       scope.currentDb.name = doc.kind;
         //       scope.product_val.kind = doc.kind;
         //       scope.product_val.brand = doc.brand;
         //       scope.product_val.model = doc.model;
         //       scope.product_val.guarantee = doc.guarantee;
         //       scope.product_val.price = doc.price;
         //       scope.product_val.operSystem = doc.operSystem;
         //       scope.product_val.cpu = doc.cpu;
         //       scope.product_val.numCores = doc.numCores;
         //       scope.product_val.memory = doc.memory;
         //       scope.product_val.ramMemory = doc.ramMemory;
         //       scope.product_val.screenDiagonal = doc.screenDiagonal;
         //       scope.product_val.screenResolution = doc.screenResolution;
         //       scope.product_val.frontCamera = doc.frontCamera;
         //       scope.product_val.mainCamera = doc.mainCamera;
         //       scope.product_val.battery = doc.battery;
         //       scope.product_val.colours = doc.colours;
         //       scope.productAction = {
         //          search : false,
         //          add : false,
         //          edit : true
         //       }
         //       scope.product_id = doc._id;
         //    })
         //    .error(function(err) {
         //       console.log(err)

         //    })
         var i;
         var prop;
         var arr = scope.DB[scope.currentDb.name].value;
         var arrLength = arr.length;
         for (i = 0; i < arrLength; i++) {
            if (arr[i]._id) {
               scope.product_val = arr[i];
               scope.product_id = arr[i]._id;
               scope.product_kind = arr[i].kind;
               break;
            } 
         }
         for (prop in scope.product_img) {
            scope.product_img[prop].file = undefined;
         }
         console.log(scope.product_val)
         
         // scope.product_id = doc._id;
      },
      addPreparedProduct : function(scope) {
         if (scope.togglePreparedProduct) {
            scope.product_val.brand = 'testBrand',
            scope.product_val.model = 'testModel',
            scope.product_val.guarantee = 12,
            scope.product_val.price = 1111,
            scope.product_val.operSystem = 'tesOperSystem',
            scope.product_val.cpu = 'testCpu',
            scope.product_val.numCores = 1,
            scope.product_val.memory = 11,
            scope.product_val.ramMemory = 512,
            scope.product_val.screenDiagonal = 1.1,
            scope.product_val.screenResolution = '1024*768',
            scope.product_val.frontCamera = 0.1,
            scope.product_val.mainCamera = 1.1,
            scope.product_val.battery = 1111,
            scope.product_val.colours = ['#111', '#555', '#999'],
            scope.product_val.sale.bool = true;
            scope.product_val.sale.discount = 1,
            scope.product_val.sale.descript = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse labore animi blanditiis enim. Odit, recusandae!'
            scope.product_val.raiting = {   val : 1, num : 1, sum : 1  }
            scope.togglePreparedProduct = false;
            validation(scope)
         }
         else {
            scope.product_val.brand = undefined,
            scope.product_val.model = undefined,
            scope.product_val.guarantee = undefined,
            scope.product_val.price = undefined,
            scope.product_val.operSystem = undefined,
            scope.product_val.cpu = undefined,
            scope.product_val.numCores = undefined,
            scope.product_val.memory = undefined,
            scope.product_val.ramMemory = undefined,
            scope.product_val.screenDiagonal = undefined,
            scope.product_val.screenResolution = undefined,
            scope.product_val.frontCamera = undefined,
            scope.product_val.mainCamera = undefined,
            scope.product_val.battery= undefined
            scope.product_val.colours = undefined,
            scope.product_val.sale.bool = undefined;
            scope.product_val.sale.discount = undefined,
            scope.product_val.sale.descript = undefined
            delete scope.product_val.raiting;
            scope.togglePreparedProduct = true;
            validation(scope)
         }  
      }
   }
}]);



