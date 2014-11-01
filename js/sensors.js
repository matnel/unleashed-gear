(function() {

// shaking
	
window.ondevicemotion = function( data ) {
	
	var sum = 0;
	sum += Math.abs( data.acceleration.x );
	sum += Math.abs( data.acceleration.y );
	sum += Math.abs( data.acceleration.z );
	
	if( sum > 45 ) {
		var e = document.createEvent("HTMLEvents");
		e.initEvent("shake", true, true);
		document.dispatchEvent( e );
	}
}

// step counters

function onSuccess(data) {
	var e = document.createEvent("HTMLEvents");
	e.initEvent("pedometer", true, true);
	e.data = data;
	document.dispatchEvent( e );
}


webapis.motion.start("PEDOMETER", onSuccess );
webapis.motion.getMotionInfo("PEDOMETER", onSuccess );

})()