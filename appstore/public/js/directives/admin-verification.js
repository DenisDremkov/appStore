angular.module('AdminCtrl')

.directive('inspectAdmin', function($rootScope){
	return{
		restrict: 'A',
		priority: 100000,
		scope: false,
		link: function(){
		},
		compile:  function(element, attr, linker){
			console.log($rootScope.adminKeyAccess)
			if (!$rootScope.adminKeyAccess) {
				console.log('ne admin')
				element.children().remove();
				element.remove();
			}
			else {
				console.log('admin')
			}
			// var accessDenied = true;
			// var user = authService.getUser();

			// var attributes = attr.access.split(" ");
			// for(var i in attributes){
			// 	if(user.role == attributes[i]){
			// 		accessDenied = false;
			// 	}
			// }
			// if(accessDenied){
			// 	element.children().remove();
			// 	element.remove();           
			// }

		}
	}
});