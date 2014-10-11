/** react to shaking **/

window.ondevicemotion = function( data ) {
	
	var sum = 0;
	sum += Math.abs( data.acceleration.x );
	sum += Math.abs( data.acceleration.y );
	sum += Math.abs( data.acceleration.z );
	
	if( sum > 15 ) {
		var e = document.createEvent("HTMLEvents");
		e.initEvent("shake", true, true);
		document.dispatchEvent( e );
	}
}

pedometer = (tizen && tizen.humanactivitymonitor) ||
(window.webapis && window.webapis.motion) || null;

pedometer.start( 'PEDOMETER',
		function onSuccess(data) {
			var e = document.createEvent("HTMLEvents");
			e.initEvent("pedometer", true, true);
			e.data = data;
			document.dispatchEvent( e );
		}
);