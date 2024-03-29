define([
'common/collections/collections',
'common/models/models',
'views/dashboard',
'views/dialogs/promtDialog'
],function(){
	App.routers.Dashboard = Backbone.Router.extend({
		routes: {
			'oversigt':							'openOverview',
			'oversigt/:path':				'openOverview',
			'oversigt/:path/:id':		'openOverview',
			'skabeloner':						'openTemplates',
			'skabeloner/:path':			'openTemplates',
			'administration':				'openAdministration',
			'administration/:path':	'openAdministration',
			'start':								'openStartDeals',
			'start/:id':						'openStartDeals',
			'start/:id/:type': 			'openStartDeals',
			'hjem':									'openHomeView',
			'*index':								'indexing' 
		},
		start: function(options){
			this.route = '';
			var thisClass = this;
			if(!App.models.shopowner && shopowner) App.models.shopowner = new App.models.Shopowner(shopowner.dealer);
			_.bindAll(this,'getChanges','changes', 'retryConnection', 'dialogHandle', 'handleEsc');
			App.collections.feedback = new App.collections.Feedback();
			App.collections.templates = new App.collections.Templates();
			App.collections.shops = new App.collections.Shops();
			App.collections.deals = new App.collections.Deals();
			App.collections.images = new App.collections.Images();
			if(options.stuff) this.setStuff(options.stuff);
			App.views.dashboard = new App.views.Dashboard({router:this});
			this.errorCount = 0;
			this.networkErrorDialog = new App.views.dialogs.PromtDialog({router:this, type: 'promt', callbackCid:'dashboard-router', 
				openOnCreate: false, closable: false, destroyOnClose: false,
				title:'Ingen forbindelse til serveren', 
				msg:'Vi kan i øjeblikket ikke få forbindelse til vores server. Tjek din internetforbindelse og prøv ingen', 
				confirmText:'Prøv igen'
			});
			this.bind('promtCallback:dashboard-router', this.retryConnection);
			this.bind('dialogAction',this.dialogHandle);
			this.dialogs = {};
			$(document).keyup(function(e) {
			  if (e.keyCode == 27) thisClass.handleEsc();
			});
			this.getChanges();
			//log("started", options)
			this.started = true;
			//setTimeout(this.getChanges,10000);
		},
		indexing:function(){
			log("indexing");
			if (this.started) {
				this.navigate('hjem',{trigger:true});
			}
		},
		openHomeView:function(){
			App.views.dashboard.changeActivity({activity:'welcome'});
		},	
		openStartDeals:function(param, type){
			var options = {activity:'startdeals',route:lang.urls.startdeals,isRouted:true};
			if(param){
				options.route = lang.urls.startdeals + '/' + param;
				options.window = 'startWithTemplate';
				options.id = param;
			}
			else {
				options.isParentRoute = true;
			}
			if(type){
				options.type = type;
				options.route += '/'+type;
			}
			App.views.dashboard.changeActivity(options);
		},
		openTemplates:function(param){
			var options = {activity: 'templates',route:lang.urls.templates,isRouted:true};
			if(param){ 
				options.route = lang.urls.templates + '/' +param;
			}
			if(param == 'tilfoej'){
				options.window = 'addTemplate';
			}
			else if(param){
				options.window = 'viewTemplate';
				options.id = param;
			}
			else{
				options.isParentRoute = true;
			}
			App.views.dashboard.changeActivity(options);
		},
		openOverview:function(param,id){
			var options = {activity: 'overview',route:lang.urls.overview,isRouted:true};
			if(param){
				options.route = lang.urls.overview + '/' + param;
				options.window = param;
			}
			else {
				options.isParentRoute = true;
			}
			if(id){
				options.id = id;
				options.route += '/'+id;
			}
			
			App.views.dashboard.changeActivity(options);
		},
		openAdministration:function(param){
			var options = {activity: 'administration',route:lang.urls.administration,isRouted:true};
			if(param){
				options.route = lang.urls.administration + '/' + param;
				options.window = param;
			}
			else {
				options.isParentRoute = true;
			}
			App.views.dashboard.changeActivity(options);
		},
		dialogHandle:function(option) {
			if (option.action == 'opened') this.dialogs[option.level] = option;
			else if(option.action == 'closed' && this.dialogs[option.level] && this.dialogs[option.level].cid == option.cid ) delete this.dialogs[option.level];
		},
		handleEsc:function() {
			if (!_.isEmpty(this.dialogs)) {
				var shown = _.max(this.dialogs, function(dialog) { return dialog.level; });
				shown.action = 'doClose';
				this.trigger('dialogAction',shown);
			} else if (this.activity) {
				App.views.dashboard.changeActivity({activity:this.activity, route:lang.urls[this.activity],isRouted:true, isParentRoute:true});
			}
		},
		showError:function(title, msg) {
			title = title ? title : 'Der op stod en fejl';
			msg = msg ? msg : '';
			if (!this.errorDialog) this.errorDialog = new App.views.dialogs.PromtDialog({router:this, type: 'promt', callbackCid:'error-msg-promt', 
				openOnCreate: true, closable: true, destroyOnClose: false, classes: 'error-promt',
				title:title, 
				msg:msg, 
				confirmText:'Okay'
			});
			else {
				this.errorDialog.setText(title, msg);
				this.errorDialog.openDialog();
			}
		},
		retryConnection:function(obj) {
			if (this.networkErrorShown) this.networkErrorShown = false;
			this.getChanges(true, true);
		},
		getChanges: function(singleCall){
			var thisClass = this,
			cindex = (localStorage.getItem('cindex') != 'undefined') ? localStorage.getItem('cindex') : 0,
			csince = (localStorage.getItem('csince') != 'undefined') ? localStorage.getItem('csince') : 0,
			doOnError = function() {
				if (thisClass.errorCount>=1 && thisClass.networkErrorDialog && !thisClass.networkErrorShown) {
					thisClass.networkErrorDialog.openDialog();
					thisClass.networkErrorShown = true;
				}
				thisClass.errorCount++; 
			};

			$.ajax({
		        type: "GET",
		        url: ROOT_URL+"ajax/changes.php",
		        data: 'cindex='+cindex+'&csince='+csince,
		        async: true,
		        cache: false,
		        timeout:5000,
		        success: function(result) {
					//log('success', result);

					result = $.parseJSON(result);
					if (result.hasOwnProperty('success') && result.success=='false' && result.error=='error_database') doOnError();
					else thisClass.changes(result);
					if (!singleCall) setTimeout(thisClass.getChanges,3000);
		        },
		        error: function(XMLHttpRequest, textStatus, errorThrown) {
							log('Error changes',XMLHttpRequest,textStatus,errorThrown);
							doOnError();	
							if (!singleCall) setTimeout(thisClass.getChanges,3000);
		        }
			}, 'json');
		},
		setStuff:function(stuff){
			_.each(stuff,function(item,i){
				var document = item.value;
				
				if(document.hasOwnProperty('type') && document.type == 'deal'){
					var model = new App.models.Deal(document);
					App.collections.deals.add(model);
				}
				if(document.hasOwnProperty('historySince')) localStorage.setItem('cindex',parseInt(document.historySince,10));
				if(document.hasOwnProperty('images')){
					_.each(document.images,function(image,i){
						var model = new App.models.Image(image);
						App.collections.images.add(model);
					});
				}
				if(document.hasOwnProperty('shops')){
					_.each(document.shops,function(shop,i){
						var model = new App.models.Shop(shop);
						App.collections.shops.add(model);
					});
				}
				if(document.hasOwnProperty('templates')){
					_.each(document.templates,function(template,i){
						var model = new App.models.Template(template);
						App.collections.templates.add(model);
					});
				}
				if(document.hasOwnProperty('feedback')){
					_.each(document.feedback,function(feedback,i){
						var model = new App.models.Feedback(feedback);
						App.collections.feedback.add(model);
					});
				}
			});
		},
		changes:function(result){
			//log('result from changes',result);
			
			if (this.networkErrorShown) this.networkErrorDialog.closeDialog();
			this.errorCount = 0;
			if(result.hasOwnProperty('success') && result.success == 'false') return;
			//log('result from changes',result);
			if(result.hasOwnProperty('csince')) localStorage.setItem('csince',result.csince);
			if(result.hasOwnProperty('cindex')) localStorage.setItem('cindex',result.cindex);

			
			if(!result.data) return;
			
			var results = result.data;
			if(results.length > 0){
				var resultHandling = {};
				for(var i = results.length-1 ; i >= 0  ; i--){
					var doc = results[i].value;
					var model,newModel,collection,route;
					switch(doc.type){
						case 'template':
							route = lang.urls.templates + '/' + doc.id;
							newModel = App.models.Template;
							collection = App.collections.templates;
							model = collection.get(doc.id);
						break;
						case 'shop':
							route = lang.urls.administrationShop;
							newModel = App.models.Shop;
							collection = App.collections.shops;
							model = collection.get(doc.id);
						break;
						case 'feedback':
							route = lang.urls.overviewFeedback + '/' + doc.id;
							if(doc.hasOwnProperty('hours') && parseInt(doc.hours,10) > 0) App.models.shopowner.fetch();
							newModel = App.models.Feedback;
							collection = App.collections.feedback;
							model = collection.get(doc.id);
						break;
						case 'deal':
							route = lang.urls.overviewDeals + '/' + doc.id;
							newModel = App.models.Deal;
							collection = App.collections.deals;
							model = collection.get(doc.id);
						break;
						default:
							continue;
					}
					if(model && (doc.rev > model.get('rev'))){
						model.fetch({success:function(m,data){ log('response fra fetch1',m,data); },error:function(d,d2){ log(d,d2); }});
						App.views.notifications.changesHandling(doc,route);
					}
					if(model === undefined){
						log('fetchedU',doc.type,doc.id);
						model = new newModel({id:doc.id});

						model.fetch({success:function(d,data){ log('response fra fetch2',d,data); if(data.success == 'true'){  collection.add(d); App.views.notifications.changesHandling(doc,route); } },error:function(d,d2){ log(d,d2); }});
						
					}
				}
			}
		}
	});
});