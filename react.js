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
		var top = Math.floor( ( this.state.initial + this.state.current ) / 24 );
		var left = this.state.initial + this.state.current - top * 24;
		
		top = - top * 93;
		left = - left * 124;
		
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
		} ).bind(this), 100 );
		
		this.setState( { interval : interval } );
	},
	
	componentWillMount: function(){		
		window.addEventListener("shake", (function(){
			
			if( this.state.trigger ) clearTimeout( this.state.trigger );
			
			this.setState( {style : { display: 'none' }, trigger: null } );
			
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

var Application = React.createClass({
	
  getInitialState: function() {
	var s = {};
	
	s.status = '';
	
	return s;
  },
	
  render: function() {

	  if( this.state.status == 'steps' ) {
		  return <Avatar initial={0} lenght={13} />;
	  }
	  
	  return <Avatar initial={266} lenght={11} />;
  },
  
  componentWillMount: function(){
		window.addEventListener("pedometer", (function( event ){
			
			var data = event.data;
			
			console.log( data.cumulativeTotalStepCount );
			
			if( data.cumulativeTotalStepCount > 15 ) {
				this.setState( {status: 'steps'} );
				console.log("steps ok!");
			}
			
		}).bind(this) );
	},

});


React.renderComponent(
	<Application />,
    document.getElementById('container')
);
