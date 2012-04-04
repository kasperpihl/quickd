define([
'views/activities/activity',
],function(){
	App.views.activities.Templates = App.views.Activity.extend({
		initialize: function(){
			this.activityName = 'templates';
			this.init();
			_.bindAll(this,'openAddTemplate','handleEvent','openViewTemplate');
			this.appendWindow('MyTemplates', {router:this.router});
			this.router.bind('appendWindow',this.handleEvent);
		},
		handleEvent:function(options){			
			switch(options.window){
				case 'viewTemplate':
					this.openViewTemplate(options.id);
				break;
				case 'addTemplate':
					this.openAddTemplate();
				break;
				default:
					return;
				break;
			}
		},
		openAddTemplate:function(){
			this.appendWindow('AddTemplate',{router:this.router,parent:'MyTemplates'});
		},
		openViewTemplate:function(id){
			var clickId = 'template-'+id;
			var model = App.collections.templates.get(id);
			if(!model){
				this.router.navigate(lang.urls.templates);
				return;
			} 
			this.appendWindow('ViewTemplate', {router:this.router,id:id,model:model,parent:'MyTemplates',clickId:clickId});
		}
	});
});