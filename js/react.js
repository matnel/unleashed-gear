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
	
	render: function() {
		
		var style = this.state.style;
		
		var clippy = {};
		// compute new crop area
		var top = Math.floor( ( this.state.initial + this.state.current ) / 60 );
		var left = this.state.initial + this.state.current - top * 60;
		
		top = - top * 300;
		left = - left * 300;
		
		clippy['background-position'] = left + 'px ' + top + 'px'
		
		return  <div style={style}>
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
			
			window.close();
			
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
	
	s.status = 'camera';
	
	return s;
  },
  
  connectToServer: function(url) {
	  alert("connecting to " + url );
	  this.setState( { status : 'normal' } );
  },
	
  render: function() {
	  
	  if( this.state.status == 'camera' ) {
		  return <QrCameraScreen done={this.connectToServer} />;
	  }

	  if( this.state.status == 'steps' ) {
		  return <Avatar initial={0} lenght={13} />;
	  }
	  
	  if( this.state.status == 'normal' ) {
		  return <Avatar initial={266} lenght={11} />;
	  }
	  
	  // nothing to show
	  return <Avatar initial={0} lenght={60} />;;
	  
  },
  
  componentWillMount: function(){
		window.addEventListener("pedometer", (function( event ){
			
			var data = event.data;
			
			console.log( data.cumulativeTotalStepCount );
			
			if( data.cumulativeTotalStepCount > 15 ) {
				this.setState( {status: 'steps'} );
			}
			
		}).bind(this) );
	},

});

React.renderComponent(
		<Application />,
	    document.getElementById('container')
	);
