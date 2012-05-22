define([
'views/windows/window',
'jquery/fileuploader'
],function(){
	App.views.windows.ViewShop = App.views.Window.extend({
		el: '#activity_administration',
		initialize: function(){
			_.bindAll(this,'editShop', 'cancelEdit', 'imgUploadStarted', 'imgUploaded', 'imgUploadCancelled');
			this.template = 'viewshop';
			this.init(this.options);
			this.state='view';
			this.depth = 2;
			this.width = 400;
			this.confirmClose=true;
			this.inputPrefix = 'shop_';
			this.model = App.collections.shops.models[0];
			if (BrowserDetect.dragAndDrop())  this.dragable = true;
			else this.dragable = false;
			var thisClass = this;
			this.createWindow(true,{attributes:this.model.attributes, prefix:this.inputPrefix, dragable:this.dragable, cid:this.cid}, function() {
				thisClass.uploaderEl = $('#shop-img-uploader-'+thisClass.cid);
				var dropable = thisClass.uploaderEl.find('.drop-area')[0];
				var dragDrop = thisClass.dragable?dropable:null;
				thisClass.uploader = new qq.FileUploader({
					element: thisClass.uploaderEl[0],
					button: dropable,
					dragDrop: dragDrop,
					multiple:false,
					template: null,
					listElement: thisClass.uploaderEl[0],
					action: REAL_URL+'api/shopowner/upload/shop_img/'+thisClass.model.get('id'),
					onSubmit: thisClass.imgUploadStarted,
					onComplete: thisClass.imgUploaded,
					onCancel: thisClass.imgUploadCancelled,
					allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
					sizeLimit: 8*1024*1024,
					
				});
			});
			
		},
		events: {
			'click #btn_edit_shop': 'editShop',
			'click input.readonly, textarea.readonly': 'editShop',
			'click #btn_cancel_shop': 'cancelEdit',
			'focus #opening-times input': 'showTimes',
			'blur #opening-times input': 'hideTimes',
			'click #opening-times .day, #opening-times .overlay': 'selectDay'
		},
		imgUploadStarted:function(id, filename, response) {
			this.uploaderEl.find('.drop-area').hide();
		},
		imgUploaded: function(id, filename, response) {
			log("imgUploaded", id, filename, response)
			if (!response) {
				log("Image is too big");
				this.router.showError('Fejl ved upload', 'Billede var for stort og blev ikke uploadet')
			} else if (response.success && response.success!='false') {
				var model = new App.models.Image(response.data),
						thisClass = this;
				this.model.save({shop_img: model.get('n')});
				var img = $('<img />').attr('src', model.getUrl('shop_img')).load(function() {
					thisClass.uploaderEl.find('.img-item').remove();
					thisClass.uploaderEl.find('.drop-area').addClass('overlay').show();
					thisClass.uploaderEl.find('.img-area').html(img);
				});
			} else {
				this.router.showError('Fejl ved upload', 'Der opstod en fejl ved upload af billedet<br/>Fejlbesked: '+response.error);
			}
		},
		imgUploadCancelled: function(id, filename, response) {
			log("imgUploadCancelled", id, filename, response);
			this.uploader.find('.img-item').fadeOut('slow', function() {$(this).remove(); });
			this.uploader.find('.drop-area').show();
		},
		setValidator: function() {
			var thisClass = this;
			this.form = $(this.windowId).find('form');
			if (this.form) {
				var rules = {
						shop_name: "required",
						shop_phone: "digits",
						//shop_website: "url",
						shop_email: "email",
					},
					inOpen, inClose, messages={};
				for (var i=0;i<=7;i++) {
					inOpen = this.inputPrefix+'open-day-'+i+'-open';
					inClose = this.inputPrefix+'open-day-'+i+'-close';
					rules[inOpen] = {
						required: '#'+inClose+':filled',
						timeFormat: true
					};
					rules[inClose] = {
						required: '#'+inOpen+':filled',
						timeFormat: true
					};
					messages[inOpen] = { required: 'Indtast venligst både åbnings- og lukketid' };
					messages[inClose] = messages[inOpen];
				}
				this.form.formValidate({
					submitKey: '#btn_edit_shop',
					rules: rules,
					messages: messages,
					errorPlacement: function(error, element) {
						var field = element.parents('.field');
						if (field) {
							if (element.hasClass('timeinput')) field.find('#open-days-error').html(error);
							else error.appendTo(field);
						} else error.insertAfter(element);
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
				$(this.windowId).formSetState('edit');
				this.state = 'edit';
				if (!this.form) this.setValidator();
				$('#opening-times').addClass('edit');

				if ($('#'+obj.currentTarget.id).is(':button')) {
					if (this.lastFocus) this.lastFocus.focus();
					else this.form.find('input[type=text]:first').focus();
				} else obj.currentTarget.focus();
				
				this.important = true;
				this.router.trigger('lock',{lock:'window',me: this.cid,activityCid: this.activity.cid,depth:this.depth});
			}
			else{
				var open_hours = {},
						$open_hours = $('#opening-times');
				for (var i=0;i<7;i++) {
					open_hours[i] = {};
					open_hours[i]['open'] = $open_hours.find('#day-'+i+' input.opentime').val();
					open_hours[i]['close'] = $open_hours.find('#day-'+i+' input.closetime').val();
				}
				manual = {open_hours: open_hours};
				this.saveToModel({onChanged:function() {
					thisClass.router.trigger('shopEdited',{event:'shopEdited'});
				}, success:function(d,data){
					$open_hours.removeClass('edit').find('.notice').hide();
					thisClass.state = 'view';
				},error:function(d,data){log('error',d,data);} }, false, manual);
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
		selectDay:function(obj) {
			if (this.state=='view') return;
			var $day = $('#'+obj.currentTarget.id).closest('li'),
					$overlay = $day.find('.overlay');
			$overlay.fadeOut(200);
			$day.find('input:first').focus();
		},
		showTimes: function(obj, event) {
			var $this = $(obj.currentTarget),
					$day = $this.closest('li'),
					$overlay = $day.find('.closed');

			if ($overlay.is(':visible')) $overlay.fadeOut(300, function() {
				$day.addClass('selected');
				$overlay.css('display', '');
			});
		},
		hideTimes:function(obj) {
			var $this = $(obj.currentTarget),
					$day =  $this.closest('li'),
					$overlay = $day.find('.closed');
					empty = true;
			if ($this.val()) $this.val(convertToTimestring($this.val()));
			setTimeout(function() {
				$day.find('input').each(function() {
					var $me = $(this);
					if($me.val() || $me.is(':focus')) empty = false;
				});
				if (empty) $overlay.fadeIn(300, function() {
					$day.removeClass('selected');
					$overlay.css('display', '');
				});
				else $day.addClass('selected');
			}, 50);
			
		}
	});
});