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
			_.bindAll(this,'shopCreator');
			this.bubbleShown=false;
			this.init();
			this.render();
		},
		render:function(){
			var data = {};
			App.collections.shops.off('add',this.render);
			if (App.collections.shops.length==0) {
				data.name = "";
				data.text = "text_add_shop";
				this.shopCreator();
				App.collections.shops.on('add',this.render);
			} else {
				data.name = App.collections.shops.at(0).get('name');
				data.text="";
			}
			$('#activity_welcome').html(_.template(template, {data: data}));
		},
		show: function() {
			$('#activity_welcome').fadeIn();
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
		},
		openAddShop:function(obj) {
			var me = $('#'+obj.currentTarget.id);
			var y = me.position().top-30;
			var x = me.position().left + me.outerWidth(true)/2;
			//log(x,y, me.position().left, me.outerWidth());
			this.addShopBubble.openBubble(x , y);
			return false;
		}
		
	});
});