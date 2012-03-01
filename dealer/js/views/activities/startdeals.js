define([
'views/activities/activity',
'views/startdeal',
],function(){
	App.views.activities.StartDeals = App.views.Activity.extend({
		el:'#activities',
		animationType: 'slideDown',
		menu_icon: '#btn_startdeals',
		initialize: function(){
			this.activityName = 'startdeals';
			_.bindAll(this,'templateFetched','handleNotReady','deactivateButton','activateButton','shopFetched');
			this.init();
			this.collection = App.collections.templates;
			App.views.startDeal = new App.views.StartDeal({router:this.router, activity: this});
			this.shopFetched('add',App.collections.shops);
			this.templateFetched('add',App.collections.templates);
			App.collections.templates.bind('change',this.templateFetched);
			App.collections.templates.bind('add',this.templateFetched);
			App.collections.templates.bind('reset',this.templateFetched);
			App.collections.shops.bind('change',this.shopFetched);
			App.collections.shops.bind('reset',this.shopFetched);
			App.collections.shops.bind('add',this.shopFetched);
		},
		deactivateButton: function(message){
			var menuIcon = $(this.menu_icon);
			if(!menuIcon.hasClass('disabled')){ 
				menuIcon.addClass('disabled');
			}
			menuIcon.attr('title',message);
			if (!this.tooltip) {
				menuIcon.tooltip({predelay:200, delay:200,tipClass:'menu-tooltip', offset: [-15, 0], onBeforeShow:function(d, e) {
						if (this.getTrigger().attr('title') != '') {
							this.getTip().text( this.getTrigger().attr('title') );
							this.getTrigger().removeAttr('title');
						}
				}})
				this.tooltip = menuIcon.data('tooltip');
			} 
		},
		closeAllWindows:function(){
			App.views.startDeal.collapse();
		},
		activateButton:function(){
			var menuIcon = $(this.menu_icon);
			if(menuIcon.hasClass('disabled')) menuIcon.removeClass('disabled');
			menuIcon.removeAttr('title');
			if (this.tooltip) {
				menuIcon.unbind('mouseover').unbind('mouseout');
				if (this.tooltip.getTip()) this.tooltip.getTip().remove();
				menuIcon.data('tooltip', null);
				this.tooltip = null;
			}
			
		},
		
		handleNotReady:function(){
			var message = '';
			/*
if(!this.hasOwnProperty('templateIsApproved') || !this.templateIsApproved) message = 'En af dine skabeloner skal godkendes før du kan starte deal';
			if(!this.hasOwnProperty('templateIsFetched') || !this.templateIsFetched) message = 'Du skal oprette en skabelon før du kan starte deals';
*/
			if(!this.templateIsApproved) message = 'En af dine skabeloner skal godkendes før du kan starte deal';
			if(!this.templateIsFetched) message = 'Du skal oprette en skabelon før du kan starte deals';
			if(!this.shopIsApproved) message = 'Din shop venter på at blive godkendt, så du kan ikke starte deals endnu';
			
			if(message) this.deactivateButton(message);
			else this.activateButton();
		},
		shopFetched:function(data,d){
			if(data && App.collections.shops.at(0)){
				var shop = App.collections.shops.at(0);
				this.shopIsFetched = true;	
				if( shop.get('approved') == 'approved'){
					this.shop_id = shop.get('id');
					this.shopIsApproved = true;	
				} else this.shopIsApproved = false;
			}
			this.handleNotReady();
		},
		templateFetched: function(data,d){
			if(data && this.collection.length>0){
				this.templateIsFetched = true;		
				var approved = this.collection.filter(function(item){ 
					return item.get('approved') == 'approved';
						
				});
				if(approved.length > 0){
					this.templateIsApproved = true;
					this.templates = approved;
					this.router.trigger('templatesUpdated',approved);
				} else {
					this.templateIsApproved = false;
					this.templates = null;	
				}
				
			}
			else {
				this.templateIsFetched = false;
			}
			this.handleNotReady();
				
		},
		onShow:function() {
			log("3");
			App.views.startDeal.setVerticalAlign();
		}
		
	});
});