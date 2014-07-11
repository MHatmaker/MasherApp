
require(["dijit/Dialog", "dijit/form/Button"]);
    
function setupPusherClient(mapholder, cbfn)
{
	pusherChannelSelectorDialog(function() {
				    console.log('You selected a channel name');
					var channelTextBox = dojo.byId('channelName');
					console.debug(channelTextBox.value);
				    channel = (channelTextBox.value);
					PusherClient(mapholder, channel, cbfn);
				});
};

function PusherClient(mapholder, channel, cbfn)
{
    console.log("PusherClient");
    this.mapHolder = mapholder;
    var self = this;
	self.callbackfunction = cbfn;
	if(channel[0] == '/')
	{
		var chlength = channel.length;
		var channelsub = channel.substring(1);
		channelsub = channelsub.substring(0, chlength-2);
		channel = channelsub;
	}
    this.CHANNEL = channel; //'/' + channel + '/';
	console.log("with channel " + this.CHANNEL);
	
	var pusher = new Pusher('5c6bad75dc0dd1cec1a6');
	pusher.connection.bind('state_change', function(state) {
		if( state.current === 'connected' ) {
			// alert("Yipee! We've connected!");
            console.log("Yipee! We've connected!");
			}
		else {
			alert("Oh-Oh, connection failed");
			}
		});
	var channel = pusher.subscribe(this.CHANNEL);
	channel.bind('client-MapXtntEvent', function(frame) 
     {  // Executed when a messge is received
         console.log('frame is',frame);
         self.mapHolder.retrievedBounds(frame);
         console.log("back from boundsRetriever");
     }
	);
	
	channel.bind('pusher:subscription_error', function(statusCode) {
		alert('Problem subscribing to "private-channel": ' + statusCode);
	});
	channel.bind('pusher:subscription_succeeded', function() {
		console.log('Successfully subscribed to "private-channel"');
	});
				
    self.mapHolder.setPusherClient(pusher, self.CHANNEL);
	if(self.callbackfunction)
		self.callbackfunction(self.CHANNEL);
}
function pusherChannelSelectorDialog(onAcceptChannelName)
{
    require(["dijit/Dialog", "dijit/form/Button"]);
	dojo.byId('idDialogButtonAcceptChannel').onclick  = onAcceptChannelName;
	dojo.byId('channelName').onkeypress = function(e) {
			if(e.which == 13) {
				StompChannelerDialog.hide();
				onAcceptChannelName();
			}
		};

	var p = dijit.byId('StompChannelerDialog');
	StompChannelerDialog.show();
}