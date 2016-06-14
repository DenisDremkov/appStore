
angular.module('ProductsSearchCtrl')

.factory('productsSearchFactory', ['$http',   function($http) {

	function createSliders(slidersVal) {
		// console.log(slidersVal)
		'use strict';
		var 	thisSliderVal,
				prop,
				newSlider,
				nameSlider,
				arrSliders = []; 
		function Slider(name, values) {

			this.nameSlider = name;
			this.rusName = values.rus;
			this.min = values.min;
			this.max = values.max;
			this.options = {};	
			this.options.floor = values.min;
			this.options.ceil = values.max;
			this.options.changed = {value : 0};
			this.options.onEnd = function(w, currentMin, currentMax) {
				this.changed.value ++;
			}
		}
		for (prop in slidersVal) {

			nameSlider = prop;
			thisSliderVal = slidersVal[prop];
			newSlider = new Slider(prop, thisSliderVal);
			arrSliders.push(newSlider)
		}

		return arrSliders;
	};
	return {
		createNewSliders : function(scope, data) {
			var 	thisSlidersVal,
					pathForWatch,
					i,
					currentProducts,
					arrSliders;
			currentProducts = data.currentTypeProducts;
			thisSlidersVal =  data.MIN_AND_MAX_VALUES[currentProducts];
			arrSliders = createSliders(thisSlidersVal);
			data.slidersView = arrSliders;
			for (i = 0; i < arrSliders.length; i++) {
				// console.log(arrSliders[i])
				pathForWatch = "data.slidersView[" + i + "]['options']['changed']['value']"
				scope.$watch(pathForWatch, function(newVal, oldVal) {
					if (newVal !== oldVal) {
						scope.$emit('newValuesSliders')	
					}
					// scope.$emit('newValuesSliders')
				})
			}			
		}
	}	
}]);
