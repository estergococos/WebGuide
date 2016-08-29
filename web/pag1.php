<?php
require("header.php");

		
		
		pg_connect("host=localhost port=5432 dbname=postgres user=postgres password=albert34") or die("No se pudo realizar la conexi&oacute;n:".pg_last_error());

				
		if($_REQUEST['nombre'] && $_REQUEST['password']){			
						
			
		
			$res =pg_query("SELECT * FROM sip_users");
			if (!$res) {
				die("Error al realizar consulta");
			}
			$sortirwhile=0;
			while (($reg = pg_fetch_row($res)) AND ($sortirwhile==0)) {
				if (strcmp($_REQUEST['nombre'],$reg[1])==0){
					
					$control=0;
					unset($_REQUEST['nombre']);
					unset($_REQUEST['password']);
					$sortirwhile=1;
				}
				else 
					$control=1;
				
			}
			if ($control){			
				$query = sprintf("INSERT INTO sip_users(name, secret) VALUES('%s','%s')",$_REQUEST['nombre'],$_REQUEST['password']);
				$query = pg_query($query);
				 
	 			if($query){
	 				
					$_SESSION['nombre']=$_REQUEST['nombre'];
					$_SESSION['password']=$_REQUEST['password'];
					unset($_REQUEST['nombre']);
					unset($_REQUEST['password']);
		?>
<div class="jumbotron">
<h1>Bienvenido!</h1>
        <p class="lead">De momento sólo se pueden usar usuarios báscios. En breves estará disponible mas tipos de usuarios.</p>
        <div id="buttonenter">
			<form action="pag2.php">
				<input type="submit" class="btn btn-primary btn-lg" href="#" role="button" value="ENTRAR">
			</form>
		</div>
      </div>		
		


		<?php
				}
				
			}
		}
		else{ // Si no tenemos todos los campos, mostramos el formulario
	?>
	<div class="jumbotron">
        <h1>Prueba Gratis!</h1>
        <p class="lead">Prueba la nueva aplicación sin necesidad de registrate</p>
        <form method="POST" action="pag1.php">
			<input type="text" name="nombre" hidden="hidden" value="<?php for($i=0; $i<10; $i++){ $d=rand(1,30)%2; echo $d ? chr(rand(65,90)) : chr(rand(48,57));}?>">
			<input type="text" name="password" hidden="hidden" value="1111">
			<input type="submit" value="FREE" class="btn btn-primary btn-lg">
		</form>
      </div>


      <div class="row">
             
	<div id="form" class="col-md-6">	
		<form class="form-signin" method="POST" action="pag1.php">
        <h2 class="form-signin-heading">Registrate para tener acceso a más contenido</h2>
        <label for="inputEmail" class="sr-only">Email address</label>
        <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus name="nombre">
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Password" required name="password">
       
        <button class="btn btn-lg btn-primary btn-block" type="submit">Iniciar session</button>
        <button class="btn btn-default btn-lg btn-block" type="button">Crear cuenta</button>
      </form>
  
</div>
   



	<div class="col-md-6">
	<h2>Nuevas Noticias</h2>
              <p>Llega al museo la nueva aplicacón WebGuide para hacer tu visita más enriquecerdora. Esta nueva aplicación web, en fase beta, permitirá a nuestros vistitantes disfrtuar de una audio-guia sin coste adicional alguno y sin necessidad de descargar nada.</p>
              <p><a class="btn btn-default" href="news.php" role="button">Más detalles &raquo;</a></p>
	
	</div>
	<?php
		}
	require("footer.php");

	?>	
	
