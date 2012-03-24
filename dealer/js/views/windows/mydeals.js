define([
'views/windows/window'
],function(){
	App.views.windows.MyDeals = App.views.Window.extend({
		el: '#activity_overview',
		depth: 2,
		deals: {
			current: [],
			planned: [],
			ended: []
		},
		initialize: function(){
			var thisClass = this;
			this.init(this.options);
			_.bindAll(this,'updateContent', 'stateChanged', 'viewDeal', 'changeTab', 'onDealAdded', 'onDealChanged', 'removeDeal', 'confirmRemoveCallback');
			this.template = 'mydeals';
			this.tabId = 'deals-tab-current';
			
			
			this.collection = App.collections.deals;
			if (this.options.dealId) this.currentDeal = this.collection.get(this.options.dealId);
			else this.currentDeal = null;
			if (this.currentDeal) this.view = 'deal-details';
			else this.view = 'deal-list';
			log("deals", this.collection.toJSON());
			var data = this.updateContent(false);
			this.createWindow(true, data);
			App.collections.deals.bind('add',this.onDealAdded);
			App.collections.deals.bind('change',this.onDealChanged);
			App.collections.deals.bind('remove',this.updateContent);
			this.router.bind('promtCallback:'+this.cid, this.confirmRemoveCallback);
		},
		updateContent:function(doSetContent) {
			var thisClass = this;
			var data = this.sortDeals();
			if (this.currentDeal) {
				var tpl = 'text!templates/component/viewDeal.html';
				require([tpl],function(template){

				});
				data.dealView = _.template()
			}
			data.currentDeal = this.currentDeal;
			data.tabId = this.tabId;
			data.view = this.view;
			if (doSetContent) this.setContent(data);
			else return data;
		},
		onDealChanged:function(data, obj) {
			log("onDealChanged", data, obj);
			if (data.hasChanged('state')) {
				this.stateChanged(data.get('id'));
			} else this.updateContent(true);
		},
		onDealAdded:function(data, obj) {
			this.currentDeal = data;
			this.view = 'deal-details';
			this.updateContent(true);
		},
		sortDeals:function() {
			var thisClass = this;
			var deals = this.collection.toJSON();
			this.deals = {
				current: [],
				planned: [],
				ended: []
			}
			_.each(deals, function(deal) {
				if(deal.state && thisClass.deals[deal.state]) thisClass.deals[deal.state].push(deal);
			});
			return this.deals;
		},
		stateChanged: function(id) {
			var thisClass = this;
			var deal = this.collection.get(id).toJSON();
			if (deal) {
				var el = $('#deal-'+deal.id);
				var state = deal.state;
				var preState = el.parent('.deal-list').attr('id').substr(6);
				//log("stateChanged", deal, state, preState);
				if (state!=preState) {
					el.slideUp('300', function() {
						if (thisClass.deals[preState].length==1) {
							var block = $('#deals-'+preState).find('.empty-block');
							if (block.is(':visible')) block.fadeIn('slow');
							else block.css({display:'block'});
						}
						if (thisClass.deals[state].length==0) {
							var block = $('#deals-'+state).find('.empty-block');
							if (block.is(':visible')) block.fadeOut('slow');
							else block.css({display:'none'});
						}
						
						
						$(this).prependTo('#deals-'+state).slideDown();
						
					});
				}
			} 
		},
		events: function() {
			var _events = {};
			_events['click '+this.windowId+' .deal-item'] = 'viewDeal';
			_events['click '+this.windowId+' .tab-link'] = 'changeTab';
			_events['click '+this.windowId+' #btn_deal_back'] = 'viewList';
			_events['click '+this.windowId+' #btn_remove_deal'] = 'removeDeal';
			return _events;
		},
		fillFields:function(empty) {
			if (!empty && this.currentDeal) var data = this.currentDeal.toJSON().template;
			else {
				//create empty object here	
			}
			
			$('#deal_title').html(data.title);
			var imgSrc = data.image ? IMG_URL+'thumbnail/'+data.image : 'styles/stylesheets/i/no_image_small.png';
			//log("imgSrc", imgSrc);
			$('#deal_image').attr('src', imgSrc);
			$('#deal_orig_price').html(data.orig_price+' kr.');
			$('#deal_price').html(data.deal_price+ ' kr.');
			var discount = Math.round((data.orig_price-data.deal_price) / data.orig_price * 100);
			$('#deal_discount').html(discount+'%');
			
			$('#deal_starting_time').html(getTimeString(this.currentDeal.get('start')*1000, 'simple'));
			$('#deal_ending_time').html(getTimeString(this.currentDeal.get('end')*1000, 'simple'));
			$('#deal_description').html(data.description);
		},
		viewDeal: function(data) {
			var id = data.currentTarget.id;
			id = id.substr(5);
			this.router.navigate(lang.urls.overviewDeals+'/'+id,{trigger:true});
		},
		viewList:function() {
			this.router.navigate(lang.urls.overviewDeals,{trigger:true});
		},
		showDeal: function(id){
			this.currentDeal = this.collection.get(id);
			if (this.currentDeal) {
				$('#btn_deal_back').show();
				this.fillFields();
				this.changeView('deal-details');
			}
		},
		removeDeal:function(){
			if (this.currentDeal) {
				var time = parseInt(new Date().getTime()/1000);
				if (this.currentDeal.start>time ||this.currentDeal.end < time) {
					var title = 'Er du sikker på du ønsker at slette denne deal?',
							btn_txt = 'Slet';
				} else {
					var title = 'Er du sikker på du ønsker at melde denne deal udsolgt?',
							btn_txt = 'Meld udsolgt';
				}
				var confirmer = new App.views.dialogs.PromtDialog({router:this.router, type: 'confirm', callbackCid:this.cid, title:title, confirmText:btn_txt});	
			}
			return false;
		},
		confirmRemoveCallback:function(obj) {
			log("remove",obj, this.currentDeal);
			var thisClass = this;
			if(obj.callbackCid==this.cid&&obj.type=='confirm'&&this.currentDeal) {
				if (obj.eventType=='confirm') {
					if(this.currentDeal.get('state')=='current') {
						this.currentDeal.save({status:'soldout'}, {success:function(model, response) {
							log('Deal soldout', model, response);
						}, error: function(model, response) { log('Deal soldout error', model, response);}});
					} else {
						this.currentDeal.destroy({data:this.currentDeal.id, success:function(model, response) {
							log("deleted", model, response);
					
						thisClass.router.trigger('dealEdited',{event:'dealDeleted'});
						thisClass.activity.closeWindow(this, false, true);
					
						}, error:function(model, response) { log("error delete: ", model, response); }});
					}
					
					
				} else {
					this.router.trigger('setFocus', {activity:this.activity, windowCid:this.cid});
				}
			}
		},
		setDealSoldout: function(id) {
			log("deal is sold out", id, this.collection.get(id));
		},
		showList:function() {
			this.changeView('deal-list');
			$('#btn_deal_back').hide();
		},
		changeTab: function(data) {
			var id = data.currentTarget.id;
			var tabId = "deals-tab-"+id.substr(4);
			if (tabId != this.tabId) {
				$("#"+this.tabId).hide();
				$("#"+tabId).show();
				$(this.windowId).find('.tab-link.selected').removeClass('selected');
				$("#"+id).addClass('selected');
				this.tabId = tabId;
			}
		},
		changeView: function(goto) {
			if (goto!=this.view) $(this.windowId+' .tab-block').css('overflow-y','visible');
			if (goto=='deal-details' && this.view=='deal-list') {
				$('#view-deal-list').hide("slide", {direction:"left", easing: "easeOutQuint"}, 400);
				$('#view-deal-details').show("slide", {direction:"right", easing: "easeOutQuint"}, 400);
				this.view = 'deal-details';
			} else if (goto=='deal-list' && this.view=='deal-details') {
				$('#view-deal-details').hide("slide", {direction:"right", easing: "easeOutQuint"}, 400);
				$('#view-deal-list').show("slide", {direction:"left", easing: "easeOutQuint"}, 400);
				this.view = 'deal-list';
			}
			if (goto!=this.view) $(this.windowId+' .tab-block').css('overflow-y','auto');
		},		
		cleanUp:function(){
			App.collections.deals.unbind('add',this.onDealAdded);
			App.collections.deals.unbind('change',this.onDealChanged);
			App.collections.deals.unbind('remove',this.updateContent);
		}
		
	});
});