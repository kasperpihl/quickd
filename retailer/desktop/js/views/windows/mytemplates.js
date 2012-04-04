define([
'views/windows/window'
],function(){
	App.views.windows.MyTemplates = App.views.Window.extend({
		el: '#activity_templates',
		initialize: function(){
			this.template = 'mytemplates';
			this.width = 350;
			this.init(this.options);
			_.bindAll(this,'updateContent');
			this.collection = App.collections.templates;
			//log("templates", this.collection.toJSON());
			this.createWindow(true, this.collection.toJSON());
			App.collections.templates.bind('add',this.updateContent);
			App.collections.templates.bind('change',this.updateContent);
			App.collections.templates.bind('remove',this.updateContent);
		},
		updateContent:function(data,obj) {
			this.setContent(this.collection.toJSON());
		},
		events:{
			'click .template_item': 'viewTemplate',
			'click #btn_add_template': 'addTemplate'
		},
		viewTemplate: function(data){
			var id = data.currentTarget.id;
			var openId = id.substr(9);
			this.router.navigate(lang.urls.templates+'/'+openId,{trigger:true});
		},
		addTemplate:function(){
			this.router.navigate(lang.urls.templatesAdd,{trigger:true});
			//this.activity.appendWindow('AddTemplate', {router:this.router,parent:'MyTemplates'});
		},
		cleanUp:function(){
			App.collections.templates.unbind();
		}
		
	});
});