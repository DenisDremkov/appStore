
angular.module('AdminUsersCtrl')

.factory('adminUsersFactory', ['$http', 'productsInfoFactory',   function($http, productsInfoFactory) {
	'use strict';
	console.log(productsInfoFactory)
	return {
		getUsers: function(page, scope) {
			'use strict';
			if (scope.allUsers[page]) {
				scope.currentGroupUsers = scope.allUsers[page]
			}
			else{
				scope.$emit('startSpinner')
				$http.post(scope.url.getGroupUsers, {'page' : page, "viewNum": scope.usersInViewNumber})
					.success(function(result) {
						scope.allUsers[page] = result.usersView;
						scope.currentGroupUsers = result.usersView;
						scope.amountPages = Math.ceil(result.numberAllUsers / scope.usersInViewNumber);
						scope.$emit('stopSpinner')
					})
					.error(function(err) {
						scope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
					})
	
			}
		},
		getCurrentUserDetails : function(idUser, idComments, scope) {
			
			$http.post(scope.url.getCurrentUserComments, {'idCommentsDb' : idComments})
				.success(function(result) {
					'use strict';
					var i;
					var arrComments;
					arrComments = result;
					for (i = 0; i < arrComments.length; i++) {
						arrComments[i].prettyDate = productsInfoFactory.prettyDatePublic(arrComments[i].dateMilisec)
					}
					scope.currentUserComments = arrComments;
				})
				.error(function(err) {
					scope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
				})
			for (var i = 0; i < scope.currentGroupUsers.length; i++) {
				if (scope.currentGroupUsers[i]._id === idUser) {
					scope.currentUser = scope.currentGroupUsers[i];
					break;
				}
			}	
		},
		deleteComment : function(idDeletedComment, idCommentsDb, scope) {
			scope.$emit('startSpinner')
			$http.post(scope.url.deleteComment, {
				'idDeletedComment' : idDeletedComment,
				'idCommentsDb' : idCommentsDb})
				.success(function(result) {
					for (var i = 0; i < scope.currentUserComments.length; i++) {
						if (scope.currentUserComments[i]._id === idDeletedComment) {
							scope.currentUserComments.splice(i, 1)
							break;
						}
					}
					scope.$emit('stopSpinner')
					scope.$emit('showWebAssistant', "комментарий удален из базы данных");
				})
				.error(function(err) {
					scope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
				})
		},
		deleteAvatar : function(idUser, scope) {
			if (scope.currentUser.avatarId) {
				$http.post(scope.url.deleteAvatar, {'idUser' : idUser})
					.success(function(result) {
						if (result.success) {
							scope.$emit('showWebAssistant', "фотография удалена с сервера");
							scope.currentUser.avatarId = undefined;
							scope.currentUserAvatar = scope.currentUser.avatarId || 'avatar.jpg'
						}
						else {
							scope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
						}
					})
					.error(function(err) {
						scope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
					})
			}
			else {
				scope.$emit('showWebAssistant', "у данного пользователя нет фотографии");
			}
		},
		deleteUser : function(idUser, scope) {
			scope.$emit('startSpinner')
			$http.post(scope.url.deleteUser, {'idUser' : idUser})
				.success(function(result) {
					if (result.success) {
						for (var i = 0; i < scope.currentGroupUsers.length; i++) {
							if (scope.currentGroupUsers[i]._id === idUser) {
								scope.currentGroupUsers.splice(i, 1);
								scope.currentUser = undefined;
								scope.$emit('stopSpinner')
								if (result.avatar) {
									scope.$emit('showWebAssistant', "пользователь удален из всех баз. аватар удален");
								}
								else {
									scope.$emit('showWebAssistant', "пользователь удален из всех баз");
								}
								break;
							}
						}
					}
					else {
						scope.$emit('stopSpinner')
						scope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
					}

				})
				.error(function(err) {
					scope.$emit('stopSpinner')
					scope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
				})
		}	
	}
}]);





















// inspectSession : function(data) {
// 	$http.post(data.url.session)
// 		.success(function(res) {
// 			if (res.username) {
// 				data.user.username = res.username;
// 				data.user.password = res.password;
// 				data.user.email = res.email;
// 				data.user.rights = res.rights;
// 				data.user.visits = res.visits;
// 				data.user.session = res.session;
// 				data.user.basket = res.basket;
// 				data.user.comments = res.comments;
// 				data.user.reitings = res.reitings;
// 				data.user.prevStateApp = res.prevStateApp;
// 				data.user.avatarId = res.avatarId;
// 				data.activItems.private_account = false;
// 				data.activItems.hello = true;
// 				data.activItems.basket = true;
// 				data.activItems.log_out = true;	
// 			}
// 		})
// 		.error(function(err) {if (err) throw (err)})					
// },
// login : function(data) {
// 	if (data.user.username && data.user.password) {
// 		data.activItems.log_in_spinner = true;
// 		$http.post(data.url.login, data.user)
// 			.success(function(res) {

// 				if (res.username) {
// 					if (res.rights === 'admin') {
// 						$rootScope.adminKeyAccess = res.keyAccess;
// 						console.log(res)
// 						data.user = res;
// 						data.activItems.avatarImg = true;
// 						data.activItems.hello = true;
// 						data.activItems.basket = false;
// 						data.activItems.log_out = true;
// 						data.activItems.private_account = false;
// 					};
// 					if (res.rights === 'user') {
// 						data.user = res;
// 						data.activItems.avatarImg = true;
// 						data.activItems.hello = true;
// 						data.activItems.basket = true;
// 						data.activItems.log_out = true;
// 						data.activItems.private_account = false;
// 					};	
// 					console.log($rootScope.adminKeyAccess)					
// 					$timeout(function() {
// 						data.message.login = "Вы авторизованы";
// 						data.message.login_success_msg = true;
// 						data.activItems.log_in_spinner = false;
// 						data.activItems.log_in_check = true;
// 						$timeout(function() {
// 							data.activItems.loginMain = false;
// 							data.message.login = undefined;
// 							data.activItems.log_in_check = false;
// 							data.message.login_success_msg = false;
// 						},2000)
// 					},500)
// 				}
// 				else {
// 					$timeout(function() {
// 						data.message.login = res;
// 						data.activItems.log_in_spinner = false;
// 						$timeout(function() {
// 							data.message.login = undefined;
// 						},2000)
// 					},500)
// 				}	
// 			})
// 			.error(function(err) {
// 				if (err) throw (err);
// 				data.message.login = "сбой на сервере, повторите";
// 			})		
// 		}
// 	else {
// 		data.message.login = "Ввведите логин и пароль";
// 	}
// },
// logOut : function(data) {
// 	$http.get(data.url.logOut)
// 		.success(function(res) {
// 			location.reload();
// 		})
// 		.error(function(err) {
			
// 		})
// },	
// toggleTabs : function(name, data) {
// 	if (name === 'loginForm') {
// 		data.activItems.loginForm = true;
// 		data.activItems.registrForm = false;
// 		data.activItems.tab_login = true;
// 		data.activItems.tab_registr = false;
// 	} else {
// 		data.activItems.loginForm = false;
// 		data.activItems.registrForm = true;
// 		data.activItems.tab_registr = true;
// 		data.activItems.tab_login = false;
// 	}
// },
// registr : function(data) {
// 	var user = data.user;
// 	if (user.password === user.passwordRep) {
// 		$http.post(data.url.registr, data.user)
// 			.success(function(res) {
// 				if (res._id) {
// 					if (data.avatarImg) {
// 						Upload.upload({'url': data.url.postAvatar, 'data': {'id': res._id, 'file': data.avatarImg}})
// 						.then(function(res) {
// 							if (res.data) {
// 								data.user.avatarId = res.data.id;
// 							}
// 						})
// 						}
// 				}
// 				else {
// 					data.message.registr = "сбой на сервере, повторите";
// 				}	
// 			})
// 			.error(function(err) {
// 				if (err) throw (err);
// 				data.message.registr = "сбой на сервере, повторите";
// 			})
// 	}
// 	else {
// 		data.message.registr = "пароли не совпадают"
// 	}
// }	