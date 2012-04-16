define([
	'views/windows/window',
	'views/dialogs/promtDialog'
],function(){
	App.views.Activity = Backbone.View.extend({
		el: '#activities',
		animationTime: 350,
		animationType: 'slide',
		loaded: false,
		ready: false,
		locked:false,
		queue: false,
		init:function(){
			this.router = this.options.router;
			if(!this.activityName) console.log('Jeg mangler et aktivitetsnavn' + this.cid);
			this.id = 'activity_'+this.activityName;
			_.bindAll(this,'render','activityChange','done','load','unload','clickedActivity','activityChange','activityUnloaded', 'confirmCallback', 'doQueue','closeAllWindows');
			$(this.el).append('<div id="'+this.id+'" class="activity"></div>');
			this.parentRoute = lang.urls[this.activityName];
			this.router.bind('activityChange',this.activityChange);
			this.router.bind('clickedActivity',this.clickedActivity);
			this.router.bind('activityUnloaded',this.activityUnloaded);
			this.router.bind('promtCallback:'+this.cid, this.confirmCallback);
			this.windows = {};
		},
		clickedActivity:function(data){
			if(data.activity == this.activityName){
				if(data.hasOwnProperty('route')){
					this.oldRoute = this.route;
					this.route = data.route;
					if(!data.hasOwnProperty('isRouted')){
						this.router.navigate(this.route,{trigger:false});
					}
				}
				if(data.hasOwnProperty('clicked')){
					if(!this.hasOwnProperty('route')) this.route = lang.urls[this.activityName];
					if(!data.hasOwnProperty('isRouted')){
						this.router.navigate(this.route,{trigger:false});
					}
				} 
				if(data.hasOwnProperty('isParentRoute')){
					this.closeAllWindows();
				}
				if(data.hasOwnProperty('window')) this.router.trigger('appendWindow',data);
				if(!data.hasOwnProperty('dontChange')){ 
					this.ready = true;
					this.router.trigger('activityChange',{activity:this.activityName,animation:this.animationType,first:data.first});
				}
			}
		},
		activityChange:function(data){
			/* Checks if*/
			if(data.activity != this.activityName){
				if(!this.loaded)return;
				else this.unload(data.animation);
			}
			else if(data.activity == this.activityName && data.first){
				if(this.ready) this.load();
				this.ready = false;
			}
		},
		activityUnloaded:function(data){
			if(this.ready) this.load();
			this.ready = false;
		},
		load:function(){
			var thisClass = this;
			$('#btn_'+this.activityName).addClass('selected');
			var $activity = $('#activity_'+this.activityName);
			$activity.css('z-index',2);
			this.onBeforeLoad();
			switch(this.animationType){
				case 'slide':
					$activity.css({left: -$activity.outerWidth()}).show(0, function() {thisClass.onShow()}).delay(this.animationTime).animate({ left: 0 }, {duration: this.animationTime, easing: 'easeOutExpo', complete: function() {
						
						thisClass.done('load');
						$(this).addClass('ready');
					},queue:false});
				break;
				case 'slideDown':
					$activity.css({top: -$activity.outerHeight()}).show(0, function() {thisClass.onShow()}).delay(this.animationTime).animate({ top: 0 }, {duration:this.animationTime * 2, easing:'easeOutExpo', complete:function() {
						thisClass.done('load');
						$(this).addClass('ready');
					},queue:false});
				break;
				case 'fade':
					$activity.fadeIn(this.animationTime, function() { 
						thisClass.onShow();
						thisClass.done('load');
						$(this).addClass('ready');
					});
				break;
			}
		},
		done:function(action){
			switch(action){
				case 'unload':
					this.router.trigger('activityUnloaded');
					this.loaded = false;
					this.onHide();
					$('#activity_'+this.activityName).css('z-index',''); 
				break;
				case 'load':
					this.loaded = true;
					this.onLoad();
					$('#activity_'+this.activityName).css('z-index','');
					$('#activities').css({overflow:'visible'});
					this.router.trigger('unlock',{lock:'activity'});
				break;
			}
		},
		unload:function(animationType){
			this.router.trigger('lock',{lock:'activity'});
			$('#btn_'+this.activityName).removeClass('selected');
			var thisClass = this;
			$('#activities').css({overflow:'hidden'});
			var $activity = $('#activity_'+this.activityName);
			$activity.css('z-index',1);
			switch(animationType){
				case 'slide':
					$('#activity_'+this.activityName).removeClass('ready').animate(
						{ left: -$activity.outerWidth() }, 
						{duration: this.animationTime, easing: 'easeInExpo', complete:function() {
							$(this).hide().css({left: 0});
							thisClass.done('unload');
						},queue:false}
					);
				break;
				case 'slideDown':
					$activity.removeClass('ready').fadeOut(this.animationTime/2, function() {
						$(this).removeClass('ready');
						thisClass.done('unload');
					});
				break;
				case 'fade':
					$activity.removeClass('ready').fadeOut(this.animationTime, function() {
						$(this).removeClass('ready');
						thisClass.done('unload');
					});
				break;
			}
			
		},
		onLoad:function() {},
		onBeforeLoad:function() {},
		onShow:function() {},
		onHide: function() {},
		confirmCallback:function(obj) {
			if (obj.callbackCid==this.cid && obj.type=='confirmClose' && obj.windowName && this.windows[obj.windowName]) {
				var thisClass = this;
				switch(obj.eventType) {
					case 'confirm':
						var window = this.windows[obj.windowName];
						window.saveToModel({success:function() {
							window.closeWindow(function() {
								if (window.parent && thisClass.windows[window.parent]) thisClass.windows[window.parent].removeSelected(); 
								delete thisClass.windows[obj.windowName];
								thisClass.doQueue();
							});
						}}, true);
					break;
					case 'dont_save':
						var window = this.windows[obj.windowName];
						window.closeWindow(function() {
							if (window.parent && thisClass.windows[window.parent]) thisClass.windows[window.parent].removeSelected(); 
							delete thisClass.windows[obj.windowName];
							thisClass.doQueue();
						});
					break;
					case 'cancel':
						this.queue = false;
						this.router.trigger('setFocus', {activity:obj.activity, windowCid:this.windows[obj.windowName].cid});
					break;
				}
			}
		},
		appendWindow: function(windowName, options) {
			var id = windowName;
			if (options.id) id = id+"-"+options.id;
			if (this.windows[id]) return false;
			
			if (options.parent && options.clickId && options.parent) {
				if (this.windows[options.parent]) {
					this.windows[options.parent].setLinkLoading(options.clickId);
					this.windows[options.parent].setSelected(options.clickId);
				} else var setSelectedLater = true;
			}
			var req = 'views/windows/'+windowName.toLowerCase();
			var thisClass = this;
			require([req],function(){
				if (!thisClass.windows[id]) {
					options.activity = thisClass;
					options.windowName = id;
					var newWindow = new App.views.windows[windowName](options);
					var queue = false;
					$.each(thisClass.windows, function(i, w) {
						if (!newWindow.depth || newWindow.depth>1 && w.depth && w.depth >= newWindow.depth) {
							thisClass.queue = newWindow;
							thisClass.closeWindow(i, true, null, true);
							queue = true;
						}
					});
					if (!queue){
						newWindow.openWindow();
						if (setSelectedLater && thisClass.windows[newWindow.parent]) {
							thisClass.windows[newWindow.parent].setSelected(options.clickId);
						}
						thisClass.windows[id] = newWindow;
					}
				}
			});
			return true;
		},
		closeAllWindows:function(){
			for (var index in this.windows){
				if(this.windows[index].depth > 1){
					this.closeWindow(this.windows[index],false,true);
				}
			}
		},
		closeWindow: function(window, isIdString,routing, keepSelected) {
			var thisClass = this;
			var id;
			var doClose = true;
			if(isIdString && this.windows[window]) {
				id = window;
				window = this.windows[id];
			} else {
				
				$.each(this.windows, function(i, w) {
					if (w==window) id = i;
				});
			}
			if (window.confirmClose && window.hasChanged()) {
				var confirmer = new App.views.dialogs.PromtDialog({router:this.router, type: 'confirmClose', callbackCid:this.cid, windowName:id});	
			} else {
				window.closeWindow(function() {
					if (id && thisClass.windows[id]) delete thisClass.windows[id];
					if (!keepSelected && window.parent && thisClass.windows[window.parent]) thisClass.windows[window.parent].removeSelected(); 
					if(routing){
						thisClass.router.navigate(thisClass.parentRoute);
						thisClass.route = thisClass.parentRoute;
					} 
					thisClass.doQueue();
				});
				
			}
			
		},
		doQueue:function() {
			if (this.queue) {
				var thisClass = this;
				var newWindow = this.queue;
				newWindow.openWindow();
				/*if (newWindow.parent && this.windows[newWindow.parent] && newWindow.options.clickId) {
					this.windows[newWindow.parent].setSelected(newWindow.options.clickId); 
				}*/
				this.windows[newWindow.options.windowName] = newWindow;
				this.queue = false;
			}
		}
	});
});