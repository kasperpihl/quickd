window.log=function(){
	log.history=log.history || [];
	log.history.push(arguments);
	if(this.console){
		arguments.callee=arguments.callee.caller;
		var a=[].slice.call(arguments);
		(typeof console.log==="object" ? log.apply.call(console.log,console,a) : console.log.apply(console,a))
	}
};
function validate(email) {
   var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   return reg.test(email);
}
/**
	Initializing FB class to facebook connect
*/
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/da_DK/all.js";
  fjs.parentNode.insertBefore(js, fjs);

  window.fbAsyncInit = function() {
      FB.init({
        appId      : '286675801401479',
        status     : true, 
        cookie     : true,
        xfbml      : true,
        oauth      : true
      });
    };
}(document, 'script', 'facebook-jssdk'));
function priceIt(price){
	return price + 'Dkr';
}
function humanReadableTime(stamp){
	var now = parseInt(new Date().getTime()/1000,10);
	var time = parseInt(stamp,10) - now;
	var hours, minutes, seconds;
	seconds = time % 60;
	minutes = Math.floor(time / 60) % 60;
	hours = Math.floor(time / 3600);
	if(time < 60) return seconds + ' sekunder tilbage';
	if(time < 600) return minutes + ' minutter tilbage';
	if(time < 2700) return 'Over ' + (parseInt(minutes/10,10)*10) + ' minutter tilbage';
	if(time < 3600) return 'Næsten 1 time tilbage';
	else return (minutes < 45 ? 'Over ' + hours : 'Næsten ' + (hours+1))  + ' ' + (time < 6300 ? 'time' : 'timer') + ' tilbage';

}
/**
 * Convert metre value to human readable format
 *
 * @param  {string/int} distance the distrance in metres
 *
 * @return {string}
 */
function humanReadableDistance(distance) {
	var	dist	= parseInt(distance, 10),
		roundTo	= getRoundToVal(dist),
		unit	= 'm';

	dist = roundToNearest(dist, roundTo);
	if (dist >= 1000) 
	{
		dist = dist / 1000;
		unit = 'km';
	}

	return dist + unit;
}

/**
 * Returns 'awesome' if discount is greater than 50%. Otherwise ''
 * @return {string}
 */
function isAwesomeDeal(discount) {
	return (parseInt(discount, 10) >= 60)? 'awesome' : '';
}

/**
 * [getRoundToVal description]
 * @param  {[type]} val    [description]
 * @param  {[type]} ranges [description]
 * @return {[type]}
 */
function getRoundToVal(val, ranges) {
	var dist = parseInt(val, 10);

	if (dist < 100) return 1; // Less than 100 metres: Don't round.
	else if (dist >= 100 && dist < 500) return 25; // Between 100 and 500 metres: Round to neares 25 metres.
	else if (dist >= 500 && dist < 1000) return 50; // Between 0.5 and 1 km: Round to nearest 50 metres.
	else if (dist >= 1000 && dist < 5000) return 100; // Between 1 and 3 km: Round to nearest 100 metres.
	else if (dist > 5000) return 1000; // More than 3 km: Round to neares kilometre.

	log(dist);

	return false;
}

function roundToNearest(val, roundTo) {
	return Math.round(val / roundTo) * roundTo; // For instance: roundToNearest(65, 100) would return 100.
}
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}
function distance(lat1,lon1,lat2,lon2){
	lat1 = parseFloat(lat1);
	lat2 = parseFloat(lat2);
	lon1 = parseFloat(lon1);
	lon2 = parseFloat(lon2);
	var R = 6371; // Radius of the earth in km
	var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
	var dLon = (lon2-lon1).toRad(); 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c * 1000; // Distance in m
	return parseInt(d,10);
}
