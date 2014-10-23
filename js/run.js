$().ready( function() {
	
	function runEvery( minutes ) {
		var app = tizen.application.getCurrentApplication();
		app = app.appInfo.id; 
		
		var time = minutes * tizen.alarm.PERIOD_MINUTE;
		time = new tizen.AlarmRelative( time );
		
		tizen.alarm.add( time, app );
	}
	
	runEvery( 10 );
	
	window.close = function() {
		var app = tizen.application.getCurrentApplication();
		app.exit();
	}
	
} );