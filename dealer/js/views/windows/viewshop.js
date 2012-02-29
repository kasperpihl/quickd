define([
'views/windows/window'
],function(){
	App.views.windows.ViewShop = App.views.Window.extend({
		el: '#activity_administration',
		initialize: function(){
			this.template = 'viewshop';
			this.init(this.options);
			_.bindAll(this,'editShop', 'cancelEdit');
			this.state='view';
			this.depth = 2;
			this.width = 400;
			this.confirmClose=true;
			this.inputPrefix = 'shop_';
			this.model = App.collections.shops.models[0];
			var thisClass = this;
			this.createWindow(true,{attributes:this.model.attributes, prefix:this.inputPrefix}, function() {
				thisClass.selectable = $('#weekdays').selectable({ disabled: true });
			});
			
		},
		events: {
			'click #btn_edit_shop': 'editShop',
			'click input.readonly, textarea.readonly': 'editShop',
			'click #btn_cancel_shop': 'cancelEdit'
		},
		setValidator: function() {
			var thisClass = this;
			this.form = $(this.windowId).find('form');
			if (this.form) {
				this.form.formValidate({
					submitKey: '#btn_edit_shop',
					rules: {
						shop_name: "required",
						shop_phone: "digits",
						//shop_website: "url",
						shop_email: "email"
			   }
			   });
			   
			   $(this.form).find('input, textarea').focus(function() {
				  thisClass.lastFocus = $(this); 
			   });
			   
			}
		  
		},
		editShop:function(obj){
			var thisClass = this;
			if(this.state == 'view'){
				$("#btn_edit_shop").html("Gem").addClass("blue");
				$("#btn_cancel_shop").css("display", "block");
				$(this.windowId).formSetState('edit');
				this.state = 'edit';
				if(this.selectable) $('#weekdays').selectable("enable");
				if (!this.form) this.setValidator();
				
				if ($('#'+obj.currentTarget.id).is(':button')) {
					if (this.lastFocus) this.lastFocus.focus();
					else this.form.find('input[type=text]:first').focus();
				} else obj.currentTarget.focus();
				
				this.important = true;
				this.router.trigger('lock',{lock:'window',me: this.cid,activityCid: this.activity.cid,depth:this.depth});
			}
			else{
				
				this.saveToModel({onChanged:function() {
					thisClass.router.trigger('shopEdited',{event:'shopEdited'});
				}, success:function(d,data){
					$("#btn_edit_shop").html("Rediger").removeClass("blue");
					$("#btn_cancel_shop").css("display", "none");
					$('#weekdays').selectable("disable");
					thisClass.state = 'view';
				},error:function(d,data){log('error',d,data);} });
				this.important = false;
			}
			
			return false;
		},
		cancelEdit:function(){
			this.state = 'view';
			this.setContent({attributes:this.model.attributes, prefix:this.inputPrefix});
			this.router.trigger('unlock',{lock:'window',activityCid: this.activity.cid,depth:this.depth});
			return false;
		},
		doEdit:function(obj) {
			if (this.state=='view') {
				$(this.windowId).formSetState('edit');
				if (!this.form) this.setValidator();
				obj.currentTarget.blur();
				obj.currentTarget.focus();
				this.state = 'edit';
			}
		}
	});
});