define([
'text!templates/startdeal.html',
'views/component/templateSelector',
'order!jquery/jquery-ui',
'order!jquery/jquery.ui.timepicker.addon',
'order!jquery/jquery.ui.datepicker-da'
],function(template){
	App.views.StartDeal = Backbone.View.extend({
		el: '#activity_startdeals',
		initialize:function(){
			_.bindAll(this,'startDeal','render','updateTemplates', 'setTemplateSelected', 'setVerticalAlign','handleEvent', 'updateEndTime', 'setDealType', 'convertTimes');
			this.templateName = 'startdeal';
			this.elemId = 'start_deal';
			this.dealTemplates = {};
			this.showTimeType = 'type-now';
			this.router = this.options.router;
			this.activity = this.options.activity;
			this.timeStandard = 300;
			this.timeMinInterval = 15;
			this.start_time = roundToMinutes(null, this.timeMinInterval).getTime();
			this.templateSelected = null;
			this.render();
			this.router.bind('appendWindow',this.handleEvent);
			this.router.bind('templatesUpdated',this.updateTemplates);
			this.router.bind('templateSelected',this.setTemplateSelected);
		},
		events: {
			'click #deal-type-selector .option': 'setDealType',
			'click #btn_submit_start_deal': 'startDeal',
			'click #day-selector .day-block': 'selectDay',
			'blur #regular_deal_block input': 'convertTimes'
		},
		render: function(){
			var thisClass = this;
			this.first = true;
			this.dealType = 'regular';
			this.expanded = false;
			this.starting = false;
			this.hours = null;
			this.vAligned = false;
			this.minutes = this.timeStandard;
			$(this.el).html(_.template(template,{data:this}));
			this.$cmp = $('#start_deal');
			this.updateHours(true);
			//Setting jquery date pickers
			this.$cmp.find('#deal_start_time').datetimepicker({
				stepMinute: thisClass.timeMinInterval,
				hourGrid: 4,
				minuteGrid: thisClass.timeMinInterval,
				minDate: getTimeString(false,true),
				timeFormat: 'hh:mm',
				onClose: function(dateText, inst) {
					thisClass.start_time = $(this).datetimepicker('getDate').getTime();
					thisClass.updateEndTime();
				},
				onSelect: function (dateText){
					thisClass.start_time = $(this).datetimepicker('getDate').getTime();
					thisClass.updateEndTime();
				}
			});
			this.slider = this.$cmp.find('#deal_time_slider').slider({
				min:15,
				max:600,
				value: thisClass.timeStandard,
				step:15,
				slide: function(e, data) {
					thisClass.minutes = data.value;
					thisClass.updateHours();
				}
			});
			this.selectorView = new App.views.components.TemplateSelectorView({
				router:this.router,
				appendTo: '#select-template-list',
				expandOnCreate: (this.templateSelected===null),
				parent: this.cid,
				onExpand: function() {
					if (thisClass.expanded) thisClass.collapse();
					else thisClass.setVerticalAlign();
				},
				onCollapse: thisClass.setVerticalAlign,
				onCreated:	thisClass.setVerticalAlign
			});
			return true;
		},
		handleEvent:function(options){
			if (options.window && options.window==='startWithTemplate'){
					var thisClass = this,
							obj = {};
					this.templateSelected = options.id;
					if (options.type) {
						this.setDealType(options.type, true);
						obj = {silent:true};
					}
					if (this.selectorView) this.selectorView.setSelected(options.id, obj);
					
			}
		},
		setVerticalAlign:function(options) {
			if (!this.$cmp.is(':visible')) {
				this.$cmp.css({'position':'absolute','visibility':'hidden','display':'block'});
				this.$cmp.verticalAlign(this.vAligned, options);
				this.$cmp.css({'visibility':'visible'});
			} else {
				var o = $.extend({}, options, {animate:true});
				this.$cmp.verticalAlign(this.vAligned, o);
			}
			this.vAligned = true;
		},
		setDealType:function(obj, notEvent) {
			if (notEvent) {
				var dealType = obj,
						$selector = $('#deal-type-selector');
			} else {
				var $selector = $(obj.currentTarget).parents('.type-selector'),
						id = obj.currentTarget.id,
						dealType = id=='type_regular'?'regular':'instant';
			}
			if (this.dealType!=dealType) {
				$('#'+this.dealType+'_deal_block').css('display', 'none');
				$('#'+dealType+'_deal_block').css('display', 'block');
				$selector.find('.option').toggleClass('selected');
				this.dealType = dealType;
				this.activity.route = lang.urls.startdeals+'/'+this.templateSelected+'/'+this.dealType;
				this.router.navigate(this.activity.route);
			}
		},
		updateTemplates:function(data) {
			this.dealTemplates = data;
		},
		setTemplateSelected:function(data) {
			if (data && data.parent === this.cid && data.templateId) {
				var id = data.templateId;
				this.templateSelected = id;
				if (!data.silent) {
					var route = lang.urls.startdeals+'/'+this.templateSelected;
					this.activity.route = route;
					this.router.navigate(route);
				}
				this.expand();
			}
		},
		expand: function() {
			if (!this.expanded && this.templateSelected) {
					var thisClass = this;
					$('#deal_start_time').val(getTimeString(0, true,this.timeMinInterval));
					var time = (new Date()).getTime()+1000*60*60 * this.timeStandard;
					$('#deal_end_time').val(getTimeString(time,true,this.timeMinInterval));
					var set_template = $('#set_template_block');
					if (!this.$cmp.is(':visible')) {
						$('#stage-two').css({position:'relative',top: '0px'}).show();
						//if(!thisClass.height) thisClass.height = $('#start_deal').outerHeight();
					} else {
						/*var wrapper = $('<div />').css({overflowY:'hidden',width:'100%'});
						$('#stage-two').wrap(wrapper)
							.css({position:'relative',top: -$('#stage-two').outerHeight()-20}).show()
							.animate({ top: 0 }, {duration: 1000, easing:'easeOutExpo', complete: function() {
								$(this).unwrap();
							},queue:false});*/
						log("expanding");
						$('#stage-two').fadeIn('slow');
					}
					//thisClass.setVerticalAlign();
					this.expanded = true;
					
			}
		},
		collapse: function(doReset) {
			if (this.expanded) {
				var thisClass = this;
				thisClass.router.navigate(lang.urls.startdeals);
				this.activity.route = lang.urls.startdeals;
				$('#deal_templates').val("");

				var height = this.selectorView?$('#set_template_block').outerHeight()-this.selectorView.collapsedHeight+this.selectorView.expandedHeight:0;
				this.setVerticalAlign({meHeight:height});

				/*var wrapper = $('<div />').css({overflowY:'hidden',width:'100%'});
				$('#stage-two').wrap(wrapper)
					.animate({ top: -$('#stage-two').outerHeight()-20 }, {duration: 1000, easing:'easeOutExpo', complete: function() {
						if(!thisClass.expanded) $(this).hide();
						$(this).unwrap();
					},queue:false});*/
				$('#stage-two').fadeOut('slow');
				if (doReset && this.selectorView) this.selectorView.resetSelected();
				//$('#start_deal').verticalAlign(false, {animate:true, meHeight:$('#set_template_block').outerHeight()});
				
				
				this.expanded = false;
				this.templateSelected=null;
				
			}
		},
		updateHours:function(hoursOnly) {
			var m = this.minutes,
					h = Math.floor(m/60);
			m = m%60;
			var v = hoursOnly ? h : h+':'+padNumber(m);
			$('#deal_hours').html($.trim(v));
			this.updateEndTime();
		},
		updateEndTime:function() {
			var hours = this.minutes;
			if (!this.start_time) this.start_time = roundToMinutes(null, this.timeMinInterval).getTime();
			this.end_time = this.start_time + this.minutes * 60 * 1000;
			$('#deal_end_time').html(getTimeString(this.end_time, 'simple'));
		},
		selectDay:function(evt) {
			var $this = $(evt.currentTarget);
			$this.toggleClass('selected');
		},
		convertTimes:function(evt) {
			var $this = $(evt.currentTarget);
			if ($this.val()) {
				var newVal = convertToTimestring($this.val()),
						start = this.timeToSecs($('#regular-deal-start-time').val()),
						end = this.timeToSecs($('#regular-deal-end-time').val())
				$this.val(newVal);
				if (start&&end&&end <= start) {
					$('#regular-time-field').find('.hint').fadeIn('fast');
				} else $('#regular-time-field').find('.hint').fadeOut('fast');
			}
		},
		timeToSecs:function(timestring) {
			var time = convertToTimestring(timestring, true);
 			if(time && time.h >= 0 && time.h < 24 && time.m >= 0 && time.m<60) {
 				return time.h*60*60 + (time.m)*60 + 59;
 			} else return false;
		},
		resetStarter:function(doWait) {
			//REMEMBER TO RESET!!
			if (!this.expanded) return;
			var thisClass = this;
			if (doWait) {
				setTimeout(function() {
					this.start_time = roundToMinutes(null, this.timeMinInterval).getTime();
					if (thisClass.selectorView) thisClass.selectorView.resetSelected();
					thisClass.render();
				}, 1000);
			} else {
				this.start_time = roundToMinutes(null, this.timeMinInterval).getTime();
				if (thisClass.selectorView) thisClass.selectorView.resetSelected();
				thisClass.render();
			}
	
			
		},
		animateAway:function(callback) {
	
			var thisClass = this;
			//$('#start_deal').css('position', 'relative');
			$('#time_block').css('z-index',1).unwrap();
			$('#set_template_block').css('z-index',2);
			//$('#set_treasure_block').css('z-index',1);
			
			var els = [$('#starter_button'),$('#time_block'),$('#set_template_block')],
					i = 0,
					thisHeight = this.$cmp.outerHeight(),
					pos = thisHeight - ($('#btn_overview').offset().top+50-this.$cmp.offset().top);
			this.$cmp.height(thisHeight);
			$(els).each(function() {
				var me = $(this);
				i++;
				me.css({position:'absolute', bottom: thisHeight-(me.position().top+parseInt(me.outerHeight())), left:(me.position().left+parseInt(me.css('marginLeft'))), width:me.width()})
					.animate({ bottom: pos}, 800, 'easeInOutSine', function() {
						if (i == els.length) {
							
							var el = $('#select-template-list');
							el.css({position:'absolute', zIndex:3, top: el.offset().top, left:el.offset().left, width:el.width()}).appendTo('#content');
							thisClass.$cmp.fadeOut(500);
							el.animate({ left: 0, top: $('#btn_overview').offset().top, opacity:0.2 }, 1000, 'easeInOutSine', function() {
								$(this).remove();
								if (callback) callback();
							});
						}
					});
			});
		},
		showError:function(msg) {
			this.errorMsg = true;
			this.starting = false;
			var thisClass = this,
					$bubble = $("#bubble_msg");
			if (msg) $bubble.html('<p>'+msg+'</p>');
			$bubble.css('top','-'+(parseInt($bubble.outerHeight())+10)+'px');
			this.shakeADeal();
			$bubble.delay(250).fadeIn('slow', function() {
				$("#start_deal").click(function() {
					thisClass.hideError(true);
				});
			});
			
			window.setTimeout(function(){
				$("#set_template_block").animate({opacity:0.5}, {duration:200, queue:false});
			}, 250);
		},
		hideError:function(fade){
			if (fade) {
				$("#bubble_msg").fadeOut("slow");
				$("#set_template_block").animate({opacity:1}, {duration:200, queue:false});
			} else {
				$("#bubble_msg").hide();
				$("#set_template_block").css('opacity', '1');
			}
			this.errorMsg = false;
		},
		shakeADeal:function() {
			$("#time_block").effect("shake", { times:2, queue:false }, 50);
		},
		treasureDialog:function(){
			var thisClass = this;
			require([
				'views/dialogs/treasure'
			],function(){
				thisClass.readmore = new App.views.dialogs.Treasure({router:thisClass.router});
				thisClass.readmore.openDialog();
			});
		},
		startDeal:function(){
			//var me=$('#starter_button');log("button", me.position().left, me.position().left+parseInt(me.css('marginLeft'))); return;
			if (this.starting) return false;
			this.starting = true;
			if(this.errorMsg) this.hideError();
			var thisClass = this,
					obj = {};
			if (this.dealType=='regular') {
				var time = {
						start: this.timeToSecs($('#regular-deal-start-time').val()),
						end: this.timeToSecs($('#regular-deal-end-time').val())
					},
					$selector = $('#day-selector'),
					$days = $selector.find('.day-block');
				if( $selector.find('.day-block.selected').size()==0) return thisClass.showError('Vælg venligst mindst én ugedag, som tilbuddet skal køre på');
				else	if (!time.start || !time.end) return thisClass.showError('Indtast venligst kun gyldige klokkeslæt');
				else {
					obj.deal_type = 'regular';
					obj.times = {};
					if (time.end<=time.start) time = {start: time.start, end: 24*60*60 + time.end }
					$days.each(function(d) {
						if ($(this).hasClass('selected')) obj.times[d] = time;
						else obj.times[d] = false;
					});
				}
			} else {
				obj.deal_type = 'instant';
				obj.start = this.start_time/1000;
				obj.end = this.end_time/1000;
			}
			obj.shop_id = App.collections.shops.at(0).id;
			obj.template_id = this.templateSelected;
			log("save this?", obj)

			
			
			$('#btn_submit_start_deal').html('Planlægger...').addClass('disabled');
			var model = new App.models.Deal();
			model.save(obj,{
				success:function(m,data){
					log("success",m,data);
					if(data.success && data.success == 'true'){
						log("start response", model,m);
						App.collections.deals.add(model);
						thisClass.animateAway(function() {
							thisClass.activity.route = lang.urls[thisClass.activity.activityName]
							thisClass.router.navigate(lang.urls.overviewDeals+'/'+m.id,{trigger:true});
							thisClass.resetStarter(true);
							thisClass.router.trigger('dealEdited',{event: 'deal_planned'});
						});
						
					}
					else {
						$('#btn_submit_start_deal').removeClass('disabled').html('Planlæg deal');
						thisClass.starting = false;
						
						if (data.error == 'deal_already_planned'){
							thisClass.showError('En deal baseret på den valgte skabelon er allerede planlagt i tidsrummet.');
						} else {
							thisClass.router.showError("Der opstod en fejl", "Din deal blev ikke startet<br />Fejlmeddelelse: "+data.error);
						}
						log("start error", data);
					}
					
				},
				error:function(m,data){
					log('error', m,data);
					thisClass.router.showError("Der opstod en fejl", "Din deal blev ikke startet<br />Fejlmeddelelse: "+data.error);
				}
			});
			return false;
			
		}
	});
});