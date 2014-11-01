$().ready( function() {
	
	// remove all existing
	$.each( tizen.alarm.getAll() , function(i, alarm) {
		try {
			tizen.alarm.remove( alarm.id );
		} catch(e) {}
	} );
	
	function runEvery( minutes ) {
		var app = tizen.application.getCurrentApplication();
		app = app.appInfo.id; 
		
		var time = minutes * tizen.alarm.PERIOD_MINUTE;
		time = new tizen.AlarmRelative( time );
		
		tizen.alarm.add( time, app );
	}
	
	runEvery( 1 );
	
	window.close = function() {
		var app = tizen.application.getCurrentApplication();
		app.exit();
	}
	
} );