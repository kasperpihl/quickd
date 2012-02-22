var got = false;
function getDeals(coords){
	if(got) return; 
	var lat = coords.latitude;
	var long = coords.longitude;
	$.get('ajax/deals.php',{lat:lat,long:long},function(data){
		if(data.success){
			window.myData = data.data;
			$.each(data.data,function(item,i){
				$('#deallistview').append(styleDeal(i,item));
				
			});
			$('#deallistview').listview('refresh');
			got = true;
		}
		
	},'json');
}

function listenPosition(){
	console.dir(navigator);
	if(navigator.geolocation){
		    var position = navigator.geolocation.watchPosition(
			function(pos){
				if(pos.coords.accuracy < 100){
					getDeals(pos.coords);
				}
			},
			function(error){
				console.log('fejl');
				console.dir(error);
			}
		);
	}
	else{
		alert('Denne app er lokationsbaseret, brug venligst en telefon med GPS');
	}
}

function styleDeal(obj,index){
	var html = '<li>';
	html += '<a href="deal.php">';
	html += '<img src="http://lorempixum.com/80/80/food/' + index + '"/>';
	html += '<h3>' + obj.title + '</h3>';
	html += '<p>Før: ' + obj.orig_price + ',- / Nu: ' + obj.deal_price + ',-</p>';
	html += '<p>Ca. 2 timer tilbage</p>';
	html += '</a>';
	html += '</li>';
	
	return html;
}

$(document).bind("mobileinit", function(){
	listenPosition();
});