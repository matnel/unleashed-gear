/***
 Create a fake AJAX connection using the device as a proxy.
 ***/
$().ready( function() {

	var agent = null;
	var _socket = null;
	var CHANNELID = 104;
	var ProviderAppName = "HelloAccessoryProvider";

	var agentCallback = {
			onconnect : function(socket) {
				
				_socket = socket;
				
				console.log("Socket ok!");

				socket.setSocketStatusListener(function(reason){
					console.log("Service connection lost, Reason : [" + reason + "]");
					disconnect();
				});

			},
			onerror : $.noop
		};

	var peerAgentFindCallback = {
			onpeeragentfound : function(peerAgent) {
				try {
					if (peerAgent.appName == ProviderAppName) {
						agent.setServiceConnectionListener( agentCallback );
						agent.requestServiceConnection(peerAgent);
					}
				} catch(err) {
					console.log("exception [" + err.name + "] msg[" + err.message + "]");
				}
			},
			onerror : $.noop
		}

	webapis.sa.requestSAAgent( function(agents) {
		agent = agents[0];
		agent.setPeerAgentFindListener( peerAgentFindCallback );
		agent.findPeerAgents();

	});

	var _sendAjax = function( url , data, callback ) {
		_socket.setDataReceiveListener( function(id, data) {
			callback( data );
		} );
		_socket.sendData(CHANNELID,  url );
	}
	
	window.sendAjax = _sendAjax;


});
