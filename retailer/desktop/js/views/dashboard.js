define([
'text!templates/dashboard.html',
'order!raphael/raphael-min',
'order!jquery/jquery.analogueclock',
'views/feedback',
'views/notifications',
'views/activities/activity',
'views/activities/administration',
'views/activities/welcome',
'views/activities/overview',
'views/activities/templates',
'views/activities/startdeals',
'views/activities/welcome'
],function(template){
	App.views.Dashboard = Backbone.View.extend({
		el: '#dashboard',
		animationTime: 600,
		loadingActivity: false,
		initialize: function(){
			this.router = this.options.router;
			this.router.activity = false;
			this.activityRoutes = {};
			this.model = App.models.shopowner;
			this.model.on('change:hours',this.renderHours,this);
			_.bindAll(this,'render','clickedActivity','dashboardLoaded','openRefill','lock','unlock','changeActivity');
			this.render();
			this.locked = false;
			this.windowsLocked = false;
		},
		
		dashboardLoaded: function(){
			var thisClass = this;
			App.views.notifications = new App.views.Notifications({router:this.router});
			new App.views.activities.Welcome({router:this.router});
			new App.views.activities.Overview({router:this.router});
			new App.views.activities.Templates({router:this.router});
			new App.views.activities.StartDeals({router:this.router});
			new App.views.activities.Administration({router:this.router});
			$('#dashboard').show();
			$('#menu').verticalAlign();
			
			$('#analogueclock').analogueClock({
				radius: 8, 
				strokeW: 2, 
				color: "rgb(69,69,69)"
			});
			
			if(App.collections.shops.length > 0 ) this.animateMenu();
			else {
				App.collections.shops.bind('add',this.animateMenu);
			}
			new App.views.Feedback({router:this.router});
			this.router.bind('lock',this.lock);
			this.router.bind('unlock',this.unlock);
		},
		animateMenu: function() {
			$('#menu').animate({'margin-left': '40px'}, 1000, 'easeInOutQuart');
			if ($('#activities').hasClass('newbie'))
				$('#activities').animate({left:'200px'}, 500, 'easeInOutQuart', function() { $(this).removeClass('newbie',300) });
	
		},
		lock:function(data){
			if(data.lock == 'activity') this.locked = true;
		},
		unlock: function(data){
			if(data.lock == 'activity'){
				this.locked = false;
			}
		},
		renderHours:function(model,model2,test){
			log(model,model2,test);
			$hoursEl = $('#hours_show');
			$hoursEl.html(model.get('hours') + ' timer');
			$hoursEl.addClass('green');
			setTimeout(function(){
				$hoursEl.removeClass('green');
			},3000);
			
		},
		render: function(){
			// This is rendering the structure of the dashboard
			var thisClass = this;
			$(thisClass.el).html(_.template(template,{data:thisClass.model.attributes}));
			thisClass.dashboardLoaded();
		},
		events:{
			'click #menu li,#logo_top': 'clickedActivity',
			'click #btn_refill': 'openRefill',
			'click #btn_read_conditions': 'openConditions'
		},
		clickedActivity:function(obj){
			/* Get activity (btn_templates) = templates */
			var id = obj.currentTarget.id;
			if($('#'+id).hasClass('disabled')) return false;
			if (id == 'logo_top') activity='welcome';
			else {
				//$('#'+id).addClass('selected');
				var activity = id.substr(4);
			}
			this.changeActivity({activity:activity,clicked:true});
		},
		changeActivity:function(options){
			if(options.hasOwnProperty('clicked') && (options.activity == this.router.activity || this.locked)) return false;
			if(!this.router.activity) options.first = true;
			if(this.router.activity == options.activity) options.dontChange = true;			
			this.router.activity = options.activity;
			this.router.trigger('clickedActivity',options);
			
		},
		openRefill:function() {
			var thisClass = this;
			require(['views/dialogs/refill'],function(){
				thisClass.refillView = new App.views.dialogs.Refill({router:thisClass.router});
				thisClass.refillView.openDialog();
			});
			
		},
		openConditions:function() {
			var thisClass = this;
			require(['views/dialogs/conditions'],function(){
				thisClass.conditionsView = new App.views.dialogs.Conditions({router:thisClass.router});
				thisClass.conditionsView.openDialog();
			});
			
		}
	});
});