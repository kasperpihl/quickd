
App.views.ControlPanel = Backbone.View.extend({
	el: '#appContent',
	time: 18000,
	initialize:function(){
		this.router = this.options.router;
		this.timeEl = $('#time time');
		this.btnEl = $('.start-stop-deal');
		this.sliderEl = $('#hours-slider');
		_.bindAll(this,'clickedButton','handleChange','render','changed');
		this.render();
	},
	render:function(){
		this.sliderEl.attr('value', 20).slider('refresh');
	},
	events: {
		'click #startButton': 'clickedButton',
		'change #hours-slider': 'handleChange'
	},
	lockView: function(){
		$('#controlpanel').css('opacity', 0.3);
		App.utilities.countdown.stop();
	},
	unlockView:function(){
		$('#controlpanel').css('opacity', 1);
	},
	changed: function(object){
		switch(object.get('type')){
			case 'deal':
			$('.ui-btn-text',this.btnEl).html('Udsolgt');

			App.utilities.countdown.setModelAndStart(object);
			deal = true;
			break;
			case 'template':
			this.sliderEl.attr('value', 20).slider('refresh');
			$('.ui-btn-text',this.btnEl).html('Start deal');
			var deal = false;

			break;
			default:
			return;
		}
		$('#time').toggleClass('running',deal);
		this.btnEl.toggleClass('stop',deal);
	},
	handleChange:function(e,ui){
		var sliderVal	= e.currentTarget.value,
		hour		= Math.floor(sliderVal / 4),
		min			= (sliderVal % 4) * 15,
		hourText	= (hour > 1)? 'timer' : 'time',
		minText		= (min > 0)? ' og ' + min + ' minutter ' : '';
		
		if (min < 10) min = '0' + min;
		this.time = (hour*60*60) + (min*60);
		this.timeEl[0].innerHTML = hour + ':' + min + ' ' + hourText;
	},
	
	clickedButton:function(){
		this.router.clickedStartStop(this.time);
		//this.router.clickedStartStop(10);
	}
});