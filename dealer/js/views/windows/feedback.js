define([
'views/windows/window',
'order!jquery/jquery.scrollTo.min'
],function(){
	App.views.windows.Feedback = App.views.Window.extend({
		el: '#activity_overview',
		width: 420,
		depth: 2,
		initialize: function(){
			_.bindAll(this,'feedbackChanged', 'sendFeedback', 'showTextfield', 'onCreated');
			this.template = 'feedback';
			this.init(this.options);
			this.collection = App.collections.feedback;
			this.textFocused = false;
			//log("feedback",this.collection.toJSON());
			this.createWindow(true,this.collection.toJSON());
			App.collections.feedback.bind('change',this.feedbackChanged);
			App.collections.feedback.bind('add',this.feedbackChanged);
			//App.models.feedback.bind('reset',this.feedbackChanged);
		},
		events: function() {
			var _events = {};
			var windowId = "#window-"+this.cid;
			_events['click '+windowId+' #feedback-send-btn']= 'sendFeedback';
			_events['click '+windowId+' #feedback-textfield']= 'showTextfield';
			return _events;
		},
		onCreated: function() {
			var thisClass = this;
			$('#feedback-messages').scrollTo('max', 500, {easing: 'easeOutExpo'});
			
			
		},
		showTextfield: function(obj) {
			var thisClass = this;
			obj.stopPropagation();
			if (!this.textFocused) {
				$('#feedback-text').addClass('focused');
				$('#feedback-messages').addClass('focused');
				setTimeout(function() {	$('#feedback-messages').scrollTo('max', 190); }, 90);
				this.textFocused = true;
				$('html').click(function(obj) { 
					if (thisClass.textFocused) {
						$('#feedback-text').removeClass('focused');
						$('#feedback-messages').removeClass('focused');
						thisClass.textFocused = false;
					}
					$('html').unbind('click');
				});
			}
		},
		feedbackChanged: function(event,d){

			if(debug) log('feedback har ændret',event, d.attributes);
			this.setContent(this.collection.toJSON(), function() {	$('#feedback-messages').scrollTo('max'); });
		},
		sendFeedback:function(obj){
			obj.stopPropagation();
			var thisClass = this;
			var feedback = $('#feedback-textfield').val();
			if (!feedback ||feedback=="") return;
			if(feedback == this.feedback) alert('allerede sendt'); 
			else {
				this.feedback = feedback;
				$('#feedback-text').removeClass('focused');
				$('#feedback-messages').removeClass('focused'); 
				$('#feedback-messages').append('<div class="messageObj"><div class="message sent left">Sender meddelelse...</div></div>').scrollTo('max', 200);
				var model = new App.models.Feedback();
				model.save({message:feedback},{
				success:function(data,obj){
					App.collections.feedback.add(data);
					log("retur fra server",data, obj); 
				},
				error:function(data,obj){log("fejl fra server", obj); }, silent:true});
			}
		}
	});
});