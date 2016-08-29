<?php
require("header.php");
?>
<div class="jumbotron">
<h1>Qué quieres hacer?</h1>
        <p class="lead">Te ha gustado la información sobre está obra? Quieres saber más?</p>
         <p class="lead">O deseas escanear otro código QR?</p>
        <div id="buttonQR">
						<input value="OTRO QR" onclick="ir(2)" type="button" class="btn btn-primary btn-lg">
						<input value="QUIERO SABER MAS" onclick="ir(3)" type="button" class="btn btn-primary btn-lg">
			
				</div>	
</div>		

		


  
	<?php
	require("footer.php");

	?>	
