$().ready( function() {
	
	var app = tizen.application.getCurrentApplication();
	app = app.appInfo.id; 
	
	var time = 10 * tizen.alarm.PERIOD_MINUTE;
	time = new tizen.AlarmRelative( time );
	
	console.log( app );
	
	tizen.alarm.add( time, app );
	
} );