//Variables QR
	    var gCtx = null;
	    var gCanvas = null;
	    var stype=0;
	    var gUM=false;
	    var webkit=false;
	    var v=null;
	    var vidhtml = '<video id="v" autoplay></video>';

//FUNCIONS QR--------------------------------------------------------------------------------------------------------------------

	    function initCanvas(ww,hh)
	    {
		gCanvas = document.getElementById("qr-canvas");
		var w = ww;
		var h = hh;
		gCanvas.style.width = w + "px";
		gCanvas.style.height = h + "px";
		gCanvas.width = w;
		gCanvas.height = h;
		gCtx = gCanvas.getContext("2d");
		gCtx.clearRect(0, 0, w, h);

	    }


	    function captureToCanvas() {
		if(stype!=1)
		    return;
		if(gUM)
		{
		    gCtx.drawImage(v,0,0);

		    try{
		        qrcode.decode();
		    }
		    catch(e){
		        console.log(e);
		        setTimeout(captureToCanvas, 500);
		    };
		}

	    }

	    function read(a)
	    {
		stype=0;
		console.log(qrcode.result);
		var tmp=qrcode.result;
		
		tsk_utils_log_info("Numero=" + (tmp || "(null)"));
		trucar(tmp);
	    }


	    function success(stream) {
		if(webkit)
		    v.src = window.webkitURL.createObjectURL(stream);
		else
		    v.src = stream;
		gUM=true;

		setTimeout(captureToCanvas, 500);
	    }

	    function error(error) {
		gUM=false;
		return;
	    }


	    function setwebcam()
	    {
		
		if(stype==1)
		{
		    setTimeout(captureToCanvas, 500);
		    return;
		}

		var n=navigator;
		if(n.getUserMedia)
		{
		    document.getElementById("outdiv").innerHTML = vidhtml;
		    v=document.getElementById("v");
		    n.getUserMedia({video: true, audio: false}, success, error);
		}
		else
		if(n.webkitGetUserMedia)
		{
		    document.getElementById("outdiv").innerHTML = vidhtml;
		    v=document.getElementById("v");
		    webkit=true;
		    n.webkitGetUserMedia({video: true, audio: false}, success, error);
		}
		else
		if(n.mozGetUserMedia)
		{
		    document.getElementById("outdiv").innerHTML = vidhtml;
		    v=document.getElementById("v");
		    n.mozGetUserMedia({video: true, audio: false}, success, error);
		}
		stype=1;
		setTimeout(captureToCanvas, 500);
	    }

	    function restart(){
		gCtx = null;
		gCanvas = null;
		stype=0;
		gUM=false;
		webkit=false;
		v=null;
		initCanvas(800,600);
		
	    }
