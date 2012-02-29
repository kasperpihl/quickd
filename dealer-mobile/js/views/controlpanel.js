
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
	changed: function(object){
		log(object.type);
		switch(object.type){
			case 'deal':
				$('.ui-btn-text',this.btnEl).html('Udsolgt');
				$('#time').toggleClass('running',true);
			break;
			case 'template':
				$('.ui-btn-text',this.btnEl).html('Start deal');
				$('#time').toggleClass('running',false);
			break;
		}
		/*
		var timestamp = parseInt(new Date().getTime()/1000);
		
		if(deal){
			
		}
		else{
			
		}*/
	},
	handleChange:function(e,ui){
		var sliderVal 	= e.currentTarget.value,
			hour		= Math.floor(sliderVal / 4),
			min			= (sliderVal % 4) * 15,
			hourText	= (hour > 1)? 'timer' : 'time',
			minText		= (min > 0)? ' og ' + min + ' minutter ' : '';
		
		if (min < 10) min = '0' + min;
		this.time = (hour*60*60) + (min*60);
		this.timeEl[0].innerHTML = hour + ':' + min + ' ' + hourText;
	},
	
	clickedButton:function(){
		log('test');
	}
});