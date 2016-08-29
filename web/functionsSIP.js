//Variables Sip
	    var oSipStack, onSipEventStack, onSipEventSession;
	    var txtDisplayName, txtPrivateIdentity, txtPublicIdentity, txtPassword, txtRealm;
	    var txtRegStatus, txtCallStatus;

	    var s_websocket_server_url;
	    var s_sip_outboundproxy_url;
	    
	    var videoRemote, videoLocal, audioRemote;

	    /*var sTransferNumber;
	    var oRingTone, oRingbackTone;
	    var btnCall, btnHangUp;
	    var btnRegister, btnUnRegister;
	    var btnFullScreen, btnHoldResume, btnTransfer, btnKeyPad;
	    var videoRemote, videoLocal;
	    var divVideo, divCallOptions;
	    var tdVideo;
	    var bFullScreen = false;
	    var oNotifICall;
	    var oReadyStateTimer;
	    var bDisableVideo = false; */

//FUNCIONS SIP--------------------------------------------------------------------------

	    //FUNCIONS SIP--------------------------------------------------------------------------

	    function autoRegister(){

		omplirdefecte();
		Register();
	    }

	    function omplirdefecte(){
		txtDisplayName="1060";
		txtPrivateIdentity="1060";
		txtPublicIdentity="sip:1061@192.168.56.101";
		txtPassword="1060";
		txtRealm="192.168.56.101";
		s_websocket_server_url="ws://192.168.56.101:8088/ws";
		s_sip_outboundproxy_url=null;

		tsk_utils_log_info("txtDisplayName=" + (txtDisplayName || "(null)"));
		tsk_utils_log_info("txtPrivateIdentity=" + (txtPrivateIdentity || "(null)"));
		tsk_utils_log_info("txtPublicIdentity=" + (txtPublicIdentity || "(null)"));
		tsk_utils_log_info("txtPassword=" + (txtPassword || "(null)"));
		tsk_utils_log_info("txtRealm=" + (txtRealm || "(null)"));
		tsk_utils_log_info("s_websocket_server_url=" + (s_websocket_server_url || "(null)"));
		
	    }
	function omplir (){
		txtDisplayName="<?php echo $_SESSION['nombre']; ?>";
		txtPrivateIdentity="<?php echo $_SESSION['nombre']; ?>";
		txtPublicIdentity="sip:<?php echo $_SESSION['nombre']; ?>@192.168.56.101";
		txtPassword="<?php echo $_SESSION['password']; ?>";
		txtRealm="192.168.56.101";
		s_websocket_server_url="ws://192.168.56.101:8088/ws";
		s_sip_outboundproxy_url=null;

		tsk_utils_log_info("txtDisplayName=" + (txtDisplayName || "(null)"));
		tsk_utils_log_info("txtPrivateIdentity=" + (txtPrivateIdentity || "(null)"));
		tsk_utils_log_info("txtPublicIdentity=" + (txtPublicIdentity || "(null)"));
		tsk_utils_log_info("txtPassword=" + (txtPassword || "(null)"));
		tsk_utils_log_info("txtRealm=" + (txtRealm || "(null)"));
		tsk_utils_log_info("s_websocket_server_url=" + (s_websocket_server_url || "(null)"));
	}

	    // sends SIP REGISTER request to login
	    function Register(){

		// catch exception for IE (DOM not ready)
		try {// create SIP stack

		    if (!txtRealm || !txtPrivateIdentity || !txtPublicIdentity) {
		        //'<b>Please fill madatory fields (*)</b>';
		        return;
		    }
		    var o_impu = tsip_uri.prototype.Parse(txtPublicIdentity);
		    if (!o_impu || !o_impu.s_user_name || !o_impu.s_host) {
		        // "<b>[" + txtPublicIdentity + "] is not a valid Public identity</b>";
		        return;
		    }

		    // enable notifications if not already done
		    if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
		        window.webkitNotifications.requestPermission();
		    }

		    var i_port;
		    var s_proxy;

		    if (!tsk_utils_have_websocket()) {
		        // port and host will be updated using the result from DNS SRV(NAPTR(realm))
		        i_port = 5060;
		        s_proxy = txtRealm;

		    }
		    else {
		        // there are at least 5 servers running on the cloud on ports: 4062, 5062, 6062, 7062 and 8062
		        // we will connect to one of them and let the balancer to choose the right one (less connected sockets)
		        // each port can accept up to 65K connections which means that the cloud can manage 325K active connections
		        // the number of port will be increased or decreased based on the current trafic
		        i_port = 4062 + (((new Date().getTime()) % 5) * 1000);
		        s_proxy = "sipml5.org";

		    }
		  
		  
		    // create a new SIP stack. Not mandatory as it's possible to reuse the same satck
		   oSipStack = new SIPml.Stack({
		            realm: txtRealm,
		            impi: txtPrivateIdentity,
		            impu: txtPublicIdentity,
		            password: txtPassword,
		            display_name: txtDisplayName,
		            websocket_proxy_url: s_websocket_server_url,
		            outbound_proxy_url: s_sip_outboundproxy_url,
		            ice_servers: null,
		            enable_rtcweb_breaker: true,
		            events_listener: { events: '*', listener: onSipEventStack },
		            sip_headers: [
		                    { name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.2013.04.26' },
		                    { name: 'Organization', value: 'Doubango Telecom' }
		            ]
		        }
		    );


		  

		    if (oSipStack.start() != 0) {
		        //'<b>Failed to start the SIP stack</b>';
		    }
		    else return;
		}
		catch (e) {
		    // "<b>2:" + e + "</b>";
		}
	    }

	    // sends SIP REGISTER (expires=0) to logout
	    function UnRegister() {
		if (oSipStack) {
		    oSipStack.stop(); // shutdown all sessions
		}
	    }

	    function trucar(a){
		
		
	      
	      var oConf = {
		    audio_remote: audioRemote,
		    video_local: viewVideoLocal,
		    video_remote: viewVideoRemote,
		    events_listener: { events: '*', listener: onSipEventSession },
		    sip_caps: [
		                    { name: '+g.oma.sip-im' },
		                    { name: '+sip.ice' },
		                    { name: 'language', value: '\"en,fr\"' }
		                ]
		};
	
	      
	      
		if (!tsk_string_is_null_or_empty(a)) {
		    // create call session
		    oSipSessionCall = oSipStack.newSession('call-audio', oConf);
		    // make call
		    if (oSipSessionCall.call(a) != 0) {
		        oSipSessionCall = null;
		        return;
		    }
		}
	      
		 
		else {
		    
		}
	    }

	    // Callback function for SIP Stacks
	     function onSipEventStack(e /*SIPml.Stack.Event*/) {
		// this is a special event shared by all sessions and there is no "e_stack_type"
		// check the 'sip/stack' code
		tsk_utils_log_info('==stack event = ' + e.type);
		switch (e.type) {
		    case 'started':
		    {
		        // catch exception for IE (DOM not ready)
		        try {
		            // LogIn (REGISTER) as soon as the stack finish starting
		            oSipSessionRegister = this.newSession('register', {
		                    expires: 200,
		                    events_listener: { events: '*', listener: onSipEventSession },
		                    sip_caps: [
		                                { name: '+g.oma.sip-im', value: null },
		                                { name: '+audio', value: null },
		                                { name: 'language', value: '\"en,fr\"' }
		                        ]
		                });
		                oSipSessionRegister.register();
		            }
		            catch (e) {
		                // "<b>1:" + e + "</b>";

		            }
		            break;
		    }
		       
		    
		    case 'stopping': case 'stopped': case 'failed_to_start': case 'failed_to_stop':
		    {
		            var bFailure = (e.type == 'failed_to_start') || (e.type == 'failed_to_stop');
		        oSipStack = null;
		        oSipSessionRegister = null;
		        oSipSessionCall = null;

		        
		        //"<i>Disconnected: <b>" + e.description + "</b></i>" : "<i>Disconnected</i>";
		        break;
		    }

		    case 'i_new_call': {break;}              
		    case 'm_permission_requested':   {break;}             
		    case 'm_permission_accepted':{break;}
		    case 'm_permission_refused':   {break;}             
		    case 'starting': default: break;
		
		}
	    };
	      
	      
	     // Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
	    function onSipEventSession(e /* SIPml.Session.Event */) {
		tsk_utils_log_info('==session event = ' + e.type);

		switch (e.type) {
		    case 'connecting': case 'connected':
		        {
		            var bConnected = (e.type == 'connected');
		            if (e.session == oSipSessionRegister) {
		                
		                //"<i>" + e.description + "</i>";
		            }
		            else if (e.session == oSipSessionCall) {
		                
		                

		                //"<i>" + e.description + "</i>";
		                
		                if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback
		                    uiVideoDisplayEvent(true, true);
		                    uiVideoDisplayEvent(false, true);
		                }
		            }
		            break;
		        } // 'connecting' | 'connected'
		                           
		    case 'terminating': case 'terminated':
		        {
		            if (e.session == oSipSessionRegister) {
		                uiOnConnectionEvent(false, false);

		                oSipSessionCall = null;
		                oSipSessionRegister = null;

		                // "<i>" + e.description + "</i>";
		            }
		            else if (e.session == oSipSessionCall) {
		                uiCallTerminated(e.description);
		            }
		            break;
		        } // 'terminating' | 'terminated'
		    
		    case 'm_stream_video_local_added':{break;}                
		    case 'm_stream_video_local_removed':{break;}                
		    case 'm_stream_video_remote_added':{break;}                
		    case 'm_stream_video_remote_removed':{break;}                
		    case 'm_stream_audio_local_added':{break;}
		    case 'm_stream_audio_local_removed':{break;}
		    case 'm_stream_audio_remote_added':{break;}
		    case 'm_stream_audio_remote_removed':{break;}
		    case 'i_ect_new_call':{break;}    
		    case 'i_ao_request':{break;}                
		    case 'm_early_media':{break;}                
		    case 'm_local_hold_ok':{break;}                
		    case 'm_local_hold_nok': {break;}               
		    case 'm_local_resume_ok': {break;}               
		    case 'm_local_resume_nok': {break;}               
		    case 'm_remote_hold':   {break;}            
		    case 'm_remote_resume': {break;}               
		    case 'o_ect_trying':     {break;}           
		    case 'o_ect_accepted':  {break;}              
		    case 'o_ect_completed':{break;}
		    case 'i_ect_completed':  {break;}              
		    case 'o_ect_failed':{break;}
		    case 'i_ect_failed':   {break;}             
		    case 'o_ect_notify':{break;}
		    case 'i_ect_notify':   {break;}             
		    case 'i_ect_requested':{break;}
		        
		}
	    };
	      
	      
	      function uiCallTerminated(s_description){
		

		oSipSessionCall = null;

	       

		// "<i>" + s_description + "</i>";
		
		

		setTimeout(function () { if (!oSipSessionCall){} }, 2500);
	    }


