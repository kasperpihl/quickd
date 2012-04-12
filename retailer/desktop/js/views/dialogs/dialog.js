define([
	'text!templates/component/dialog.html'
],function(template){
	App.views.Dialog = Backbone.View.extend({
		init:function(options){
			/*if(console){
				if(!options.router) //console.dir(this.cid + ' router mangler');
			}*/
			_.bindAll(this,'handle', 'createDialog', 'closeDialog','openDialog','setHandlers','setContent', 'onClose');
			this.dialogId = '#dialog-'+this.cid;
			this.router = options.router;
			if (this.options.classes) this.classes = this.options.classes;
			if (this.options.onClose) this.onClose = this.options.onClose;
			this.created = false;
			this.openOnCreate = false;
			this.destroyOnClose = true;
			this.aniTime = 400;
			this.level = 1;
			this.maskClass = 'black';
		},
		createDialog:function(data, callback){

			var thisClass =this;
			var tpl = _.template(template, {data: this});
			$(tpl).hide().appendTo(thisClass.el);
			this.setContent(data, callback);
			this.setHandlers();
			$(window).resize(function(){
				 $(thisClass.dialogId).centerBox();
			});
			$(this.dialogId).centerBox();
			this.created = true;
			if (this.openOnCreate) { this.openDialog() }

			
		},
		openDialog: function(){
			this.router.trigger('dialogAction',{action:'opened',cid:this.cid, level:this.level});
			this.router.bind('dialogAction',this.handle);
			var thisClass = this;

			$('body').createMask(function(obj) {
				obj.stopPropagation();
				if (thisClass.closable) thisClass.closeDialog(thisClass.destroyOnClose);
			}, this.maskClass, this.level);
			if (this.created) {
				$(this.dialogId).fadeIn(thisClass.aniTime, function() {
					$(this).show();
					if (thisClass.onOpen) thisClass.onOpen();
				});
				
				
				
			}
			else this.openOnCreate = true;
			
			/*if (this.closable) {
				$(document).keyup(function(e) {
				  log(e)
				  if (e.keyCode == 27) {  // esc
				  	thisClass.closeDialog(thisClass.destroyOnClose);
				  }  
				});
			}*/
			
			
			
			
		},
		setHandlers:function(){
			if (this.closable) {
				var thisClass = this;
				$('#close-'+this.cid).click(function(obj){
					obj.stopPropagation();
					thisClass.closeDialog(thisClass.destroyOnClose);
				});
			}
		},
		closeDialog: function(remove, silent){
			var thisClass = this;
			this.router.trigger('dialogAction',{action:'closed',cid:this.cid, level:this.level});
			//$('#body-mask').fadeOut(thisClass.aniTime, function() { $(this).remove(); });
			$('body').removeMask(this.aniTime, null, this.level);
			$(this.dialogId).fadeOut(thisClass.aniTime,function(){
				if (!silent) thisClass.onClose();
				if (remove) {
					thisClass.undelegateEvents();
					$(this).remove();
				}
			});
		},
		shakeDialog: function() {
			$(this.dialogId).shakeBox();
		},
		setContent:function(data, callback){
			var thisClass = this;
			var tpl = 'text!templates/dialogs/'+this.template+'.html';
			require([tpl],function(template){
				$('#dialog-'+thisClass.cid+ ' .content').html(_.template(template, {data : data}));
				if (callback) callback();
			});
			
		},
		handle:function(option){
			if (option.action=='opened' && option.cid != this.cid && option.level <= this.level
				 || option.action=='doClose' && option.cid==this.cid) this.closeDialog();
			else return;
		},
		onClose:function() {}
	});
});