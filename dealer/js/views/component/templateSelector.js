define([
'text!templates/component/templateSelector.html'
],function(template){
	App.views.components.TemplateSelectorView = Backbone.View.extend({
		el: '#content',
		initialize:function(){
			//_.bindAll(this,'handle', 'setHandlers','setContent');
			log("templateSelector");
			this.componentId = '#cmp-'+this.cid;
			this.router = this.options.router;
			this.created = false;
			this.expanded = this.options.expandOnCreate ? this.options.expandOnCreate : false;
			this.height = this.options.height ? this.options.height:400;
			this.width = this.options.width ? this.options.width:320;
			this.appendTo = this.options.appendTo ? this.options.appendTo : this.el;
			this.parent = this.options.parent ? this.options.parent : this.el;
			if (this.options.onExpand) this.onExpand = this.options.onExpand;
			if (this.options.onCollapse) this.onCollapse = this.options.onCollapse;
			this.collection = App.collections.templates;
			this.templates = this.collection.getApproved();
			App.collections.templates.bind('change',this.updateContent);
			App.collections.templates.bind('add',this.updateContent);
			App.collections.templates.bind('reset',this.updateContent);
			this.render();
		},
		render:function() {
			var thisClass = this;
			var tpl = _.template(template, {data: this});
			$(tpl).appendTo(this.appendTo);
			this.created = true;
		},
		events: {
			'click #templateSelector-expanded .list-item': 'handleClick',
			'click #templateSelector-collapsed .list-item': 'expandList',
			'click #btn_expand_template_list': 'expandList'
		},
		handleClick:function(data) {
			var id = data.currentTarget.id;
			this.setSelected(id);
		},
		updateContent:function(data) {
			this.templates = this.collection.getApproved();
			this.render();
		},
		expandList:function() {
			$('#templateSelector-collapsed').hide();
			$('#templateSelector-expanded').show();
			this.expanded = true;
			if (this.onExpand) this.onExpand();
		},
		collapseList:function() {
			$('#templateSelector-expanded').hide();
			$('#templateSelector-collapsed').show();
			this.expanded = false;
			if (this.onCollapse) this.onCollapse();
		},
		setSelected:function(id) {
			this.selected = this.collection.get(id).toJSON();
			var el = $('#'+id).outerHTML();
			$('#templateSelector-expanded .list-item.selected').removeClass('selected');
			$('#'+id).addClass('selected');
			$('#templateSelector-collapsed').html(el);
			this.collapseList();
			this.router.trigger('templateSelected', {templateId: id, parent:this.parent});
		},
		resetSelected:function() {
			if (this.selected) {
				this.selected = null;
				$('#templateSelector-expanded .list-item.selected').removeClass('selected');
				this.expandList();
			}
		}
	});
});