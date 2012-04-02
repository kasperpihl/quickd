define([
'text!templates/feedback.html'
],function(template){
	App.views.Feedback = Backbone.View.extend({
		el: '#workspace',
		initialize: function(){
			_.bindAll(this,'render','feedbackClick','closeFeedback', 'show');
			this.router = this.options.router;
			var thisClass = this;
			this.object = '#feedback';
			this.openHeight = 290;
			this.closedHeight = 100;
			this.open;
			this.feedback;
			this.model = App.models.feedback;
			if(App.collections.shops.length > 0 ) this.render(1);
			else {
				this.render();
				App.collections.shops.bind('add',this.show);
			}
		},
		events:{
			'click #feedback': 'feedbackClick',
			'click #btn_send_feedback': 'sendFeedback',
			'click #read_more': 'openDialog',
			'mouseenter #feedback': 'feedbackMouseOver',
			'mouseleave #feedback': 'feedbackMouseOut'
		},
		render: function(show){
			
			$(template).hide().appendTo(this.el);
			if(show) this.show();	
			
			
		},
		show: function() {
			if(!this.shown){ 
				var thisClass = this;
				$(function(){
					thisClass.shown = true;
					$(thisClass.object).verticalAlign().fadeIn(400);
				});
				
			}
			else return false;
		},
		closeFeedback: function(action) {
			if (this.open) {
				this.open = false;
				$('html').unbind('click');
				this.animateFeedback(action);
			}
		},
		feedbackClick: function(obj){
			obj.stopPropagation();
			if(!this.open){
				var thisClass=this;
				this.open = true;
				$('html').click(function(obj) { thisClass.closeFeedback('close');});
				this.animateFeedback('open');
			}
		},
		feedbackMouseOver: function(obj) {
			var thisClass = this;
			if(!this.open) {
				$(this.object).animate({'width': 70}, { queue: false, duration: 500, easing: 'easeOutExpo' });
			}
		},
		feedbackMouseOut: function(obj) {
			var thisClass = this;
			if(!this.open) {
				$(this.object).animate({'width': 50}, { queue: false, duration: 500, easing: 'easeOutElastic' });
			}
		},
		animateFeedback: function(action){
			var thisClass = this
			if (action == 'open') {
				this.positionTop = $(this.object).position().top;
				
			$(this.object).stop(true).animate({width:'400px'},200, 'easeInQuad')
					.animate({top:(thisClass.positionTop-thisClass.openHeight/2+thisClass.closedHeight/2)+'px',height:thisClass.openHeight+'px'},200, 'easeInQuad').children();
				$(this.object+'_text').fadeOut(25);
				$(this.object+ ' div:last-child').delay(400).fadeIn(function() {
					$('#feedback_text_area').focus();
				});
			} 
			else if (action == 'close') {
				$(this.object+ ' div:last-child').fadeOut(200);
				$(this.object).delay(200).animate({top:thisClass.positionTop+'px',height:'100px'},200, 'easeOutQuad').animate({width:'50px'},200, 'easeOutQuad');
				$(this.object+'_text').delay(400).fadeIn(25);
				
			}
			else if(action == 'thanksmessage'){
				$(this.object+ ' div:last-child').fadeOut(400);
				$(this.object).delay(400).animate({top:thisClass.positionTop+'px',height:'100px'},400).delay(4000).animate({width:'50px'},400);
				$(this.object+'-thanks').delay(900).fadeIn(400).delay(3100).fadeOut(400);
				$(this.object+'_text').delay(5200).fadeIn(50,function(){thisClass.open = false;});
			}
		},
		openDialog:function() {
			var thisClass = this;
			require([
				'views/dialogs/feedback'
			],function(){
				thisClass.readmore = new App.views.dialogs.Feedback({router:thisClass.router});
				thisClass.readmore.openDialog();
			});
		},
		sendFeedback:function(){
			if (!this.shown) return;
			var feedback = $('#feedback_text_area').val();
			if(feedback == this.feedback) alert('allerede sendt'); 
			else {
				$('html').unbind('click');
				this.animateFeedback('thanksmessage');
				//this.closeFeedback('thanksmessage');
				var model = new App.models.Feedback();
				model.save({message:feedback},{
				success:function(m,data){log('success feedback sent',m, data); App.collections.feedback.add(m);},
				error:function(m,data){
					log(m, data);
					thisClass.router.showError("Der opstod en fejl", "Din feedback-besked blev ikke sendt korrekt<br />Fejlmeddelelse: "+data.error); 
				}});
			}
		}
		
	});
});