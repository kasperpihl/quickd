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
			this.createWindow(true,{attributes:this.model.attributes, prefix:this.inputPrefix});
			
		},
		events: {
			'click #btn_edit_shop': 'editShop',
			'click input.readonly, textarea.readonly': 'editShop',
			'click #btn_cancel_shop': 'cancelEdit',
			'focus #opening-times input': 'showTimes',
			'blur #opening-times input': 'hideTimes',
			'click #opening-times .day, #opening-times .overlay': 'selectDay'
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