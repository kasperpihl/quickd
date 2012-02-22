define([
'views/windows/window',
'order!jquery/jcarousellite.min',
'views/dialogs/imageSelector'
],function(){
	App.views.windows.AddTemplate = App.views.Window.extend({
		el: '#activity_templates',
		initialize: function(){
			_.bindAll(this,'addTemplate','changedModel', 'openSelectImage', 'imageSelected');
			var thisClass = this;
			this.template = 'addtemplate';
			this.init(this.options);
			this.depth = 2;
			this.confirmClose = true;
			this.important = true;
			this.collection = App.collections.templates;
			
			
			this.createWindow(true);
			this.render();
			this.router.bind('imageSelected',this.imageSelected);
		},
		render: function(){
			this.router.trigger('lock',{lock:'window',me: this.cid,activityCid: this.activity.cid,depth:this.depth});
			var thisClass=this;
		},
		events: function() {
			var _events = {};
			var windowId = "#window-"+this.cid;
			_events['click '+windowId+' #btn_submit_add_template']= 'addTemplate';
			_events['click '+windowId+' #btn_select_image, '+windowId+' #image-field']= 'openSelectImage';
			_events['blur '+windowId+' #orig_price']= 'priceChanged';
			_events['keyup '+windowId+' #deal_price']= 'priceChanged';
			return _events;
		},
		addTemplate: function(data){
			if (this.form && this.form.valid()) {
				var obj = {};
				obj.title = $('#title').val();
				obj.description = $('#description').val();
				obj.orig_price = convertNumber($('#orig_price').val());
				obj.deal_price = convertNumber($('#deal_price').val());
				obj.image = $('#img_src').val();
				this.model = new App.models.Template();
		
			
				this.model.save(obj,{success:this.changedModel,error:this.changedModel,silent:true});
					
			} else if(this.form)  this.form.submit();
		},
		changedModel: function(data,d){
			
			this.collection.add(this.model);
			App.views.notifications.notify('fast',lang.notifications.template.created);
			this.confirmClose=false;
			this.activity.closeWindow(this);
		},
		onCreated: function() {
			var thisClass = this;
			this.form = $(this.windowId).find('form');
			if (this.form) {
				this.form.formValidate({
					submitKey: '#btn_submit_add_template',
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
			   
			   /*$(thisClass.windowId+" #selector-images").jCarouselLite({
					btnNext: thisClass.windowId+" #nextImg",
					btnPrev: thisClass.windowId+" #prevImg",
					beforeStart: function(items) {
						var i = Math.floor(items.length/2);
						$(items[i]).removeClass('selected');
					},
					afterEnd: function(items) {
						var i = Math.floor(items.length/2);
						$(items[i]).addClass('selected');
					}
				});*/
				$(thisClass.windowId+" #image-selector").slides({
					//generateNextPrev: true
					preload: true,
					preloadImage: 'styles/stylesheets/i/loader2.gif',
					//autoHeight:true,
					animationComplete: function (current) {
						var src = $(thisClass.windowId+" #image-selector").find('.slides_container .slides_control div');
						src = src.get(current-1);
						if (src) src = $(src).find('img').attr('src');
						else src = "";
						log(src);
						$('#img_src').val(src);
					}
				});
				$(thisClass.windowId+" #image-selector").find('.curtain').remove();
			   
			   this.form.find('input[type=text]:first').focus();
			}
		},
		priceChanged: function() {
			var orig = $('#orig_price').val();
			var deal = $('#deal_price').val();
			calcDiscount(orig, deal, '#discount-amount');
		},
		openSelectImage:function() {
			if (!this.selectorView)
				this.selectorView = new App.views.dialogs.ImageSelectorView({router:this.router, windowId: this.windowId});
			this.selectorView.openDialog();
		},
		imageSelected:function(data) {
			//log("imageSelected", data);
			if (!data.windowId || data.windowId != this.windowId || !data.imgId) return;
			var src= App.collections.images.getUrl(data.imgId, 'thumbnail');
			if (!this.imageWasSeleted) {
				$('#image-field').removeClass('empty').html('<img src="'+src+'" />');
				$('#btn_select_image').html('Vælg nyt billede');
			} else {
				$('#image-field img').attr('src', src);
			}
			this.imageWasSelected = true;
			$("#img_src").val(data.imgId);
		},
		cleanUp: function() {
			if (this.selectorView) this.selectorView.closeDialog(true);
		}
	});
});