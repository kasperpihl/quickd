define([
'text!templates/welcome.html',
'views/activities/activity'
],function(template){
	App.views.activities.Welcome = App.views.Activity.extend({
		activityName: 'welcome',
		animationType: 'fade',
		activeText: false,
		priority: 0,
		initialize: function(){
			_.bindAll(this,'shopCreator','event');
			this.bubbleShown=false;
			this.init();
			this.render();
			this.router.bind('shopCreated',this.event);
			this.router.bind('templateCreated',this.event);
			this.router.bind('dealStarted',this.event);
		},
		render:function(){
			var data = {};
			if (App.collections.shops.length==0) {
				data.name = "";
				data.text = "text_add_shop";
				this.shopCreator();
			} else {
				data.name = App.collections.shops.models[0].attributes.name;
				data.text="";
			}
			$('#activity_welcome').html(_.template(template, {data: data}));
		},
		show: function() {
			$('#activity_welcome').fadeIn();
		},
		event: function(data){
			//console.log("eventing");
			//console.log(data);
			if(data.event){
				switch(data.event){
					case 'shop':
						this.changeText('template');
						//this.show();
					break;
					case 'template':
						this.changeText('choose_activity');
					break;
					case 'deal':
						this.changeText('deal_created', 0, 5000);
					break;
				}
			}
			else{
				//console.dir(data);
			}
		},
		events:{
			'click #btn_add_shop': 'openAddShop'
		},
		shopCreator: function(data,obj){
			var thisClass = this;
			require(['views/dialogs/addshop'],function(addshop){
				//thisClass.changeText('add_shop',1);
				thisClass.addShopBubble = new App.views.dialogs.AddShop({router:thisClass.router});
				$('#activities').addClass('newbie');
			});
			
			//this.show();
		},
		changeText: function(newText,priority, duration){
			if(priority && priority > this.priority ){
				log("change "+newText);
				if(this.activeText) $('#text_'+this.activeText).removeClass('active').fadeOut();
				$('#text_'+newText).addClass('active').fadeIn(600);
				this.activeText = newText;
				this.priority = priority;
			}
			else if (duration) {
				$('#text_'+newText).addClass('active').fadeIn(400).delay(duration).fadeOut();
			}
			else if (!priority){
				if(this.activeText) $('#text_'+this.activeText).removeClass('active').fadeOut(400,function(){
					this.activeText = newText;
					$('#text_'+newText).addClass('active').fadeIn(400);
				});
				
			}
			
		},
		openAddShop:function(obj) {
			var me = $('#'+obj.currentTarget.id);
			var y = me.position().top-30;
			var x = me.position().left + me.outerWidth()/2;
			log(x,y);
			this.addShopBubble.openBubble(x , y);
		}
		
	});
});