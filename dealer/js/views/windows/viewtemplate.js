define([
'views/windows/window',
'views/dialogs/imageSelector'
],function(){
	App.views.windows.ViewTemplate = App.views.Window.extend({
		el: '#activity_templates',
		initialize: function(){
			this.init(this.options);
			_.bindAll(this,'editTemplate','delTemplate','startDeal', 'setValidator','events','cancelEdit', 'openSelectImage', 'imageSelected','updateContent');
			this.template = 'viewtemplate';
			this.depth = 2;
			this.confirmClose=true;
			this.model = this.options.model;
			var data = {model: this.model.attributes};
			this.state = 'view';
			if (data.model.image) this.imageWasSelected = true;
			log("template",data);
			this.createWindow(true, data);
			this.router.bind('imageSelected',this.imageSelected);
			App.collections.templates.bind('change',this.updateContent);
		},
		events: function() {
			var _events = {};
			var windowId = "#window-"+this.cid;
			_events['click '+windowId+' #btn_edit_template']= 'editTemplate';
			_events['click '+windowId+' #btn_start_deal_template']= 'startDeal';
			_events['click '+windowId+' #btn_cancel_template']= 'cancelEdit';
			_events['click '+windowId+' input:not(:button).readonly, textarea.readonly']= 'editTemplate';
			_events['click '+windowId+' #btn_select_image, '+windowId+' #image-field']= 'openSelectImage';
			_events['click '+windowId+' #btn_del_template']= 'delTemplate';
			_events['blur '+windowId+' #orig_price']= 'priceChanged';
			_events['keyup '+windowId+' #deal_price']= 'priceChanged';
			_events['click '+windowId+' .category']= 'categoryChanged';
			return _events;
		},
		updateContent:function(model,d1){
			if(model != this.model) return;
			if(this.state != 'view') return;
			this.setContent({model:model.attributes});
		},
		setValidator: function() {
			var thisClass = this;
			if (!this.form) this.form = $(this.windowId).find('form:not(.validating)');
			if (this.form) {
				//console.log(this.form);
				this.form.formValidate({
					submitKey: '#btn_edit_template',
					rules: {
					title: {
						required: true,
							 minlength: 5
						 },
						 description: {
							 required: true,
							 minlength: 5
						 },
						 orig_price: {
							 required: true,
							 danishNumber:true,
							 //min:0,
							 saving:true
						 },
						 deal_price: {
							 required: true,
							 danishNumber:true,
							 //min:0,
							 saving:true
						 }
				   },
				   errorPlacement: function(error, element) {
					 if (element.attr("name") == "orig_price" || element.attr("name") == "deal_price" ) {
					   $('#prices-error').html(error);
					 } else {
						var parent = element.parents('.field');
						 if (parent) error.appendTo(parent);
						 else error.insertAfter(element);
					 }
				   }
				   
			   });
			   
			   $(this.form).find('input, textarea').focus(function() {
				  thisClass.lastFocus = $(this); 
			   });
			}
		  
		},
		editTemplate:function(obj){
			//log("editTemplate", this.state);
			if(this.state == 'view'){
				$("#btn_edit_template").html("Gem").addClass("blue");
				$("#btn_cancel_template").css("display", "block");
				$("#btn_del_template").css("display", "block");
				//$('#whitespace').css('height', '50px');
				
				$(this.windowId).formSetState('edit');
				this.state = 'edit';
				if (!this.form) this.setValidator();
				if ($('#'+obj.currentTarget.id).is(':button')) {
					if (this.lastFocus) this.lastFocus.focus();
					else this.form.find('input[type=text]:first').focus();
				} else {
					obj.currentTarget.blur();
					obj.currentTarget.focus();
				}
					
				this.important = true;
				this.router.trigger('lock',{lock:'window',me: this.cid,activityCid: this.activity.cid,depth:this.depth});
			}
			else{
				
				//Find image
				var manual = {};
				if ($('#img_src').val()!="" && $('#img_src').val()!=this.model.attributes.image) manual.image = $('#img_src').val();
				if ($(this.windowId+' .category.selected')) manual.category = ($(this.windowId+' .category.selected').attr('id')).substr(4);
				var thisClass = this;
				this.saveToModel({onChanged:function() {
					thisClass.router.trigger('templateEdited',{event:'templateEdited'}); 
				}, success:function(d,data){ 
					$("#btn_edit_template").html("Rediger").removeClass("blue");
					$("#btn_cancel_template").css("display", "none");
					$("#btn_del_template").css("display", "none");
					//$('#whitespace').css('height', '0px');
					thisClass.state = 'view';
				},error: function(d,data){log('error saving model',d,data);} }, false, manual);
				this.important = false;
				this.lastFocus = false;
				
			}
			return false;
			
		},
		startDeal:function(){
			log(this.model.get('approved'));
			if(this.model.get('approved') == 'approved'){
				var route = lang.urls.startdeals + '/' + this.model.get('id');
				this.router.navigate(route,{trigger:true});
			}
			return false;
		},
		cancelEdit:function(){
			var data = {model: this.model.attributes};
			this.state = 'view';
			this.setContent(data);
			this.router.trigger('unlock',{lock:'window',activityCid: this.activity.cid,depth:this.depth});
			return false;
		},
		priceChanged: function() {
			var orig = $('#orig_price').val();
			var deal = $('#deal_price').val();
			calcDiscount(orig, deal, '#discount-amount');
		},
		delTemplate:function(){
			this.model.destroy({data:this.model.id, success:function(model, response) {
				log("destroyed", model, response);
			}, error:function(model, response) { log("error destroy: ", model, response); }});
			this.router.trigger('templateEdited',{event:'templateDeleted'});
			this.activity.closeWindow(this, false, true);
		},
		openSelectImage:function() {
			if (!this.selectorView)
				this.selectorView = new App.views.dialogs.ImageSelectorView({router:this.router, windowId: this.windowId, selected: this.model.attributes.image});
			this.selectorView.openDialog();
		},
		imageSelected:function(data) {
			if (!data.windowId || data.windowId != this.windowId || !data.imgId ||
					(this.model.get('imgId') && this.model.get('imgId')==data.imgId)) return;
			log("imgSelected", data);
			var thisClass = this;
			var src= App.collections.images.getUrl(data.imgId, 'thumbnail');
			if (!this.imageWasSeleted) {
				$('#image-field').removeClass('empty').html('<img src="'+src+'" />');
				$('#btn_select_image').html('Vælg nyt billede');
			} else {
				$('#image-field img').attr('src', src);
			}
			if (this.state=='edit') $("#img_src").val(data.imgId);
			else {
				var obj = {image: data.imgId};
				this.model.save(obj,{success:function(d,data){
					log("success", d, data);
					if (data.success == 'true') {
						thisClass.router.trigger('templateEdited',{event:'templateEdited'});
					}
				}, error:function(d,data){
					log("error", d, data);
				}});
			}
		},
		categoryChanged:function(e) {
			if (this.state!='edit') return;
			var id = e.currentTarget.id;
			$(this.windowId+' .category.selected').removeClass('selected');
			$(this.windowId+' #'+id).addClass('selected');
		},
		cleanUp: function() {
			if (this.selectorView) this.selectorView.closeDialog(true);
		}
	});
});