
angular.module('AutentificCtrl')

.factory('autentificFactory',  ['$http', '$rootScope', '$timeout', '$cookies', function($http, $rootScope, $timeout, $cookies) {
	'use strict';

		function successLogin(username, scope) {
			'use strict';
			var arrRaiting;
			var i;
			$rootScope.$emit('showWebAssistant', "Здравствуйте," + username + ".");
			scope.activItems.loginMain = false;
			scope.activItems.log_out = true;
			scope.activItems.private_account = false;
			scope.user.username = undefined;
			scope.user.password = undefined;
			scope.user.password = undefined;
			scope.user.email = undefined;
			if (username !== "admin") {
				scope.activItems.avatarImg = true;
				scope.activItems.basket = true;
				arrRaiting = scope.rootUser.raitings;
				$rootScope.rootUser.objRaiting = {};
				for (i = 0; i < arrRaiting.length; i++) {
					$rootScope.rootUser.objRaiting[arrRaiting[i]] = true
				}
			}
			$rootScope.$emit('stopSpinner');
		}
	return {
		//готово
		inspectSession : function(scope) {
			$http.post(scope.url.session)
				.success(function(res) {
					if (res.username) {
						$rootScope.rootUser = res;
						successLogin(res.username, scope)
						// scope.activItems.private_account = false;
						// scope.activItems.hello = true;
						// scope.activItems.basket = true;
						// scope.activItems.log_out = true;
						// $rootScope.$emit('showWebAssistant', "Здравствуйте, " + res.username);

					}
					else {
						
					}
				})
				.error(function(err) {})					
		},
		//готово
		login : function(scope) {
			'use strict';
		
			
			if (scope.user.username && scope.user.password) {
				$rootScope.$emit('startSpinner')
				$http.post(scope.url.login, scope.user)
					.success(function(res) {
						if (res.username) {
							if (res.rights === 'admin') {
								$rootScope.adminKeyAccess = res.keyAccess;
								$rootScope.rootUser = res;
								successLogin(res.username, scope)
							};
							if (res.rights === 'user') {
								$rootScope.rootUser = res;									
								successLogin(res.username, scope)							
							};							
						}
						else {
							$rootScope.$emit('showWebAssistant', res);
							$rootScope.$emit('stopSpinner')
						}	
					})
					.error(function(err) {
						if (err) throw (err);
						$rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже");
						$rootScope.$emit('stopSpinner')
					})		
				}
			else {
				$rootScope.$emit('showWebAssistant', "заполните поля 'логин' и 'пароль'");
			}
		},
		//готово
		logOut : function(scope) {
			delete $rootScope.rootUser;
			scope.activItems.private_account = true;
			$http.get(scope.url.logOut)
				.success(function(res) {
					if (res.deleteCookie) {
						$cookies.remove('user.session')

					}
				})
				.error(function(err) {})
		},	
		//готово
		registr : function(scope, Upload) {
			'use strict';
			var user = scope.user;
			function successRegistr() {
				$rootScope.$emit('showWebAssistant', "Вы зарегестрированы! Зайдите в систему.");
				scope.activItems.tab_login = true;
				scope.activItems.tab_registr = false;
				scope.activItems.loginForm = true;
				scope.activItems.registrForm = false;
				scope.user.username = undefined;
				scope.user.password = undefined;
				scope.user.password = undefined;
				scope.user.email = undefined;
				$rootScope.$emit('stopSpinner');
			}
			if (user.password === user.passwordRep) {
				$rootScope.$emit('startSpinner')
				$http.post(scope.url.registr, user)
					.success(function(newUser) {
						if (newUser._id)  {
							if (scope.avatarImg) {
								Upload.upload({'url': scope.url.postAvatar, 'data': {'id': newUser._id, 'file': scope.avatarImg}})
								.then(function(avatarId) {
									if (avatarId.data) {
										$rootScope.rootUser.avatarId = avatarId.data.id;
										successRegistr()
									}
									else { $rootScope.$emit('showWebAssistant', "сбой на сервере, повторите позже")}
								})
							}
							else { successRegistr()	}	
						}
						else {
							$rootScope.$emit('showWebAssistant', newUser);
							$rootScope.$emit('stopSpinner');
						}	
					})
					.error(function(err) {
						if (err) throw (err);
						$rootScope.$emit('showWebAssistant', "сбой на сервере, повторите");
						$rootScope.$emit('stopSpinner');
					})
			}
			else { $rootScope.$emit('showWebAssistant', "Ваши пароли не совпадают")	}
		},
		toggleTabs : function(name, data) {	
			'use strict';
			if (name === 'loginForm') {
				data.activItems.loginForm = true;
				data.activItems.registrForm = false;
				data.activItems.tab_login = true;
				data.activItems.tab_registr = false;
			} else {
				data.activItems.loginForm = false;
				data.activItems.registrForm = true;
				data.activItems.tab_registr = true;
				data.activItems.tab_login = false;
			}
		}
		
	}
}]);

