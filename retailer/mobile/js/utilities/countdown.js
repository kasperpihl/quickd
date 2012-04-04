App.utilities.Countdown = Backbone.Router.extend({
	time: 1000,
	count: false,
	el: '#time time',
	show:false,
	model:false,
	initialize:function(){
		_.bindAll(this,'countdown','addLeadingZero','output');

	},
	setModelAndStart:function(model){
		this.model = model;
		this.show = true;
		this.output();
		if(!this.count) this.countdown();
		this.count = true;
	},
	stop: function(){
		this.show = false;
	},
	countdown:function(){
		if(this.show) this.output();
		setTimeout(this.countdown,1000);
	},
	addLeadingZero:function(n){
		if(n.toString().length < 2) return '0' + n;
		else return n;
	},
	output: function(){
		var time_left = this.model.getCountdown();
		if(time_left < 0) return;
		var hours, minutes, seconds;
		seconds = time_left % 60;
		minutes = Math.floor(time_left / 60) % 60;
		hours = Math.floor(time_left / 3600);

		seconds = this.addLeadingZero( seconds );
		minutes = this.addLeadingZero( minutes );
		hours = this.addLeadingZero( hours );

		$(this.el).html(hours + ':' + minutes + ':' + seconds);
	}


});