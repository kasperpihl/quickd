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
			_.bindAll(this,'startDeal','render','updateTemplates', 'selectTemplate', 'setTemplateSelected', 'setVerticalAlign','handleEvent');
			this.templateName = 'startdeal';
			this.elemId = 'start_deal';
			this.dealTemplates = {};
			this.showTimeType = 'type-now';
			this.dateSelected = false;
			this.router = this.options.router;
			this.activity = this.options.activity;		
			this.timeStandard = 5;
			this.timeMinInterval = 10;
			this.templateSelected = null;
			this.render();
			this.router.bind('appendWindow',this.handleEvent);
			this.router.bind('templatesUpdated',this.updateTemplates);
			this.router.bind('templateSelected',this.setTemplateSelected);
		},
		
		render: function(){
			var thisClass = this;
			$(this.el).html(_.template(template,{data:this}));
			this.first = true;
			this.expanded = false;
			this.starting = false;
			this.hours = null;
			//Setting jquery date pickers
			$('#'+this.elemId+' #deal_start_time').datetimepicker({
				stepMinute: thisClass.timeMinInterval,
				hourGrid: 4,
				minuteGrid: thisClass.timeMinInterval,
				minDate: getTimeString(false,true),
				timeFormat: 'hh:mm',
				onClose: function(dateText, inst) {
					if (!thisClass.dateSelected) thisClass.dateSelected = true;
					thisClass.updateHours(true);
				},
				onSelect: function (dateText){
					var start = $(this).datetimepicker('getDate').getTime();
					
					var endDateField = $('#deal_end_time');
					endDateField.datetimepicker('option', 'minDate', new Date(start) );
					
					var dateAmr = dateToAmr(dateText);
					var testStartDate = dateAmr;
					if (endDateField.val() !== '') var testEndDate = dateToAmr(endDateField.val());
					else var testEndDate = new Date(0);
					if (!thisClass.dateSelected || endDateField.val() === '' || testStartDate > testEndDate) {
						var hours = (thisClass.hours ? thisClass.hours : thisClass.timeStandard);
						var end = testStartDate.getTime() + 1000*60*60*hours;
						endDateField.val(getTimeString(end, true, thisClass.timeMinInterval));
					}
				
					thisClass.updateHours();
					
				}
			});
			$('#treasure_read_more').click(function(){
				thisClass.treasureDialog();
			});
			$('#'+this.elemId+' #deal_end_time').datetimepicker({
				stepMinute: thisClass.timeMinInterval,
				hourGrid: 4,
				minuteGrid: thisClass.timeMinInterval,
				timeFormat: 'hh:mm',
				minDate: getTimeString(false,true),
				onClose: function(dateText, inst) {
					dateAmr = dateToAmr(dateText);
					var startDateTextBox = $('#deal_start_time');
					if (startDateTextBox.val() != '') {
						var testStartDate = dateToAmr(startDateTextBox.val());
						var testEndDate = dateAmr;
						if (testStartDate > testEndDate)
							startDateTextBox.val(dateText);
					}
					else {
						startDateTextBox.val(dateText);
					}
					thisClass.updateHours(true);
				},
				onSelect: function (selectedDateTime){
					//var end = $(this).datetimepicker('getDate');
					//$('#deal_start_time').datetimepicker('option', 'maxDate', new Date(end.getTime()) );
					thisClass.updateHours();
				}
			});	
			//this.height = $('#start_deal').height();
			this.setVerticalAlign();
			this.selectorView = new App.views.components.TemplateSelectorView({
				router:this.router, 
				appendTo: '#select-template-list',
				expandOnCreate: (this.templateSelected==null),
				parent: this.cid, 
				onExpand: function() {
					if (thisClass.expanded) thisClass.collapse();
					else thisClass.setVerticalAlign();
				},
				onCollapse: this.setVerticalAlign
			});
			return true;
		},
		handleEvent:function(options){
			if (options.window && options.window==='startWithTemplate'){
					var thisClass = this;
					this.templateSelected = options.id;
					if (this.selectorView) this.selectorView.setSelected(options.id);
			}
		},
		setVerticalAlign:function() {
			if (!$('#start_deal').is(':visible')) {
				$("#start_deal").css({'position':'absolute','visibility':'hidden','display':'block'});
				$('#start_deal').verticalAlign(false);
				$("#start_deal").css({'visibility':'visible'});
			} else {
				$('#start_deal').verticalAlign(false, {animate: true});
			}
		},
		updateTemplates:function(data) {
			log("templates updated");
			this.dealTemplates = data;
		},
		setTemplateSelected:function(data) {
			if (data && data.parent === this.cid && data.templateId) {
				var id = data.templateId;
				log("setTemplateSelected", id);
				this.templateSelected = id;
				this.router.navigate(lang.urls.startdeals+'/'+this.templateSelected);
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
					if (!$('#start_deal').is(':visible')) {
						$('#stage-two').css({position:'relative',top: '0px'}).show();
						//if(!thisClass.height) thisClass.height = $('#start_deal').outerHeight();
					} else {
						var wrapper = $('<div />').css({overflowY:'hidden',width:'100%'});
						$('#stage-two').wrap(wrapper)
							.css({position:'relative',top: -$('#stage-two').outerHeight()-20}).show()
							.animate({ top: 0 }, {duration: 1000, easing:'easeOutExpo', complete: function() {
								$(this).unwrap();
							},queue:false});
					}
					thisClass.setVerticalAlign();
					this.expanded = true;
					
			}
		},
		collapse: function(doReset) {
			if (this.expanded) {
				var thisClass = this;
				thisClass.router.navigate(lang.urls.startdeals);
				$('#deal_templates').val("");

				var wrapper = $('<div />').css({overflowY:'hidden',width:'100%'});
				$('#stage-two').wrap(wrapper)
					.animate({ top: -$('#stage-two').outerHeight()-20 }, {duration: 1000, easing:'easeOutExpo', complete: function() {
						if(!thisClass.expanded) $(this).hide();
						$(this).unwrap();
					},queue:false});
				if (doReset && this.selectorView) this.selectorView.resetSelected();	
				//$('#start_deal').verticalAlign(false, {animate:true, meHeight:$('#set_template_block').outerHeight()});
				this.setVerticalAlign();
				this.expanded = false;
				this.templateSelected=null;
				
			}
		},
		updateHours:function(setHours) {
			var start = $('#deal_start_time').datetimepicker('getDate');
			var end = $('#deal_end_time').datetimepicker('getDate');
			var diff = end.getTime() - start.getTime();
	
			var minutes = Math.round(diff/1000/60);
			var m = padNumber(minutes%60);
			var h = Math.round(minutes/60);
			if (setHours) this.hours = h;
			$('#deal_hours').html(h);
		},
		events: {
			'click #btn_submit_start_deal': 'startDeal',
			//'click #btn_select_area': 'selectTemplate'
		},
		selectTemplate: function() {
			//if (!this.selectorView) 
				//this.selectorView = new App.views.dialogs.TemplateSelectorView({router:this.router, templates:this.dealTemplates});
			//this.selectorView.openDialog();
			//if (!this.selectorView) 
				
			//this.selectorView.openDialog();

		},
		resetStarter:function(doWait) {
			//REMEMBER TO RESET!!
			if (!this.expanded) return;
			var thisClass = this;
			if (doWait) {
				setTimeout(function() {
					thisClass.dateSelected = false;
					if (thisClass.selectorView) thisClass.selectorView.resetSelected();
					thisClass.render();
				}, 1000);
			} else {
				thisClass.dateSelected = false;
				if (thisClass.selectorView) thisClass.selectorView.resetSelected();
				thisClass.render();
			}
	
			
		},
		animateAway:function(callback) {
	
			var thisClass = this;
			//$('#start_deal').css('position', 'relative');
			$('#set_time_block').css('z-index',1).unwrap();
			$('#set_template_block').css('z-index',2);
			//$('#set_treasure_block').css('z-index',1);
			
			var els = [$('#starter_button'),$('#set_time_block'),$('#set_template_block')];
			var i = 0;
			var pos = $('#btn_overview').offset().top-$('#start_deal').offset().top-50;
			$(els).each(function() {
				var me = $(this);
				i++;
				me.css({position:'absolute', top: me.position().top, left:me.position().left, width:me.width()})
					.animate({ top: pos }, 800, 'easeInOutSine', function() {
						if (i == els.length) {
							
							var el = $('#select-template-list');
							el.css({position:'absolute', zIndex:3, top: el.offset().top, left:el.offset().left, width:el.width()}).appendTo('#content');
							$('#start_deal').fadeOut(500);
							el.animate({ left: 0, top: $('#btn_overview').offset().top, opacity:0.2 }, 1000, 'easeInOutSine', function() {
								$(this).remove();
								if (callback) callback();
								
							});
							
						}
					});
			});
		},
		fadeOutError:function() {
			$("#bubble_msg").fadeOut("slow");
			$("#set_template_block").animate({opacity:1}, {duration:200, queue:false});
		},
		showError:function() {
			this.errorMsg = true;
			var thisClass = this;
			$("#bubble_msg").delay(250).fadeIn('slow', function() {
				$("#time-picker").click(function() {
					thisClass.fadeOutError();
				});
				
				$("#set_template_block").click(function() {
					thisClass.fadeOutError();
				});
				
				//window.setTimeout(function(){
				//	thisClass.fadeOutError();
				//}, 10000);
			});
			
			window.setTimeout(function(){
				$("#set_template_block").animate({opacity:0.5}, {duration:200, queue:false});
			}, 250);
			
			//$("#bubble_msg").delay(250).animate({opacity: 1}, {duration: 50, queue: false}).delay(8000).animate({opacity: 0}, {duration: 50, queue: false});
			
			/*window.setTimeout(function(){
				$("#bubble_msg").animate({opacity: 1}, {duration: 500, queue: false}).delay(8000).animate({opacity: 0}, {duration: 500, queue: false});
			}, 250);*/
		},
		hideError:function(){
			$("#bubble_msg").hide();
			this.errorMsg = false;
		},
		shakeADeal:function() {
			$("#time-picker").effect("shake", { times:2, queue:false }, 50);
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
			if (this.starting) return;
			this.starting = true;
			if(this.errorMsg) this.hideError();
			var thisClass = this;
			
			$('#btn_submit_start_deal').val('Planlægger...').addClass('disabled');
			var obj = {};
			obj.shop_id = App.collections.shops.at(0).id;
			obj.template_id = this.templateSelected;
			obj.start = $('#deal_start_time').val();
			obj.end = $('#deal_end_time').val();
			var model = new App.models.Deal();
			model.save(obj,{
				success:function(data,d){
					
					if(d.success && d.success == 'true'){
						log("start response", data,d);
						App.collections.deals.add(model);
						
						//$('#btn_submit_start_deal');
						thisClass.animateAway(function() {
							thisClass.activity.route = lang.urls[thisClass.activity.activityName]
							thisClass.router.navigate(lang.urls.overviewDeals+'/'+data.id,{trigger:true});
							thisClass.resetStarter(true);
							thisClass.router.trigger('dealStarted',{event: 'deal_planned'});
						});
						
					}
					else {
						$('#btn_submit_start_deal').removeClass('disabled').val('Planlæg deal');
						thisClass.starting = false;
						
						switch(d.error){
							case 'deal_already_planned':
								thisClass.shakeADeal();
								thisClass.showError();
							break;
						}
						log("start error", d);
					}
					
				},
				error:function(data,d){
					log(data,d);
					console.dir(d);
				}
			});
			
		}
	});
});
