define([
'views/dialogs/dialog',
],function(){
	App.views.dialogs.TemplateSelectorView = App.views.Dialog.extend({
		el: '#content',
		initialize:function(){
			_.bindAll(this,'handleClick', 'updateContent');
			var thisClass = this;
			this.template ='templateSelector';
			//this.router = this.options.router;
			if (this.options.templates) this.templates = this.options.templates;
			else this.templates = {};
			this.width = 300;
			this.height = 400;
			this.closable = true;
			
			this.init(this.options);
			this.destroyOnClose = false;
			this.createDialog(this.templates);
			this.router.bind('templatesUpdated',this.updateContent);
			//this.render();
			
		},
		events: {
			'click #templateSelector_dialog .list-item': 'handleClick',
		},
		handleClick:function(data) {
			var id = data.currentTarget.id;
			var el = $('#'+id).outerHTML();
			this.resetSelected();
			$('#'+id).addClass('selected');
			
			this.router.navigate(lang.urls.startdeals + '/'+ id,{trigger:true});
			this.closeDialog();
		},
		updateContent:function(data) {
			this.setContent(data);
		},
		resetSelected:function() {
			$(this.dialogId+' .selected').removeClass('selected');
		}
	});
});