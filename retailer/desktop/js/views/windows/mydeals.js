define([
'views/windows/window'
],function(){

	App.views.windows.MyDeals = App.views.Window.extend({
		el: '#activity_overview',
		depth: 2,
		deals: {
			current: [],
			regular: [],
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
			var data = this.updateContent(false);
			var tpl = 'text!templates/component/viewDeal.html';
	    require([tpl],function(tmp){
	      thisClass.dealViewHtml = tmp;
	      if (thisClass.currentDeal)
	      	data.dealView = _.template(tmp, {data:thisClass.currentDeal.toJSON()});
	      thisClass.createWindow(true, data);
	    });
			
			App.collections.deals.bind('add',this.onDealAdded);
			App.collections.deals.bind('change',this.onDealChanged);
			App.collections.deals.bind('remove',this.updateContent);
			this.router.bind('promtCallback:'+this.cid, this.confirmRemoveCallback);
		},
		updateContent:function(doSetContent) {
			var thisClass = this;
			var data = this.sortDeals();
			data.tabId = this.tabId;
			data.view = this.view;
			data.currentDeal = this.currentDeal;
			if (this.dealViewHtml&&this.currentDeal) data.dealView = _.template(this.dealViewHtml, {data:this.currentDeal.toJSON()});

			if (doSetContent) this.setContent(data);
			else return data;
		},
		onDealChanged:function(data, obj) {
			if (data.hasChanged('state')) {
				this.stateChanged(data.get('id'));
			} else if(data.hasChanged('status') && data.get('status')=='soldout') {
				$('#deal-'+data.get('id')).find('.soldout').show();
				if (this.currentDeal && this.currentDeal.get('id') == data.get('id')) {
					var $view = $('#view-' + this.currentDeal.get('id'));
					log($view);
					$view.find('.remove-btn').hide().end().find('.soldout').show();
				}
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
				regular: [],
				planned: [],
				ended: []
			};
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
						var block;
						if (thisClass.deals[preState].length===1) {
							block = $('#deals-'+preState).find('.empty-block');
							if (block.is(':visible')) block.fadeIn('slow');
							else block.css({display:'block'});
						}
						if (thisClass.deals[state].length===0) {
							block = $('#deals-'+state).find('.empty-block');
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
				$('#view-deal-details').html(_.template(this.dealViewHtml, {data:this.currentDeal.toJSON()}));
				this.changeView('deal-details');
			}
		},
		showList:function() {
			this.currentDeal = null;
			this.changeView('deal-list');
			$('#btn_deal_back').hide();
		},
		removeDeal:function(){
			if (this.currentDeal) {
				var time = parseInt(new Date().getTime()/1000,10);
				var title;
				if (this.state!='current') {
					title = 'Er du sikker på du ønsker at slette denne deal?',
							btn_txt = 'Slet';
				} else {
					title = 'Er du sikker på du ønsker at melde denne deal udsolgt?',
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
						}, error: function(model, response) { 
							log('Deal soldout error', model, response);
							thisClass.router.showError("Der opstod en fejl", "Det lykkedes ikke at melde din deal udsolgt<br />Fejlmeddelelse: "+response.error); 
						}});
					} else {
						this.currentDeal.destroy({data:this.currentDeal.id, success:function(model, response) {
							log("deleted", model, response);
							thisClass.router.trigger('dealEdited',{event:'dealDeleted'});
							thisClass.viewList();
						}, error:function(model, response) { 
							log("error delete: ", model, response); 
							thisClass.router.showError("Der opstod en fejl", "Det lykkedes ikke at slette din deal<br />Fejlmeddelelse: "+response.error); 
						}});
					}
					
					
				} else {
					this.router.trigger('setFocus', {activity:this.activity, windowCid:this.cid});
				}
			}
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