
// pag - pagination, val - value, nav - navigation, arr - array
// (function() {
// // использовать с app.run!!!!!!!!!!!!!
// $(document).ready(function() {
// 	setTimeout(function() {
// 		$('#preloader').fadeOut(500);
// 	},3000)
// })
// })();



(function() {
	
	angular.module('appStore', [
		'AutentificCtrl',
		'MainCtrl',
		'ProductsMainCtrl',
		'ProductsSearchCtrl',
		'ProductsInfoCtrl',
		'ProductsCompareCtrl',
		'AdminMainCtrl',
		'AdminProductsCtrl',
		'AdminUsersCtrl',
		'AdminAnalitikaCtrl',
		// 'LoginCtrl',
		// 'ProductsCtrl',
		// 'AdminCtrl',
		 'btford.socket-io',
		'ui.router',
		'rzModule', 
		'ngAnimate',
		'ngCookies',
		'ngFileUpload',
		'angular-carousel' 
	])
	.config(uiRouterConfig)
	// factory('mySocket', function (socketFactory) {
	// 	return socketFactory();
	// })
	// .run(function() {
	// 	// $rootScope.$emit('stopSpinner')
	// })
		
	function uiRouterConfig($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('products', {
				url: '/',
				templateUrl:'../template/products/products-MAIN.html'})
			.state('aboutUs', {
				url: '/aboutUs',
				templateUrl:'../template/aboutUs/aboutUs-MAIN.html'})
			.state('contacts', {
				url: '/contacts',
				templateUrl:'../template/contacts/contacts-MAIN.html'})
			.state('admin', {
				url: '/admin',
				templateUrl:'../template/admin/admin-MAIN.html'})
			.state('proektInfo', {
				url: '/proektInfo',
				templateUrl:'../template/infoProjekt/projectInfo-MAIN.html'})
	}
})();









