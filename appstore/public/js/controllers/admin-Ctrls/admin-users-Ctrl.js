angular.module('AdminUsersCtrl',[])

.controller('adminUsersCtrl', ['$scope', '$http', 'adminUsersFactory', function($scope,  $http, adminUsersFactory) {
	'use strict';
	
	$scope.allUsers = {};
	$scope.currentGroupUsers = undefined;
	$scope.currentUser = undefined;
	$scope.currentUserComments = undefined;
	// $scope.currentUserBasket = undefined;
	$scope.currentUserAvatar = 'avatar.jpg';
	// number users in view. default - 10 users - 1 page in pagination
	$scope.usersInViewNumber = 10;  
	//number pages in pagination
	$scope.amountPages = undefined; 
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
	//load first 10 users in view
	adminUsersFactory.getUsers(1, $scope);
	//user details
	$scope.userDetails = function(idUser, idComments) {
		adminUsersFactory.getCurrentUserDetails(idUser, idComments, $scope)}
	$scope.deleteUser = function(idUser) {
		adminUsersFactory.deleteUser(idUser, $scope)	}
	//delete bad image-avatar
	$scope.deleteAvatar = function() {
		adminUsersFactory.deleteAvatar($scope.currentUser._id, $scope)}
	//show basket current user
	$scope.showUserBasket = function() {
		$scope.activeItemsAdminUser.userBasket = true;
		$scope.activeItemsAdminUser.userComments = false;}
	//show comments current user
	$scope.showUserComments = function() {
		$scope.activeItemsAdminUser.userBasket = false;
		$scope.activeItemsAdminUser.userComments = true;}
	//delete bad comment
	$scope.deleteComment = function(idThisComment) { 
		adminUsersFactory.deleteComment(idThisComment, $scope.currentUser.commentsId, $scope)}
	//watcher - last page pagination value
	$scope.$watch('amountPages', function(newVal, oldVal) {
		if (newVal && newVal !== oldVal) {	
			$scope.$broadcast('changePagination', newVal)	
		}})
	//watch for change avatar
	$scope.$watch('currentUser', function(newVal, oldVal) {
		if (newVal && newVal.username) {
			$scope.currentUserAvatar = $scope.currentUser.avatarId || 'avatar.jpg';
		}
	})
}]);