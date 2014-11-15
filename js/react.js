/**
 * @jsx React.DOM
 */
var Avatar = React.createClass({
	
	getDefaultProps: function() {
		
		var ret = {};
		
		ret.lenght = 13;
		ret.initial = 0;
		
		return ret;
	},
	
	getInitialState: function() {
		var s = {};
		
		s.style = {};
		s.style.display = "none";
		
		s.initial = this.props.initial;
		s.current = 0;
		s.lenght = this.props.lenght;
		
		return s;
	},
	
	_click: function() {
		localStorage.setItem("state", null);
		console.log("cleared localstore");
		window.close();
	},
	
	render: function() {
		
		var style = this.state.style;
		
		var clippy = {};
		// compute new crop area
		var top = Math.floor( ( this.state.initial + this.state.current ) / 22 );
		var left = this.state.initial + this.state.current - top * 22;
		
		top = - top * 300;
		left = - left * 300;
		
		clippy['background-position'] = left + 'px ' + top + 'px'
		
		return  <div onClick={this._click} style={style}>
					<div className="clippy-text">{this.props.text}</div>
					<div style={clippy} className="clippy" ></div>
				</div>
	},
	
	peak: function() {
		
		if( this.state.interval ) clearInterval( this.state.interval );
		
		navigator.vibrate( [100, 200, 100] );
		
		var trigger = setTimeout( (function() {
			
			this.setState( {style : { display: 'inline' } } );
			
		}).bind(this), 1500);
		
		var interval = setInterval( (function() {
			var c = this.state.current + 1;
			c = c % this.state.lenght;
			this.setState( { 'current' : c } );
		} ).bind(this), 50 );
		
		this.setState( { interval : interval } );
	},
	
	componentWillMount: function(){		
		window.addEventListener("shake", (function(){
			
			if( this.state.trigger ) clearTimeout( this.state.trigger );
			
			this.setState( {style : { display: 'none' }, trigger: null } );
			
			this.props.close();
			
		}).bind(this) );
	},
	
	componentWillReceiveProps: function(nextProps) {
		
		this.setState( {
			initial : nextProps.initial,
			current : 0,
			lenght : nextProps.lenght
		});
		
		this.peak();
	},
	
	componentDidMount: function() {
		this.peak();
	}
});

var QrCameraScreen = React.createClass({
	
	getInitialState: function() {
		var s = {};
		
		s.url = '';
			
		return s;
	},
	
	click: function() {
		canvas = document.createElement('canvas');
		canvas.width = 500;
	    canvas.height = 500;
		canvas.getContext('2d').drawImage( this.getDOMNode(), 0, 0, canvas.width, canvas.height);
		
		var d = canvas.getContext('2d').getImageData(0,0, canvas.width, canvas.height);
		
		decodeImageData({
		    width: canvas.width,
		    height: canvas.height,
		    data: d.data
		}, (function myCallback(result) {
		    if( result.indexOf('http') >= 0 ) {
		    	this.props.done( result );
		    }
		}).bind(this) );
	},
	
	render: function() {
		return <video onClick={this.click} src={this.state.url}></video>;
	},
	
	componentDidMount: function() {
		navigator.webkitGetUserMedia( {video: true},
		(function(stream) {
			var URL = window.webkitURL;
		    var url = URL.createObjectURL(stream);
		    this.setState( { url : url } );
		}).bind(this), $.noop );
	}
});

var Application = React.createClass({
	
  getInitialState: function() {
	var s = {};
	
	s.status = 'demo';
	s.status_step = -1;
	
	return s;
  },
  
  _exit: function() {
		// store current state
	  	console.log("Storing " + JSON.stringify( this.state ) );
		localStorage.setItem("state", JSON.stringify( this.state ) );
		window.close();
  },
  
  connectToServer: function(url) {
	  
	  sendAjax( url , {}, function(data) {
	  });
	  
	  this.setState( { status : 'angry' } );
  },
	
  render: function() {
	  
	  /*if( this.state.status == 'camera' ) {
		  return <QrCameraScreen done={this.connectToServer} />;
	  }

	  if( this.state.status == 'angry' ) {
		  return <Avatar initial={0} lenght={22} close={this._exit} />;
	  }
	  
	  if( this.state.status == 'normal' ) {
		  return <Avatar initial={44} lenght={22} close={this._exit} />;
	  }*/
	  
	  // nothing to show
	  
	  if( this.state.status == 'demo' ) {
		  
		  var step = this.state.status_step;
		  
		  step++;
		  
		  this.state.status = 'demo';
		  this.state.status_step = step;
		  this.setState();
		  
		  console.log("state " + JSON.stringify( this.state ) );
		  
		  if( step == 0 ) {
			  return <Avatar initial={44} lenght={22} text={"Good morning!"} close={this._exit} />;
		  }
		  
		  if( step == 1 ) {
			  return <Avatar initial={22} lenght={22} text={"I need a walk! Haven't moved for three hours."} close={this._exit} />;
		  }
		  
		  if( step == 2 ) {
			  return <Avatar initial={44} lenght={0} text={"The café nearby is said to have delicious food. I'm hungry."} close={this._exit} />;
		  }
		  
		  if( step == 3 ) {
			  return <Avatar initial={44} lenght={0} text={"It's time to go to bed after an active day."} close={this._exit} />;
		  }
	   }
	  
	  return <Avatar initial={44} lenght={22} close={this._exit} />;
  },
  
  componentWillMount: function(){
	  // restore state
	  console.log( localStorage.state );
	  if( localStorage.state ) this.setState( JSON.parse( localStorage.state ) );
	  
	  window.addEventListener("pedometer", (function( event ){
			
			var data = event.data;
			
			// TODO: should there be acumulative too?			
			if( data.cumulativeTotalStepCount > 3 ) {
				this.setState( {status: 'normal'} );
			}
			
	  }).bind(this) );
	}

});

React.renderComponent(
		<Application />,
	    document.getElementById('container')
	);
