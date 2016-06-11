

//выравнивание блоков по высоте при полной загрузке. после реади не получалось
$(window).load(function() {
	
	var max_h = 0;	
	
	function my_equal_height(elenemts) {
		$(elenemts).each(function(){
			$(this).height("auto");
			var www = $(this).outerHeight();
			var this_h = $(this).outerHeight();			
			if ( this_h>= max_h ) {
				max_h = this_h;
			}
		});
		$(elenemts).height(max_h);
		max_h=0;
	};

	window_w = $(window).width();
	
	if (window_w>=768) {
		my_equal_height(".js_s5_lineHeight");
		my_equal_height(".s3_top .item_text");
	}
	else {
		$(".js_s5_lineHeight").height('auto');
		$(".s3_top .item_text").height('auto');
	};


	$(window).resize(function() {
		// 768  784 
		window_w = $(window).outerWidth(true);
		console.log(window_w);
		if (window_w>=751) { 
			my_equal_height(".js_s5_lineHeight");
			my_equal_height(".s3_top .item_text");
		}
		else {
			$(".js_s5_lineHeight").height('auto');
			$(".s3_top .item_text").height('auto');
		}
	});
});


$(document).ready(function(){

	//header_my_paralax
	$(window).scroll(function() {
		var w_scroll_t = $(window).scrollTop();
		var cont_top = $('header').offset().top;
		var cont_height = $('header').height();
		var cont_bottom = cont_top + cont_height;
		if (cont_top<=w_scroll_t && cont_bottom>=w_scroll_t ) {
		console.log('222')
			var	p_translate = "translate(0px,"+w_scroll_t+"px";
			$('.view_port_paralax').css({"transform": p_translate});
		}
	});

	// фиксир кнопка справа - возврат в хедер
	var win_height = $(window).height();
	
	//правый нижний угол топ скролл
	$(window).scroll(function() {
		var window_Scroll = $(window).scrollTop();
		if (window_Scroll>win_height) {
			$('#link_top_scroll').show();
		}
		else {
			$('#link_top_scroll').hide();
		}
	});

	//бесконечная анимация с заданными интервалами 
	setInterval(function() {
		$('#link_top_scroll').addClass('animated bounce')
		setTimeout(function() {
			$('#link_top_scroll').removeClass('animated bounce')
		},1000);
		var i = 0;
		i++
	},10000);
	
	// s_6 круги показать пустые круги
	$('.s_6_circle').circleProgress({
		size: 145,
		thickness: 5,
		emptyFill: "rgba(238, 238, 238,1)",
		fill: {gradient: ["#e83a93", "#e83a93"]},
		startAngle: -1.57, 
		lineCap: 'square', 
	});

	//сработка один раз при скролле
	var current_scroll=0;
	$(window).scroll(function() {
		if (current_scroll==0) {
			var window_Scroll = $(window).scrollTop();
			var s6_posY = $('.section_6').offset().top-100;
			if (s6_posY<=window_Scroll) {

				$('.s_6_circle').circleProgress().on('circle-animation-progress', function(event, progress, stepValue) {
				$(this).find('strong').text(String(stepValue.toFixed(2)).substr(2)+"%").animate({"fontSize": "30px","opacity":1}, 1000);
				}); 
				var	c1 = $('#circle1 strong').data("num")/100;
				var	c2 = $('#circle2 strong').data("num")/100;
				var	c3 = $('#circle3 strong').data("num")/100;
				var	c4 = $('#circle4 strong').data("num")/100;
				var	c5 = $('#circle5 strong').data("num")/100;

				$('#circle1').circleProgress({value: c1,}); 
				$('#circle2').circleProgress({value: c2,}); 
				$('#circle3').circleProgress({value: c3,}); 
				$('#circle4').circleProgress({value: c4,}); 
				$('#circle5').circleProgress({value: c5,});
				return current_scroll++;
			};
			return current_scroll;	
		};	
	});
			
		

	// link for  next section
	$("a[href*='#section_1']").mPageScroll2id();
	$("a[href*='#section_2']").mPageScroll2id();
	$("a[href*='#section_3']").mPageScroll2id();
	$("a[href*='#section_4']").mPageScroll2id();
	$("a[href*='#section_5']").mPageScroll2id();
	$("a[href*='#section_6']").mPageScroll2id();
	$("a[href*='#section_7']").mPageScroll2id();
	$("a[href*='#section_8']").mPageScroll2id();
	$("a[href*='#section_9']").mPageScroll2id();
	$("a[href*='#section_10']").mPageScroll2id();


	
	$('#h_toggle_nav').click(function () {
		
		$('.btn_line_1, .btn_line_2, .btn_line_3').toggle();
		$('.btn_line_rotate1, .btn_line_rotate2').toggle();
		var sss = $('.btn_line_rotate2').css("display");
		if (sss=="block") {
			$('body').css("overflow-y", "hidden");
		}
		else {
			$('body').css("overflow-y", "visible");
		}
		var winwidth = $(window).width();
		var winHeight = $(window).height();
		$('.h_responsive_nav').width(winwidth);
		$('.h_responsive_nav').height(winHeight);
		$('.h_responsive_nav').toggle();
	});	
	

	// click item of nav_responsive
	$('.h_responsive_nav a').click(function () {
		$('.h_responsive_nav').toggle();
		$('.btn_line_1, .btn_line_2, .btn_line_3').toggle();
		$('.btn_line_rotate1, .btn_line_rotate2').toggle();
		var sss = $('.btn_line_rotate2').css("none");
		if (sss=="block") {
			$('body').css("overflow-y", "hidden");
		}
		else {
			$('body').css("overflow-y", "visible");
		}
	});

	
	//карусель вторая секция
	$('.s2_carousel').carousel({
		interval:false,
	});


	//карусель 4 секция клиенты
  	$("#s4_carousel_clients").owlCarousel({
  		navigation : true,
  		items : 4,
  		pagination : false,
  		autoPlay : 5000,
  	});



  	//карусель 4 секция команда
  	$("#s4_carousel_team").owlCarousel({
  		navigation : true,
  		items : 4,
  		pagination : false,
  		// autoPlay : 5000,
  		// navigation : false,
  	});


  	//s_7 карусельки
  	$("#s7_owl_top").owlCarousel({
  		items : 7,
  		autoPlay : 3000,
  		pagination : false,
  	});
  	$("#s7_owl_bottom").owlCarousel({
  		items : 7,
  		autoPlay : 3000,
  		pagination : false,
  	});

})	 // end /Ready	



























	//fixed svg_icon top_left hide_show//deleted production
	// $('#show-hide-fixed-svg').click(function() {
	// 	$('.container_for_svg').toggle()
	// });


	
	 // 	$(window).resize(function() {
  // 		console.log('222')
  // 		var maxHeight = 0;
		// $(".js_s5_lineHeight").each(function(){
		// 	if ( $(this).height() > maxHeight ) {
		// 		maxHeight = $(this).height();
		// 		console.log(maxHeight);
		// 	};
		// });
		// $(".js_s5_lineHeight").height(maxHeight);
  // 	});

	//resize function
	//header navigation responsive 
	// $(window).resize(function () {
	// 	// console.log('111');
	// 	var winWidth = $(window).width();
	// 	var winHeight = $(window).height();
	// 	if (winWidth>1184) {
	// 		$('.h_responsive_nav').hide()
	// 	}
	// 	else {
	// 		$('.h_responsive_nav').width(winWidth);
	// 		$('.h_responsive_nav').height(winHeight);
	// 	}
	// });

	// $(window).resize(function(){
	// 	alert('Размеры окна браузера изменены.');
	// });

	//s5 выравниваем блоки по высоте. абзацы
	//при загрузке страницы
	//s5 выравниваем блоки по высоте. абзацы
	//при ресайзе
	
		// var maxHeight = 0;
		// $(".js_s5_lineHeight").each(function(){
		// 	if ( $(this).height() > maxHeight ) {
		// 		maxHeight = $(this).height();
		// 	}
		// });
		// $(".js_s5_lineHeight").height(maxHeight);


		//в хедере менюшка при малых экранах прячется с задержкой

	// $('#h_toggle_nav').addClass("animated swing infinite");
	// $('#h_toggle_nav').css("opacity", "1");
	// $('.h_responsive_nav').show();// прячем основное респонз меню при загрузке страницы

	// setTimeout(function() {
	// 	$('#h_toggle_nav').css("opacity", "0.3");
	// 	$('#h_toggle_nav').removeClass("animated swing infinite");
	// 	$('#h_toggle_nav').css("right", "-80px");

		
	// 	$('#h_toggle_nav').mouseenter(function() {
	// 		$('#h_toggle_nav').css("opacity", "0.7");
	// 		$('#h_toggle_nav').css("right", "10px");	
	// 	});
	// 	$('#h_toggle_nav').mouseleave(function() {
	// 		$('#h_toggle_nav').css("opacity", "0.3");
	// 		$('#h_toggle_nav').css("right", "-80px");
	// 	});

	// },3000);


	// if (s6_posY>window_Scroll && counter_s6==0 ) {
		// 	var counter_s6 = 0;
		// 	$('.s_6_circle').circleProgress({
		// 		size: 145,
		// 		thickness: 5,
		// 		emptyFill: "rgba(238, 238, 238,1)",
		// 		fill: {gradient: ["#e83a93", "#e83a93"]},
		// 		startAngle: -1.57, 
		// 		lineCap: 'square', 
		// 	})
		// 	.on('circle-animation-progress', function(event, progress, stepValue) {
		// 	$(this).find('strong').text(String(stepValue.toFixed(2)).substr(2)+"%").animate({fontSize: "30px"}, 1000);
		// 	}); 

		// 	$('#circle1').circleProgress({value: 0.77,}); 
		// 	$('#circle2').circleProgress({value: 0.82,}); 
		// 	$('#circle3').circleProgress({value: 0.45,}); 
		// 	$('#circle4').circleProgress({value: 0.24,}); 
		// 	$('#circle5').circleProgress({value: 0.67,});
		// 	return counter_s6++; 
		// };
		// return current_scroll++
	


		
			
		//s_6 запуск прогресс бар при попадании на секцию
		// сделать один раз
		


	
	// var s6_posY = $('.section_6').offset().top;
	// console.log(s6_posY);
	// var window_Scroll = $(window).scrollTop();
	// console.log(window_Scroll)


	// var win_w = $(window).width();
	// var scroll = $('header').scrollTop();
	// console.log(scroll);




	//паралакс для хедеров в секциях
	// $(window).scroll(function() {
	// 	var scrollTop=$(this).scrollTop();
	// 	$('.section_1>h1').css({
	// 		"transform":"translate(0%, " + scrollTop/5+"%"
	// 	})
	// })



	// $(".visible-content").click(
	// 	function() {
	// 		var www = $(this).parent().find('.hide-content').toggle();

	// 	}
	// )

	// $(".hide-content").click(
	// 	function() {
	// 		$(this).toggle();

	// 	}
	// )
	
	// .click(function(){

	//	запихнуть все функции которые должны делатся при ресайзе в одну!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	// };)

		// .fadeToggle();
				// var www = $(this).find('.hide-content')

// выравниваем блоки при загрузке страницы (продумать ресайз при перевернутом планшете)
 	// Equal Height
	// var maxHeight = 0;
 // 	$(".sect1 h1").each(function(){
	// 	if ( $(this).height() > maxHeight ) {
	// 		maxHeight = $(this).height();
	// 	}
	// });
	// $(".sect1 h1").height(maxHeight)
	


	//Equal Height
	//функция отключения/включения скриптов на маленьких разрешениях

	// var winWidth = $(window).width();// при загрузке страницы
	// if (winWidth>=768) {
// 	var maxHeight = 0;
//  	$(".sect2 .s-col").each(
//  		function(){
// 			if ( $(this).height() > maxHeight ) {
// 				maxHeight = $(this).height();
// 			}
// 		}
// 	);
// 	$(".sect2 .s-col").height(maxHeight)
// 	// }

// 	$(window).resize(function() {// ЗДЕСЬ ВСЕ ЗАПУСКАЕТСЯ ПРИ РЕСАЙЗЕ. НА ВСЕ БЛОКИ САЙТА
		
// 		var winWidth = $(window).width();
// 		console.log(winWidth)
// 		if (winWidth>=992) {
// 			var maxHeight = 0;
// 		 	$(".sect2 .s-col").each(function(){
// 				if ( $(this).height() > maxHeight ) {
// 					maxHeight = $(this).height();
// 				}
// 			});
// 			$(".sect2 .s-col").height(maxHeight);
// 		} 


// 		var maxHeight = 0;
// 		$(".sect2 .s-col").each(
// 			function(){
// 				if ( $(this).height() > maxHeight ) {
// 					maxHeight = $(this).height();
// 				}
// 			}
// 		);
// 		$(".sect2 .s-col").height(maxHeight)


// 	})

// 	// КОНЕЦ БЛОКА С ФУНКЦИЯМИ ПО РЕСАЙЗУ
	


// 	//Equal Height
// 	var maxHeight = 0;
//  	$(".sect3 .s-col").each(function(){
// 		if ( $(this).height() > maxHeight ) {
// 			maxHeight = $(this).height();
// 		}
// 	});
// 	$(".sect3 .s-col").height(maxHeight)

// 	//Equal Height
// 	var maxHeight = 0;
// 	$(".sect1 p").each(function(){
// 		if ( $(this).height() > maxHeight ) {
// 			maxHeight = $(this).height();
// 		}
// 	});
// 	$(".sect1 p").height(maxHeight)
//  	//


//header navigation_button hide/show navigation
	
	// var clickNumber =0; 	
	// $('#h_toggle_nav').click(function () {
	// 	var winwidth = $(window).width();
	// 	var winHeight = $(window).height();
	// 	$('.h_responsive_nav').width(winwidth);
	// 	$('.h_responsive_nav').height(winHeight);
	// 	$('.h_responsive_nav').toggle();
	// 	var opas = $('#h_toggle_nav').css("opacity");
	// 	if (opas==1) {
	// 		$('#h_toggle_nav').css("opacity","0.3")
	// 	} 
	// 	else {
	// 		$('#h_toggle_nav').css("opacity","1")
	// 	}
	// })



	
	

	

	// $('#h_toggle_nav').mouseover(function() {
	// 	var widthToggleMenu = $('#h_toggle_nav').css("right");
	// 	console.log(widthToggleMenu)
	// 	if (widthToggleMenu = "-80px") {
	// 		$('#h_toggle_nav').css("right", "10px");
	// 	};
	// 	// $('#h_toggle_nav').css("right", "0px");
	// });



	
	
	
	
	// $('#h_toggle_nav').mouseover(function() {
	// 	$('#h_toggle_nav').css("right", "0px");
	// });
	// $('#h_toggle_nav').mousemove(function() {
	// 		$('#h_toggle_nav').css("right", "-80px");
	// });
	

	

	







