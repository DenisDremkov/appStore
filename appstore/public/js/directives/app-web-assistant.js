angular.module('appStore')


.directive('webAssistant',  ['$timeout', function($timeout) {
	return {
		// <img ng-show = 'assistantImg' class='assistant_img' src='img/assistant.png' alt=''>\
							// <p ng-show = 'assistantMessage' class = 'assistant_message'>{{webAssistantMessage}}</p>\
		template : "<div>\
							<img  class='assistant_img' src='img/assistant.png' alt='assistant'>\
							<p  class = 'assistant_message'>{{webAssistantMessage}}</p>\
						</div>",
		scope: true,
		link: function (scope, element, attributes) {
			scope.$watch('webAssistant', function(newVal, oldVal) {
				if (newVal) {
					'use strict';
					var wrapElement;
					var imgElement; 
					var messageElement;
					var messageText;
					messageText = newVal;
					imgElement = element.find('img');
					messageElement = element.find('p');
					element.css('display', 'block')
					element.css('z-index', 10000)
					imgElement.addClass('assistant_active')
					$timeout(function() {
						messageElement.addClass('assistant_active')
					},500)
					$timeout(function() {
						imgElement.removeClass('assistant_active')
						messageElement.removeClass('assistant_active')
						element.css('z-index', -10000)
					},3500)
				}
			})
		}
	}
}])