define([
	'text!templates/component/window.html'
],function(template){
	App.views.Window = Backbone.View.extend({
		hasLocked: false,
		hasFocus: true,
		selectedLink: null,
		depth: 1,
		windowId: "",
		init:function(){
			_.bindAll(this,'handleLock','lock','handleUnlock', 'setFocus', 'closeWindow',
						'setHandlers','setContent','openWindow','setSelected','removeSelected', 'onCreated', 'hasChanged', 'saveToModel');
			this.windowId = '#window-'+this.cid;
			this.router = this.options.router;
			if (this.options.activity) {
				this.activity = this.options.activity;
				
			}
			if (this.options.parent) this.parent = this.options.parent;
			if (this.options.depth) this.depth = this.options.depth;
			this.html="";
			this.openOnCreate = false;
			this.router.bind('setFocus', this.setFocus);
			this.router.bind('lock',this.handleLock);
			this.router.bind('unlock',this.handleUnlock);
		},
		lock: function(action){
			var thisClass = this;
			switch(action){
				case 'lock':
					this.locked = true;
					this.hasFocus = false;
					$(this.windowId).createMask(function(){
							thisClass.router.trigger('setFocus', {windowCid: thisClass.cid});
					});
				break;
				case 'unlock':
					this.locked = false;
					$(this.windowId).removeMask();
				break;
			}
		},
		handleLock: function(data){
			if(data.lock == 'window' && !this.locked){
				if(data.me == this.cid) this.hasLocked = true;
				if(data.activityCid == this.activity.cid && this.depth == (data.depth-1)){
					this.lock('lock');		
				}
			}
		},
		handleUnlock: function(data){
			if(data.lock == 'window'){
				if(data.activityCid == this.activity.cid && this.depth == (data.depth-1)){
					this.lock('unlock');
				}
			}
		},
		setFocus: function(data) {
			if (data.windowCid == this.cid) {	
				if (this.locked) this.lock('unlock');
				if (this.lastFocus) this.lastFocus.focus();
				if (this.important) this.router.trigger('lock',{lock:'window',me: this.cid,activityCid: this.activity.cid,depth:this.depth});
				this.hasFocus = true;
			} else this.hasFocus = false;
		},
		createWindow: function(doSetContent, data, callback){
			this.html = _.template(template, {data: this});
			if (doSetContent) this.setContent(data, callback);
		},
		openWindow:function(){
			if (!this.created) { this.openOnCreate=true; return; }
			var thisClass = this,
					act = $("#"+this.activity.id),
					$html = $(this.html).hide();
			if (this.parent && this.activity.windows[thisClass.parent]) 
					this.activity.windows[this.parent].removeLinkLoading(); 
			if (!this.parent) $html.prependTo(act);
			else $html.appendTo(act);
			$html.fadeIn(400,function(){ 				
				thisClass.setHandlers();
				$(thisClass.windowId).click(function() {
					if (thisClass.important && !thisClass.hasFocus) { 
						thisClass.router.trigger('lock',{lock:'window',me: thisClass.cid,activityCid: thisClass.activity.cid,depth:thisClass.depth});
						thisClass.hasFocus = true;
					}
				});
				thisClass.onCreated();
			});

		},
		setHandlers:function(){
			var thisClass = this;
			$('#close-'+this.cid).click(function(e){
				e.stopPropagation();
				if (thisClass.activity) thisClass.activity.closeWindow(thisClass,false,true);
				else thisClass.closeWindow();
			});
		},
		/* Function to override, that must cleanup all bindings that eventually have been made by the window*/
		cleanUp:function(){
			
		},
		/* Function to override. Called when window is shown */
		onCreated:function(){
			
		},
		closeWindow: function(callback){
			this.cleanUp();
			if(this.hasLocked) this.router.trigger('unlock',{lock:'window',activityCid: this.activity.cid,depth:this.depth});
			var thisClass = this;
			$(this.windowId).fadeOut(400,function(){
				thisClass.undelegateEvents();
				$(this).remove();
				if (callback) callback();
			});
		},
		setContent:function(data,callback){
			var thisClass = this;
			var tpl = 'text!templates/windows/'+this.template+'.html';
			if (data) data.selectedLink = this.selectedLink;
			else data = {selectedLink: this.selectedLink}
			
			require([tpl],function(template){
				if (thisClass.created) {
					$(thisClass.windowId+' .content').html(_.template(template, {data : data}));
					thisClass.html = $(thisClass.windowId);
					//console.log(thisClass.html);
				} else {
					var me = $(thisClass.html)
					me.find('.content').html(_.template(template, {data : data}));
					thisClass.html = me;
					thisClass.created = true;
					if (thisClass.openOnCreate) thisClass.openWindow();
				}
				if (callback) callback();
				if (data && !data.selectedLink && thisClass.selectedLink) thisClass.setSelected(thisClass.selectedLink);
			});
		},
		setSelected:function(id) {
			this.removeSelected();
			$(this.windowId).find('#'+id).addClass('selected');
			this.selectedLink = id;
		},
		removeSelected:function() {
			if (this.selectedLink) {
				$(this.windowId).find('#'+this.selectedLink).removeClass('selected');
				this.selectedLink = null;
			}
		},
		setLinkLoading:function(id) {
			this.removeLinkLoading();
			$(this.windowId).find('#'+id).createMask(false, 'loading');
			this.loadingItem = id;
		},
		removeLinkLoading:function() {
			if (this.loadingItem) {
				$(this.windowId).find('#'+this.loadingItem).removeMask();
				this.loadingItem = null;
			}
		},
		hasChanged:function() {
			var r = false;
			$(this.windowId).find('.field').find('input, textarea').each(function(){
				var me = $(this);
				//console.log(me.attr('id')+': '+me.val()+', '+me.attr('oldValue'));
				if(me.val()!="" && (!me.attr("oldValue") || me.attr("oldValue")=="" || me.attr("oldValue") != me.val())) {
					r = true;
					return;
				}
			});
			return r;
		},
		saveToModel:function(callbacks, simple, manualValues) {
			if (this.form && this.form.valid()) {

				var thisClass = this;
				if (!callbacks) callbacks = {};
				var obj = {};
				
				$(this.windowId).find('.field').find('input, textarea').each(function(){
					if($(this).val() && (!$(this).attr("oldValue") || $(this).attr("oldValue") != $(this).val())){
						var index = $(this).attr('id');
						if (thisClass.inputPrefix && thisClass.inputPrefix.length!=0) index = index.substr(thisClass.inputPrefix.length);
						var val = $(this).val();
						if(index=='orig_price'||index=='deal_price') val = convertNumber(val);
						obj[index] = val;
						if ($(this).attr("oldValue")) $(this).attr('oldValue',$(this).val());
					}
				});
				_.each(manualValues, function(val, key) {
					obj[key] = val;
				});
				
				if(!$.isEmptyObject(obj)) {
					//var button = this.form.find('.edit-save-button').filter(':first');
					//button.wrap('<div class="loader-small" />');
					this.model.save(obj,{success:function(m,data){
						//console.log("success");console.dir(d); console.dir(data);
						log("success", m, data);
						//button.unwrap();
						$(thisClass.windowId).find('.field').find('input[type=password]').val('');
						if (data.success == 'true') {
							if(thisClass.lock) thisClass.router.trigger('unlock',{lock:'window',activityCid: thisClass.activity.cid,depth:thisClass.depth});
							if (callbacks.success) callbacks.success(m, data);
							if (callbacks.onChanged) callbacks.onChanged(m, data);
							if (!simple) $(thisClass.windowId).formSetState('readonly');
							
						} else {
							thisClass.router.showError("Der opstod en fejl", "Dine ændringer blev ikke gemt<br />Fejlmeddelelse: "+data.error);
							if(callbacks.error) callbacks.error(m, data);
						}
					}, error:function(m,data){
						//console.log("error");console.dir(d); console.dir(data);
						thisClass.router.showError("Der opstod en fejl", "Dine ændringer blev ikke gemt<br />Fejlmeddelelse: "+data.error);
						if (callbacks.error) callbacks.error(m, data);
					}, wait:true});
				} else {
					if(this.lock) this.router.trigger('unlock',{lock:'window',activityCid: this.activity.cid,depth:this.depth});
					if (callbacks.success) callbacks.success();
					if (!simple) $(this.windowId).formSetState('readonly');
				}
				
				this.state = 'view';
			} else if(this.form)  this.form.submit();
		}
	
	});
});