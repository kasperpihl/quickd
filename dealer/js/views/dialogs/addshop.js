define([
'text!templates/dialogs/addshop.html',
'views/dialogs/dialog',
'async!http://maps.googleapis.com/maps/api/js?sensor=false'
],function(template){
	App.views.dialogs.AddShop = Backbone.View.extend({
		el: "body",
		initialize:function() {
			_.bindAll(this,'saveShop','closeBubble','openBubble','success','doContinue');
			this.activity = "welcome_greeting";
			this.router = this.options.router;

			this.render();
		},
		render:function(){
			var thisClass = this;
			this.id = '#welcome_add_shop';
			$(template).hide().appendTo("#"+this.activity);
			this.form = $('#consumer-signup');
			this.form.formValidate({
				tooltipOffset: 15,
				rules: {
				 	shop_name: "required",
				 	shop_address: "required"
				}
			});
		},
		events:{
			'click #btn_confirm_shop': 	'confirmShop',
			'keypress #shop_name, #shop_address': 'doContinue',
			'click #btn_reenter_shop': 'doGoBack',
			'click #continue_button': 'doContinue'
		},
		openBubble:function(bottomX, bottomY){
			var thisClass = this;
			//require(['http://maps.googleapis.com/maps/api/js?sensor=false&callback=thisClass.GMapInitialize']);
			if (!bottomX) bottomX = $(document).width()/2;
			if (!bottomY) bottomY = $(document).height()/2;
			//var top = bottomY-$(this.id).outerHeight();
			$("#"+this.activity).css({height: $("#"+this.activity).height()});
			var bottom = $("#"+this.activity).outerHeight() - bottomY;
			var left = bottomX - $(this.id).outerWidth()/2;
			var thisClass=this;
			$("#workspace").createMask();
			
			$(this.id).css({position:'absolute', bottom:bottom+'px', left:left+'px'}).fadeIn(400, function() {
				$('html').click(function(e) { 
					var $clicked = $(e.target); 
					if (!($clicked.is(thisClass.id) || $clicked.parents().is(thisClass.id))) { 
					  	thisClass.closeBubble();
					} 
				});
				$('#shop_name').focus();
				thisClass.geocoderInit();
				thisClass.bubbleShown=true;
			});
		},
		doNothing:function(obj) {
			obj.stopPropagation();
		},
		closeBubble:function() {
			if (this.bubbleShown) {
				this.bubbleShown = false;
				$('html').off('click');
				$(this.id).off('click');
				$(this.id).fadeOut(800);
				$('#workspace').removeMask();
				//$('#BODY-mask').fadeOut(400, function() { $(this).remove(); });
			}
		},
		success:function(m,data){ 
			log('result',m,data)
			if(data.success){
				App.collections.shops.add(m);
			} 
			else {
				log('else',m,data);
				thisClass.router.showError("Der opstod en fejl", "Din butik blev ikke oprettet i systemet<br />Fejlmeddelelse: "+data.error);
			}
			
		},
		doContinue:function(e) {
			var thisClass=this;

			if((!e || !e.keyCode || e.keyCode == 13) && this.form.valid() ){
				$('#add_shop_fields input:focus').blur();
				
				var response=function(e){
					if (e.length>0) {
						$("#shop_lat").val(e[0].latitude);
						$("#shop_long").val(e[0].longitude);
						thisClass.showConfirm();
					}
					//console.log(e);
				};
				thisClass.getAddress({term:$('#shop_address').val()}, response, 1);
			}
		
		},
		doGoBack:function() {
			$('#add_shop_fields').slideDown();
			$('#confirm_map').slideUp();
			$('#shop_address').focus();
		},
		showConfirm:function() {
			
				
			var lat = $("#shop_lat").val();
			var lng = $("#shop_long").val();
			if (lat!="" && lng!="") {
				if(!this.map){
					
					var option = {
						zoom: 17,
						streetViewControl:false,
						zoomControl:false,
						mapTypeControl:false,
						mapTypeId: google.maps.MapTypeId.HYBRID
					};
					this.marker = new google.maps.Marker({ draggable: false });
					this.map = new google.maps.Map(document.getElementById("map_canvas"), option);
					this.marker.setMap(this.map);
				}
				
				var location = new google.maps.LatLng(lat, lng);
				this.marker.setPosition(location);
				this.map.setCenter(location);
				$('#confirm_shop_name').html($('#shop_name').val());
				
				$('#add_shop_fields').slideUp();
				$('#confirm_map').slideDown();
			} else {
				$('#shop_address').parents('.field').append("<div class='errorTip'>Kunne ikke finde den indtastede adresse</div>");
				$('#shop_address').focus();
			}
			
		},
		confirmShop:function(data){
			var lat = $('#shop_lat').val();
			var long = $('#shop_long').val();
			var name = $('#shop_name').val();
			var address = $('#shop_address').val();
			if(!lat || !long) return alert('ingen koordinater');
			if(!name) return alert('Indtast navnet på butikken');
			this.saveShop(name,address,lat,long);
			this.closeBubble();
		},
		saveShop:function(name,address,lat,long){
			var shop = new App.models.Shop();
			var thisClass = this;
			shop.save({lat:lat,long:long,name:name,address:address},{success:this.success, 
					error:function(m,data){
						log('saveShop error', m, data);
						thisClass.router.showError("Der opstod en fejl", "Din butik blev ikke oprettet i systemet<br />Fejlmeddelelse: "+data.error);
					} 
			});
		},
		getAddress: function(request, response,count) {
			if (!this.geocoder);
			if (!count) count=3;
			var term = request.term + ' , Denmark';
		      	
			this.geocoder.geocode( {'address': term }, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) { 
				}
					var i = 0;           		
				  response($.map(results, function(item) {
						i++;
						if(i>count) return;
						return {
						  label: item.formatted_address,
						  value: item.formatted_address,
						  postal_code: item.postal_code,
						  latitude: item.geometry.location.lat(),
						  longitude: item.geometry.location.lng()
						}
				  }));
				
			});
		},
		geocoderInit: function(){
		  var thisClass = this;
		  if (!google) setTimeout(thisClass.geocoderInit,300);
		  
		  //GEOCODER
		  if (!this.geocoder) this.geocoder = new google.maps.Geocoder();

		  $("#shop_address").autocomplete({
		      minLength: 4,
				  appendTo: "#welcome_add_shop",
				  //This bit uses the geocoder to fetch address values
		      source: function(request, response) {thisClass.getAddress(request, response)},
		      //This bit is executed upon selection of an address
		      select: function(event, ui) {
		        log("clicked?", event, ui);
		        $("#shop_lat").val(ui.item.latitude);
		        $("#shop_long").val(ui.item.longitude);
		        $('#shop_address').val(ui.item.label);
		        thisClass.doContinue();
		      }
		  	});
		}

		
	});
});