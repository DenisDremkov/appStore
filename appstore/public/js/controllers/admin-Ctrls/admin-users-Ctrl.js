angular.module('AdminUsersCtrl',[])

.controller('adminUsersCtrl', ['$scope', '$http', 'adminUsersFactory', function($scope,  $http, adminUsersFactory) {
	'use strict';
	//программа писалась из расчета что в базе очень много зарегестрированных пользователей 
	//(поэтому запрос идет частями в зависимости от выбранной страницы)
	$scope.allUsers = {};
	$scope.currentGroupUsers = undefined;
	$scope.currentUser = undefined;
	$scope.currentUserComments = undefined;
	// $scope.currentUserBasket = undefined;
	$scope.currentUserAvatar = 'avatar.jpg';
	$scope.usersInViewNumber = 10;  // number users in view. default - 10 users - 1 page in pagination
	$scope.amountPages = undefined; //number pages in pagination
	$scope.url = {
		getGroupUsers: 'http://localhost:3000/getGroupUsers',
		getCurrentUserComments : 'http://localhost:3000/getCurrentUserComments',
		deleteComment : 'http://localhost:3000/deleteComment',
		deleteAvatar : 'http://localhost:3000/deleteAvatar',
		deleteUser : 'http://localhost:3000/deleteUser'

	}
	$scope.activeItemsAdminUser = {
		'userBasket' : false,
		'userComments' : false
	}
	//watch for change avatar
	$scope.$watch('currentUser', function(newVal, oldVal) {
		if (newVal && newVal.username) {
			$scope.currentUserAvatar = $scope.currentUser.avatarId || 'avatar.jpg';
		}
	}) 
	//load first 10 users in view
	adminUsersFactory.getUsers(1, $scope);
	//user details
	$scope.userDetails = function(idUser, idComments) {
		adminUsersFactory.getCurrentUserDetails(idUser, idComments, $scope)
	}
	//pagination
	$scope.$watch('amountPages', function(newVal, oldVal) {
		if (newVal && newVal !== oldVal) {	$scope.$broadcast('changePagination', newVal)	}
	})
	//delete bad comment
	$scope.deleteComment = function(idThisComment) {
		adminUsersFactory.deleteComment(idThisComment, $scope.currentUser.commentsId, $scope)
	}
	//delete bad image-avatar
	$scope.deleteAvatar = function() {
		adminUsersFactory.deleteAvatar($scope.currentUser._id, $scope)
	}
	$scope.showUserBasket = function() {
		$scope.activeItemsAdminUser.userBasket = true;
		$scope.activeItemsAdminUser.userComments = false;
	}
	$scope.showUserComments = function() {
		$scope.activeItemsAdminUser.userBasket = false;
		$scope.activeItemsAdminUser.userComments = true;
	}
	$scope.deleteUser = function(idUser) {
		adminUsersFactory.deleteUser(idUser, $scope)
	}
}]);