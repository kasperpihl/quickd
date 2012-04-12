define([
'text!templates/component/templateSelector.html'
],function(template){
	App.views.components.TemplateSelectorView = Backbone.View.extend({
		el: '#content',
		initialize:function(){
			_.bindAll(this,'handleClick', 'updateContent','expandList', 'collapseList', 'setSelected', 'resetSelected');
			this.componentId = '#cmp-'+this.cid;
			this.$collapsed;
			this.$expanded;
			this.router = this.options.router;
			this.created = false;
			this.expanded = this.options.expandOnCreate ? this.options.expandOnCreate : false;
			this.height = this.options.height ? this.options.height:320;
			this.width = this.options.width ? this.options.width:320;
			this.appendTo = this.options.appendTo ? this.options.appendTo : this.el;
			this.parent = this.options.parent ? this.options.parent : this.el;
			if (this.options.onCreated) this.onCreated = this.options.onCreated;
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
			$(this.appendTo).html(tpl);
			this.$el = $(this.componentId);
			this.$collapsed = $('#templateSelector-collapsed');
			this.$expanded = $('#templateSelector-expanded');
			if (this.expanded) {
				setTimeout( function() {
					thisClass.expandedHeight = thisClass.$expanded.getHiddenDimensions(true).outerHeight;
					thisClass.expandedHeight = thisClass.expandedHeight>thisClass.height?thisClass.height:thisClass.expandedHeight;
					thisClass.$expanded.height(thisClass.expandedHeight);
					if (thisClass.onCreated) thisClass.onCreated();
				},100);
			}
			this.created = true;
		},
		events: {
			'click #templateSelector-expanded .list-item': 'handleClick',
			'click #templateSelector-collapsed .list-item': 'expandList',
			'click #btn_expand_template_list': 'expandList'
		},
		handleClick:function(data) {
			log('handleClick');
			var id = data.currentTarget.id;
			this.setSelected(id);
		},
		updateContent:function(data) {
			this.templates = this.collection.getApproved();
			this.render();
		},
		expandList:function() {
			log('expandClick');
			var thisClass = this;
			this.$collapsed.hide();
			this.$expanded.slideDown('slow');
			if (thisClass.onExpand) thisClass.onExpand();
			thisClass.expanded = true;
			return false;
		},
		collapseList:function() {
			if (this.expanded) {
				var thisClass = this;
				if ($('#templateSelector-'+this.cid).is(':visible')) {
					this.$expanded.slideUp(function() {
						thisClass.$collapsed.fadeIn('fast');
						if (thisClass.onCollapse) thisClass.onCollapse();
					});
				} else {
					this.$expanded.hide();
					this.$collapsed.show();
					if (this.onCollapse) this.onCollapse();
				}
				this.expanded = false;
			}
		},
		setSelected:function(id) {
			this.selected = this.collection.get(id).toJSON();
			var el = $($('#'+id).outerHTML()).removeClass('selected');
			this.$expanded.children('.list-item.selected').removeClass('selected');
			$('#'+id).addClass('selected');
			this.$collapsed.html(el);
			this.collapseList();
			this.collapsedHeight = this.$collapsed.getHiddenDimensions(true).outerHeight;
			this.router.trigger('templateSelected', {templateId: id, parent:this.parent});
		},
		resetSelected:function() {
			if (this.selected) {
				this.selected = null;
				this.$expanded.children('.list-item.selected').removeClass('selected');
				this.expandList();
			}
		}
	});
});