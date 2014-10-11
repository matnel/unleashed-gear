$().ready( function() {
	
	function runEvery( minutes ) {
		var app = tizen.application.getCurrentApplication();
		app = app.appInfo.id; 
		
		var time = 10 * tizen.alarm.PERIOD_MINUTE;
		time = new tizen.AlarmRelative( time );
		
		tizen.alarm.add( time, app );
	}
	
	runEvery( 10 );
	
} );