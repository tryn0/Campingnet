<?php
    //Para evitar error XMLHttpRequest en Angular
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Allow: GET, POST, OPTIONS, PUT, DELETE");
    $method = $_SERVER['REQUEST_METHOD'];
    if($method == "OPTIONS") {
        die();
    }
    //Este archivo se encarga de recoger los datos de la app de Angular y comprobar si el usuario a iniciar sesión existe

    require_once('bd.php');
    $conn = conexion();

    //Información enviada a través de POST desde el formulario de la app Angular
    $opcion = json_encode($_POST['opcion']);

    // Entradas al camping
    if($opcion == '"1"'){
        $hoy = date('Y-m-d');
        $sql = "SELECT COUNT(*) FROM reserva WHERE fecha_entrada = '$hoy'";
        print json_encode(consulta($conn, $sql));
    }

    // Salidas del camping
    else if($opcion == '"2"'){
        $hoy = date('Y-m-d');
        $sql = "SELECT COUNT(*) FROM reserva WHERE fecha_salida = '$hoy'";
        print json_encode(consulta($conn, $sql));
    }

    // Número de reseñas por revisar
    else if($opcion == '"3"'){
        $sql = "SELECT COUNT(*) FROM resenia WHERE publicado = 0";
        print json_encode(consulta($conn, $sql));
    }

    // Últimas 10 reservas
    else if($opcion == '"4"'){
        $sql = "SELECT * FROM reserva ORDER BY idReserva DESC LIMIT 10";
        print json_encode(consulta($conn, $sql));
    }

    // Obtiene las reseñas por aprobar
    else if($opcion == '"5"'){
        $sql = "SELECT * FROM resenia WHERE publicado = 0;";
        print json_encode(consulta($conn, $sql));
    }

    // Datos de las personas
    else if($opcion == '"6"'){
        $idUsuario = json_encode($_POST['idUsuario']);
        $sql = "SELECT * FROM usuario WHERE idUsuario = $idUsuario;";
        print json_encode(consulta($conn, $sql));
    }

    // idAlojamiento de la reseña
    else if($opcion == '"7"'){
        $idResenia = json_encode($_POST['idResenia']);
        $sql = "SELECT idAlojamiento FROM resenias WHERE idResenia = $idResenia;";
        print json_encode(consulta($conn, $sql));
    }

    // Aprobar reseña
    else if($opcion == '"8"'){
        $idResenia = json_encode($_POST['idResenia']);
        $sql = "UPDATE resenia SET publicado = 1 WHERE idResenia = $idResenia;";
        print json_encode(update($conn, $sql));
    }

    // Denegar reseña
    else if($opcion == '"9"'){
        $idResenia = json_encode($_POST['idResenia']);
        $sql = "UPDATE resenia SET publicado = 2 WHERE idResenia = $idResenia;";
        print json_encode(update($conn, $sql));
    }

    // Salidas del día
    else if($opcion == '"10"'){
        $hoy = date('Y-m-d');
        $sql = "SELECT * FROM reserva WHERE fecha_salida = '$hoy'";
        print json_encode(consulta($conn, $sql));
    }

    // Datos de alojamientos en servicio desde reserva
    else if($opcion == '"11"'){
        $idReserva = json_encode($_POST['idReserva']);
        $sql = "SELECT * FROM servicio WHERE idAlojamiento IS NOT NULL AND idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva = $idReserva)";
        print json_encode(consulta($conn, $sql));
    }

    // Datos del alojamiento
    else if($opcion == '"12"'){
        $idAlojamiento = json_encode($_POST['idAlojamiento']);
        $sql = "SELECT * FROM alojamiento WHERE idAlojamiento = $idAlojamiento";
        print json_encode(consulta($conn, $sql));
    }

    // Servicios de la reserva
    else if($opcion == '"13"'){
        $idReserva = json_encode($_POST['idReserva']);
        $sql = "SELECT * FROM servicio WHERE idAlojamiento IS NULL AND idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva = $idReserva)";
        print json_encode(consulta($conn, $sql));
    }

    // Cantidad de servicios de la reserva
    else if($opcion == '"14"'){
        $idReserva = json_encode($_POST['idReserva']);
        $sql = "SELECT idServicio, cantidad FROM servicios_reserva WHERE idReserva = $idReserva AND idServicio IN (SELECT idServicio FROM servicio WHERE idAlojamiento IS NULL AND idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva = $idReserva))";
        print json_encode(consulta($conn, $sql));
    }

    // Entradas del día
    else if($opcion == '"15"'){
        $hoy = date('Y-m-d');
        $sql = "SELECT * FROM reserva WHERE fecha_entrada = '$hoy'";
        print json_encode(consulta($conn, $sql));
    }

    // Búsqueda de reservas
    else if($opcion == '"16"'){

        $fecha = json_encode($_POST['fechaEntrada']);
        $idReserva = json_encode($_POST['idReserva']);
        $dni = json_encode($_POST['dni']);

        

        $sql = "SELECT * FROM reserva WHERE ";
        $i = 0;
        if ($fecha != '"0"') {
            $sql .= "fecha_entrada = $fecha";
            $i++;
        }
        if($idReserva != '"0"') {
            if ($i == 0) {
                $sql .= "idReserva = $idReserva";
                $i++;
            }else{
                $sql .= " AND idReserva = $idReserva"; 
            }
        }
        if($dni != '"0"') {
            if ($i == 0) {
                $sql .= "nif_usuario = $dni"; 
            }else{
                $sql .= " AND nif_usuario = $dni"; 
            }
        }
        print json_encode(consulta($conn, $sql));
    }

    // Últimas 10 reseñas (que están publicadas)
    else if($opcion == '"17"') {
        $sql = "SELECT * FROM resenia WHERE publicado = 1 ORDER BY idResenia DESC LIMIT 10";
        print json_encode(consulta($conn, $sql));
    }

    // Búsqueda de reseñas por alguno de los 3 campos
    else if($opcion == '"18"') {
        $idResenia = json_encode($_POST['idResenia']);
        $dni = json_encode($_POST['dniUsuario']);
        $idAlojamiento = json_encode($_POST['idAlojamiento']);

        if ($idResenia != '"0"') {
            $sql = "SELECT * FROM resenia WHERE idResenia = $idResenia";
        }
        if($dni != '"0"') {
            $sql = "SELECT * FROM resenia WHERE idUsuario IN (SELECT idUsuario FROM usuario WHERE nif_usuario = $dni)";
        }
        if($idAlojamiento != '"0"') {
            $sql = "SELECT * FROM resenia WHERE idResenia IN (SELECT idResenia FROM resenias WHERE idAlojamiento = $idAlojamiento)";
        }
        print json_encode(consulta($conn, $sql));
    }

    // Datos de alojamientos
    else if($opcion == '"19"') {
        $idResenia = json_encode($_POST['idResenia']);
        $sql = "SELECT * FROM alojamiento WHERE idAlojamiento IN (SELECT idAlojamiento FROM resenias WHERE idResenia = $idResenia)";
        print json_encode(consulta($conn, $sql));
    }

    // Datos de usuarios
    else if($opcion == '"20"') {
        $sql = "SELECT alias_usuario, email, idUsuario, nif_usuario, nombre_usuario, rol, telefono FROM usuario WHERE rol = 'cliente'";
        print json_encode(consulta($conn, $sql));
    }

    // Búsqueda de usuario
    else if($opcion == '"21"') {
        $alias = json_encode($_POST['alias']);
        $dni = json_encode($_POST['dniUsuario']);
        $email = json_encode($_POST['email']);

        $sql = "SELECT * FROM usuario WHERE ";
        $i = 0;
        if ($alias != '"0"') {
            $sql .= "alias_usuario = $alias";
            $i++;
        }
        if($dni != '"0"') {
            if ($i == 0) {
                $sql .= "nif_usuario = $dni";
                $i++;
            }else{
                $sql .= " AND nif_usuario = $dni"; 
            }
        }
        if($email != '"0"') {
            if ($i == 0) {
                $sql .= "email = $email"; 
            }else{
                $sql .= " AND email = $email"; 
            }
        }
        print json_encode(consulta($conn, $sql));
    }

    // Todos los servicios
    else if($opcion == '"22"') {
        $sql = "SELECT * FROM servicio";
        print json_encode(consulta($conn, $sql));
    }

    // Temporadas
    else if($opcion == '"23"') {
        $sql = "SELECT * FROM temporadas ORDER BY multiplicador";
        print json_encode(consulta($conn, $sql));
    }

    // Edición/agregado temporadas
    else if($opcion == '"24"') {
        $nombre = substr(json_encode($_POST['nombre']), 1,-1);
        $fechaInicio = json_encode($_POST['fechaInicio']);
        $fechaFin = json_encode($_POST['fechaFin']);
        $multiplicativo = floatval(substr(json_encode($_POST['multiplicador']), 1,-1));

        if($_POST['update']) { // Edición
            $nombreAntiguo = substr(json_encode($_POST['antiguoNombre']), 1,-1);
            $fechaInicioAntiguo = json_encode($_POST['antiguoFecha1']);
            $fechaFinAntiguo = json_encode($_POST['antiguoFecha2']);
            $multiplicativoAntiguo = floatval(substr(json_encode($_POST['antiguoMultiplicativo']), 1,-1));
        }

        $editarTemp = null;
        if($nombre == $nombreAntiguo && $fechaInicio == $fechaInicioAntiguo && $fechaFin == $fechaFinAntiguo) { // Solo cambia el multiplicador
            $editarTemp = 1;
        }else if ($nombre == $nombreAntiguo && $fechaInicio == $fechaInicioAntiguo){ // Fecha fin y/o multiplicador
            $sql = "SELECT * FROM temporadas WHERE fecha_salida = $fechaFin";
            $editarTemp = consulta($conn, $sql);
        }else if ($nombre == $nombreAntiguo && $fechaFin == $fechaFinAntiguo) { // Fecha entrada y/o multiplicador
            $sql = "SELECT * FROM temporadas WHERE fecha_entrada = $fechaInicio";
            $editarTemp = consulta($conn, $sql);
        }else if ($nombre == $nombreAntiguo){ // Todo cambia menos nombre
            $sql = "SELECT * FROM temporadas WHERE fecha_entrada = $fechaInicio OR fecha_salida = $fechaFin";
            $editarTemp = consulta($conn, $sql);
        }else{ // Todo cambia
            $sql = "SELECT * FROM temporadas WHERE nombre_temporada = $nombre OR fecha_entrada = $fechaInicio OR fecha_salida = $fechaFin";
            $editarTemp = consulta($conn, $sql);
        }
        
        if ($editarTemp == null) {
            $conn = conexion();
            if($_POST['update']) { // Edición
                $sql2 = "UPDATE temporadas SET nombre_temporada = '$nombre', fecha_entrada = $fechaInicio, fecha_salida = $fechaFin, multiplicador = $multiplicativo WHERE nombre_temporada = '$nombreAntiguo' AND fecha_entrada = $fechaInicioAntiguo AND fecha_salida = $fechaFinAntiguo AND multiplicador = $multiplicativoAntiguo";
                print json_encode(update($conn, $sql2));
            }else if ($_POST['insert']) { // Inserción
                $sql2 = "INSERT INTO temporadas (fecha_entrada, fecha_salida, nombre_temporada, multiplicador) VALUES ($fechaInicio, $fechaFin, '$nombre', $multiplicativo)";
                print json_encode(insert($conn, $sql2));
            }else{
                print json_encode(0);
            }
        }else{
            print json_encode(0);
        }
    }

    // Eliminar temporadas
    else if($opcion == '"25"') {
        $nombre = json_encode($_POST['nombre']);

        $sql = "DELETE FROM temporadas WHERE nombre_temporada = $nombre";
        print json_encode(delete($conn, $sql));
    }

    // Editar/añadir servicios
    else if($opcion == '"26"') {
        $nombre = json_encode($_POST['nombre']);
        $precio = json_encode($_POST['precio']);
        if($_POST['idServicio']) {
            $idServicio = json_encode($_POST['idServicio']);

            if($_POST['idAlojamiento']) {
                $idAlojamiento = json_encode($_POST['idAlojamiento']);
            }

            $sql = "UPDATE servicio SET nombre = $nombre, precio = $precio WHERE idServicio = $idServicio";
            print json_encode(update($conn, $sql));
        }else{
            $sql1 = "SELECT * FROM servicio WHERE nombre = $nombre";
            $comprobacion = consulta($conn, $sql1);

            if(!$comprobacion) {
               $sql = "INSERT INTO servicio (nombre, precio, idAlojamiento) VALUES ($nombre, $precio, NULL)";
               $conn = conexion();
                print json_encode(insert($conn, $sql)); 
            }
            
        }
    }

    // Añadir alojamiento y su respectivo servicio
    else if($opcion == '"27"') {
        $nombre = substr(json_encode($_POST['nombre']),1,-1);
        $precio = json_encode($_POST['precio']);
        $tipo = substr(json_encode($_POST['tipo']),1,-1);

        // Último número del alojamiento de su tipo
        $sql1 = "SELECT numeroAlojamiento FROM alojamiento WHERE tipo = '$tipo' ORDER BY numeroAlojamiento DESC LIMIT 1";
        $numero = consulta($conn, $sql1)[0]['numeroAlojamiento']+1;
        $conn = conexion();
        
        if($tipo == 'parcela') { // Inserts de alojamiento y servicio tipo parcela
            $sombra = substr(json_encode($_POST['sombra']),1,-1);
            $dimension = substr(json_encode($_POST['dimension']),1,-1);
            $sql = "INSERT INTO alojamiento (tipo, sombra, dimension, habitaciones, maximo_personas, numeroAlojamiento) VALUES ('$tipo', $sombra, '$dimension', NULL, NULL, $numero)";
            $alojamiento = insert($conn, $sql);

            if($alojamiento) {
                $sql2 = "SELECT idAlojamiento FROM alojamiento WHERE tipo = '$tipo' AND sombra = $sombra AND dimension = '$dimension' AND numeroAlojamiento = $numero";
                $conn = conexion();
                $idAlojamiento = consulta($conn, $sql2)[0]['idAlojamiento'];

                if($idAlojamiento) {
                    $conn = conexion();
                    $sql3 = "INSERT INTO servicio (nombre, precio, idAlojamiento) VALUES('$nombre', $precio, $idAlojamiento)";
                    print json_encode(insert($conn, $sql3));
                }
            }
            
        }else { // Inserta de alojamiento y servicio tipo bungalow
            $habitaciones = substr(json_encode($_POST['habitaciones']),1,-1);
            $maximo_personas = substr(json_encode($_POST['maximo_personas']),1,-1);
            $sql = "INSERT INTO alojamiento (tipo, sombra, dimension, habitaciones, maximo_personas, numeroAlojamiento) VALUES ('$tipo', NULL, NULL, $habitaciones, $maximo_personas, $numero)";
            $insercion = insert($conn, $sql);

            if($insercion) {
                $sql2 = "SELECT idAlojamiento FROM alojamiento WHERE tipo = '$tipo' AND habitaciones = $habitaciones AND maximo_personas = $maximo_personas AND numeroAlojamiento = $numero";
                $conn = conexion();
                $idAlojamiento = consulta($conn, $sql2)[0]['idAlojamiento'];

                if($idAlojamiento) {
                    $conn = conexion();
                    $sql3 = "INSERT INTO servicio (nombre, precio, idAlojamiento) VALUES('$nombre', $precio, $idAlojamiento)";
                    print json_encode(insert($conn, $sql3));
                }
            }
        }
    }
    // Eliminar reserva
    else if($opcion == '"28"') {
        $idReserva = json_encode($_POST['idReserva']);

        $sql = "DELETE FROM servicios_reserva WHERE idReserva = $idReserva";
        $delete1 = delete($conn, $sql);
        if($delete1) {
            $conn = conexion();
            $sql2 = "DELETE FROM reserva WHERE idReserva = $idReserva";
            print json_encode(delete($conn, $sql2));
        }else{
            print json_encode(0);
        }
    }
    // Actualización de la reserva
    else if($opcion == '"29"') {
        print json_encode($_POST);
    }
    // Eliminar alojamiento
    else if($opcion == '"30"') {
        $idAlojamiento = json_encode($_POST['idAlojamiento']);
        $sql = "DELETE FROM servicio WHERE idAlojamiento = $idAlojamiento";
        $delete1 = delete($conn, $sql);
        if($delete1) {
            $conn = conexion();
            $sql2 = "DELETE FROM alojamiento WHERE idAlojamiento = $idAlojamiento";
            print json_encode(delete($conn, $sql2));
        }else{
            print json_encode(0);
        }
    }
    // Insertar servicio en reserva
    else if($opcion == '"31"') {
        $idReserva = $_POST['idReserva'];
        $cantidades = 0;
        $servicios = array();
        $i = 0;
        foreach($_POST as $key => $value) {
            if($i > 1) {
                $servicios[] = $value;
            }
            $i++;
        }
        
        $valido = 1;
        $x = explode(',',$servicios[0]);
        for ($j=0; $j < count($x); $j = $j+2) { 
            if($valido == 1) {
                $conn = conexion();
                $idServicio = $x[$j];
                $cantidad = $x[$j+1];
                $sql = "INSERT INTO servicios_reserva (idReserva, idServicio, cantidad) VALUES ($idReserva, $idServicio, $cantidad)";
                $resultado = insert($conn, $sql);
                if($resultado) {
                    $valido = 1;
                    $cantidades += $cantidad;
                }else{
                    $valido = 0;
                }
            }else{
                print json_encode(0);
                break;
            }
        }

        if($valido == 1) {
             $conn = conexion();
            $sql = "SELECT num_personas FROM reserva WHERE idReserva = $idReserva";
            $cantidadOriginal = consulta($conn, $sql)[0]['num_personas'];

            $conn = conexion();
            $cantidadFinal = $cantidadOriginal + $cantidad;
            $sql = "UPDATE reserva SET num_personas = $cantidadFinal WHERE idReserva = $idReserva";
            print json_encode(update($conn, $sql));
        }
    }
    // Eliminar servicio de reserva
    else if($opcion == '"32"') {
        $idReserva = $_POST['idReserva'];
        $cantidad = 0;
        $servicios = array();
        $i = 0;
        foreach($_POST as $key => $value) {
            if($i > 1) {
                $servicios[] = $value;
            }
            $i++;
        }

        $valido = 1;
        $x = explode(',',$servicios[0]);
        for ($j=0; $j < count($x); $j++) {
            if($valido == 1) {
                $idServicio = $x[$j];
                if($idServicio == 2 || $idServicio == 3 || $idServicio == 4){
                    $conn = conexion();
                    $sqlCantidad = "SELECT * FROM servicios_reserva WHERE idServicio = $idServicio AND idReserva = $idReserva";
                    $cantidad = $cantidad + consulta($conn, $sqlCantidad)[0]['cantidad'];
                }
                $conn = conexion();
                $sql = "DELETE FROM servicios_reserva WHERE idServicio = $idServicio AND idReserva = $idReserva";
                $resultado = delete($conn, $sql);
                if($resultado) {
                    $valido = 1;
                }else{
                    $valido = 0;
                }
            }else{
                print json_encode(0);
                break;
            }
        }
        
        if($valido == 1) {
            $conn = conexion();
            $sql = "SELECT num_personas FROM reserva WHERE idReserva = $idReserva";
            $cantidadOriginal = consulta($conn, $sql)[0]['num_personas'];

            $conn = conexion();
            $cantidadFinal = $cantidadOriginal - $cantidad;
            $sql = "UPDATE reserva SET num_personas = $cantidadFinal WHERE idReserva = $idReserva";
            print json_encode(update($conn, $sql));
        }
    }
?>