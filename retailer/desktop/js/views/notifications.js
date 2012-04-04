var lang = {
	urls:{
		'templates': 			'skabeloner',
		'overview':				'oversigt',
		'startdeals':			'start',
		'administration':		'administration',
		'administrationUser':	'administration/bruger',
		'administrationShop':	'administration/butik',
		'templatesAdd':			'skabeloner/tilfoej',
		'overviewDeals':		'oversigt/deals',
		'overviewFeedback':		'oversigt/feedback'	
	},
	ui: {
		templates:{
			
		}
	},
	notifications: {
		feedback: {
			response:	'Der er kommet svar på din feedback!',
			sent: 		'Din feedback er sendt, og vi svarer så hurtigt som muligt'
		},
		account: {
			edited:		'Dine indstillinger er blevet ændret'
		},
		deal:{
			planned: 	'Din deal er nu planlagt. Held og lykke!',
			started:	'En deal er lige startet. Klik for at se hvilken.',
			ended:		'En deal er netop afsluttet. Klik for at se hvilken.',
			deleted:  'En deal er blevet slettet',
			soldout: 	'En deal er blevet meldt udsolgt'
		},
		shop:{
			created: 	'Din butik er blevet oprettet og afventer nu godkendelse fra os! Imens kan du jo gå igang med at oprette dine skabeloner',
			edited: 	'Dine ændringer er blevet gemt',
			approved: 	'Din butik er blevet godkendt, jubiii!',
			declined: 	'Din butik er desværre afslået'
		},
		template: {
			created:		'Din skabelon er blevet tilføjet og afventer nu godkendelse. Vi skynder os!',
			edited: 	  'Din skabelon er blevet ændret og afventer nu igen godkendelse fra os',
			deleted: 	  'Din skabelon er blevet slettet',
			approved: 	'Din skabelon er blevet godkendt! God fornøjelse',
			declined: 	'Din skabelon er desværre blevet afvist. Skynd dig ind og se hvorfor'
		}
	}
}
define([
'text!templates/notifications.html'
],function(template){
	App.views.Notifications = Backbone.View.extend({
		el: '#workspace',
		initialize: function(){
			_.bindAll(this,'notify','eventHandling','changesHandling','changeRoute', 'dealChanged', 'dealAdded');
			this.router = this.options.router;
			var thisClass = this;
			this.object = '#notifications';
			this.render();
			this.router.bind('notification',this.notify);
			this.router.bind('dealEdited',this.eventHandling);
			this.router.bind('shopCreated',this.eventHandling);
			this.router.bind('templateEdited',this.eventHandling);
			this.router.bind('settingsEdited',this.eventHandling);
			App.collections.deals.bind('change',this.dealChanged);
		},
		eventHandling:function(event,options){
			if(!event && !event.event) return false;
			var message;
			switch(event.event){
				case 'deal_started':
					message = lang.notifications.deal.started;
				break;
				case 'deal_planned':
					message = lang.notifications.deal.planned;
				break;
				case 'deal_deleted':
					message = lang.notifications.deal.deleted;
				break;
				case 'shopCreated':
					message = lang.notifications.shop.created;
				break;
				case 'templateEdited':
					message = lang.notifications.template.edited;
				break;
				case 'templateDeleted':
					message = lang.notifications.template.deleted;
				break;
				case 'settingsEdited':
					message = lang.notifications.account.edited;
				break;
			}
			if (message) this.notify('fast',message);
		},
		dealChanged:function(model) {
			//log("dealChanged", model, model.hasChanged('state'));
			if (model.hasChanged('state')||model.hasChanged('status')) {
				var message = null;
				if (model.get('status') == 'soldout') message = lang.notifications.deal.soldout;
				else if (model.get('state')=='current') message = lang.notifications.deal.started;
				else if (model.get('state') == 'ended') message = lang.notifications.deal.ended;
				
				var route = lang.urls.overviewDeals+'/'+model.get('id');
				if (message) this.notify('fast', message, route);
			}
		},
		dealAdded:function(t, o) {
			//log("dealAdded", t, o);
		},
		changesHandling:function(doc,route){
			log("changes", doc, route);
			var message;
			message = lang.notifications[doc.type]&&lang.notifications[doc.type][doc.action]?lang.notifications[doc.type][doc.action]:'';
			this.notify('fast',message,route);
		},
		changeRoute: function(route){
			//log(route);
			this.router.navigate(route,{trigger:true});
		},
		notify:function(type,message,route){
			if (!message) return;
			var duration,sticky;
			if(type == 'fast') duration = 5000;
			else if(type == 'slow') duration = 30000;
			else duration = Infinity;
			if(type == 'sticky') sticky = true;
			var thisClass=this;
			setTimeout(function(){
				$.meow({message:message,closeable:false,duration:duration,sticky:sticky,route:route,callback:thisClass.changeRoute});
			},500);
		},
		render: function(show){
			$(template).appendTo(this.el);
			
			
		}
		
	});
});