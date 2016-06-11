
angular.module('GoodsCtrl')

.factory('goodsFactory', ['$http',  function($http) {	
	return {
		 
		getStartData : function(data) {
			$http.get(data.postsUrl.urlStartData)
				.success(function(res) {
					'use strict'
					var	startGoods;
					startGoods = res['tablet'];
					data.ALL_GOODS['tablet'] = startGoods;
					data.ALL_BRENDS = res.allBrends[0];
					data.minAndMaxVal = res.valMinMax[0];
					data.amountPages = Math.ceil((startGoods.length)/(data.numberGoodsView));
					data.currentGoods = startGoods.slice(0, data.numberGoodsView);	
				})
				.error(function(err) {console.log(err)});	
		},
		toggleNav : function(typeGoods, event, data) {
			'use strict';
			event.preventDefault();
			var 	url,
					curTypeGoods,
					goodsInView;
			
			goodsInView = data.numberGoodsView;
			curTypeGoods = data.ALL_GOODS[typeGoods];
			data.goodsActivItems.goodsNav = typeGoods;
			data.currentTypeGoods = typeGoods;
			//if scope contains this data
			if (curTypeGoods) {
				data.currentGoods = data.ALL_GOODS[typeGoods];
				data.amountPages = Math.ceil((curTypeGoods.length)/(goodsInView));
				data.goodsCurrentPage = curTypeGoods.slice(0, goodsInView)
			}
			//if scope not contains this data
			else {
				url = data.postsUrl.urlGetTypeGoods + typeGoods,
				$http.get(url)
					.success(function(res) {
						data.currentGoods = res;
						data.ALL_GOODS[typeGoods] = res;
						data.amountPages = Math.ceil((res.length)/(goodsInView));
						data.goodsCurrentPage = res.slice(0, goodsInView)	
					})
					.error(function(err) {console.log(err)});	
			}
		},
		toggleBar : function(typeBar, data) {
			data.postsUrl.urlBar = "../../template/goods." + typeBar + ".html";
			data.goodsActivItems.goodsBar = typeBar; 
		},
		createSliders : function(allSlidersVal) {
			'use strict';
			var 	thisSliderVal,
					prop,
					newSlider,
					nameSlider,
					arrSliders; 
			arrSliders = [];
			function Slider(name, values) {
				this.nameSlider = name;
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
			for (prop in allSlidersVal) {
				nameSlider = prop;
				thisSliderVal = allSlidersVal[prop];
				newSlider = new Slider(prop, thisSliderVal);
				arrSliders.push(newSlider)
			}
			return arrSliders;
		},
		toggleCheckBox : function(brend, boolean, brendsThisGoods) {
			if (boolean) {
				brendsThisGoods[brend] = false;
			}
			else {
				brendsThisGoods[brend] = true;
			}
		}
	}
}]);
