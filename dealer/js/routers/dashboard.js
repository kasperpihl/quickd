define([
'collections/collections',
'models/models',
'views/dashboard',
'views/dialogs/promtDialog'
],function(){
	App.routers.Dashboard = Backbone.Router.extend({
		routes: {
			'oversigt':				'openOverview',
			'oversigt/:path':		'openOverview',
			'oversigt/:path/:id':	'openOverview',
			'skabeloner':			'openTemplates',
			'skabeloner/:path':		'openTemplates',
			'administration':		'openAdministration',
			'administration/:path':	'openAdministration',
			'start':				'openStartDeals',
			'start/:id':			'openStartDeals',
			'hjem':					'openHomeView'
		},
		start: function(options){
			this.route;
			if(!App.models.shopowner && shopowner) App.models.shopowner = new App.models.Shopowner(shopowner.dealer);
			_.bindAll(this,'getChanges','changes', 'retryConnection');
			App.collections.feedback = new App.collections.Feedback();
			App.collections.templates = new App.collections.Templates();
			App.collections.shops = new App.collections.Shops();
			App.collections.deals = new App.collections.Deals();
			App.collections.images = new App.collections.Images();
			if(options.stuff) this.setStuff(options.stuff);
			App.views.dashboard = new App.views.Dashboard({router:this});

			this.networkErrorDialog = new App.views.dialogs.PromtDialog({router:this, type: 'promt', callbackCid:'dashboard-router', 
				openOnCreate: false, closable: false, destroyOnClose: false,
				title:'Ingen forbindelse til serveren', 
				msg:'Vi kan i øjeblikket ikke få forbindelse til vores server. Tjek din internetforbindelse og prøv ingen', 
				confirmText:'Prøv igen'
			});
			this.bind('promtCallback:dashboard-router', this.retryConnection);
			this.getChanges();
			this.on('route:*index', this.indexing);
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
		openStartDeals:function(param){
			var options = {activity:'startdeals',route:lang.urls.startdeals,isRouted:true};
			if(param){
				options.route = lang.urls.startdeals + '/' + param;
				options.window = 'startWithTemplate';
				options.id = param;
			}
			else {
				options.isParentRoute = true;
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
		retryConnection:function(obj) {
			if (this.networkErrorShown) this.networkErrorShown = false;
			this.getChanges(true, true);
		},
		getChanges: function(singleCall){
			var thisClass = this,
					cindex = (localStorage.getItem('cindex') != 'undefined') ? localStorage.getItem('cindex') : 0,
					csince = (localStorage.getItem('csince') != 'undefined') ? localStorage.getItem('csince') : 0,
					doOnError = function() {
						log('doOnError');
						if (thisClass.networkErrorDialog && !thisClass.networkErrorShown) {
								thisClass.networkErrorDialog.openDialog();
								thisClass.networkErrorShown = true;
						} 
		      };

		  //if (window.navigator.onLine) {
				$.ajax({
		        type: "GET",
		        url: ROOT_URL+"ajax/changes.php",
		        data: 'cindex='+cindex+'&csince='+csince,
		        async: true,
		        cache: false,
		        timeout:4000,
		        success: function(result) {
		        	log('success', result)
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
		  /*} else {
		  	doOnError(showError);
		  	if (!singleCall) setTimeout(thisClass.getChanges,3000);
		  }	*/
		},
		setStuff:function(stuff){
			_.each(stuff,function(item,i){
				var document = item.value;
				
				if(document.hasOwnProperty('type') && document.type == 'deal'){
					var model = new App.models.Deal(document);
					App.collections.deals.add(model);
				}
				if(document.hasOwnProperty('historySince')) localStorage.setItem('cindex',parseInt(document.historySince));
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
			if(result.hasOwnProperty('success') && result.success == 'false') return;

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
							log(doc);
							if(doc.hasOwnProperty('hours') && parseInt(doc.hours) > 0) App.models.shopowner.fetch();
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
						break;
					}
					if(model && (doc.rev > model.get('rev'))){
						//log('fetched',doc.type,doc.id);
						model.fetch({success:function(d,mod){ log('response fra fetch1',d,mod); },error:function(d,d2){ log(d,d2); }});
						App.views.notifications.changesHandling(doc.type,doc.action,route);
					} 
					if(model === undefined){
						log('fetchedU',doc.type,doc.id);
						model = new newModel({id:doc.id});

						model.fetch({success:function(d,data){ log('response fra fetch2',d,data); if(data.success == 'true'){  collection.add(d); App.views.notifications.changesHandling(doc,route); } },error:function(d,d2){ log(d,d2); }});
						
					}
					
				}
			}
		},
		templates: function(){
			
		},
		deals: function(){
		
		}
	});
});