/***
 Create a fake AJAX connection using the device as a proxy.
 ***/
$().ready( function() {

	var agent = null;
	var socket = null;
	var CHANNELID = 104;
	var ProviderAppName = "HelloAccessoryProvider";

	var agentCallback = {
			onconnect : function(socket) {
				socket = socket;

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

	window.sendAjax = function( url , data, callback ) {
		SASocket.setDataReceiveListener( callback );
		SASocket.sendData(CHANNELID,  url );
	}


});
