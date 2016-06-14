
angular.module('ProductsInfoCtrl')

.factory('productsInfoFactory', ['$http', '$rootScope', '$timeout',  function($http, $rootScope, $timeout) {	
	
	function prettyDate(milisec) {
		'use strict';
		var	month,
				date,
				hours,
				minutes,
				prettyFullDate,
				fullDate;
		
		function prettyItem(value) {
			'use strict';
			var prettyValue;
			if (String(value).length === 1) {
				prettyValue = "0" + String(value);
			}
			else {
				prettyValue = value
			}
			return String(prettyValue);
		}
		fullDate = new Date(milisec);
		month = prettyItem(fullDate.getMonth() + 1 );
		date = prettyItem(fullDate.getDate())
		hours = prettyItem(fullDate.getHours())
		minutes = prettyItem(fullDate.getMinutes())		
		prettyFullDate = hours + ":" + minutes + ", " + date + "-" + month + "-" + String(fullDate.getFullYear());	
		return prettyFullDate;
	};

	return {
		prettyDatePublic : function(milliseconds) {
			return prettyDate(milliseconds)
		},
		setComment : function(scope, url) {
			'use strict';
			var 	i,
					commentDate,
					newComment = {},
					milisec;
			if (scope.userCommentLength && scope.userCommentLength < 300) {
				if ($rootScope.rootUser.rights && $rootScope.rootUser.rights === 'user') {
					milisec = new Date().getTime();
					//спинер не пашет
					$rootScope.$emit('startSpinner');
					$http.post(url, {
						'kindProduct' : scope.currentProduct.kind,
						'idProduct' : scope.currentProduct._id,
						'idComments' : scope.currentProduct.comments.idComments,
						'milisec' : milisec,
						'text' : scope.userComment,
						'user' : $rootScope.rootUser.username,
						'idCommentsUser' : $rootScope.rootUser.commentsId})
						.success(function(doc) {
							if (doc.success) {
								newComment.user = $rootScope.rootUser.username;
								newComment.date = prettyDate(milisec);
								newComment.text = scope.userComment;

								scope.productComments.push(newComment);
								$rootScope.$emit('showWebAssistant', "комментарий добавлен"); 
								$rootScope.$emit('stopSpinner')
							}
							else {
								$rootScope.$emit('stopSpinner')
								$rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже"); 
							}
						})
						.error(function(err) {
							$rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже"); 
							$rootScope.$emit('stopSpinner')
						})	
				}
				else {
					$rootScope.$emit('showWebAssistant', "комментарии могут оставлять только зарегестрированные пользователи"); 
					$timeout(function() {
						scope.infoMessage = undefined;
					}, 3000)
				}
			}
			else {
				scope.infoMessage = "максимальное количество символов в сообщении - 300"
			}	
		}, 
		showInfo : function(scope, product) {
			'use strict';
			var 	arrCommentsLength,
					i;
			scope.currentProduct = product;
			$http.post(scope.data.url.getComments, {
				"idComments" : product.comments.idComments,
				"db" : product.kind})
				.success(function(doc) {
					console.log(doc)
					arrCommentsLength = doc.length;
					// console.log()
					for (i = 0; i < arrCommentsLength; i++) {
						doc[i].date = prettyDate(doc[i].dateMilisec)
					}
					scope.productComments = doc;
				})
				.error(function(err) {
					console.log(err)
					// message
				})	
		}
	}
}]);
