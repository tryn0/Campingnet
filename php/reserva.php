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
    if(!empty($_POST['entrada']) && !empty($_POST['salida'])){
        $entrada = str_replace('"','',str_replace('\/','/',json_encode($_POST['entrada'])));
        $salida = str_replace('"','',str_replace('\/','/',json_encode($_POST['salida'])));
    }
    
    if(!empty($_POST['sombra'])){
        $sombra = $_POST['sombra'];
    }

    if(!empty($_POST['habitaciones'])){
        $hab = json_encode($_POST['habitaciones']);
    }

    
    if($opcion == '"7"'){
        // Alojamiento
        $alojamiento = json_encode($_POST['alojamiento']);
        $caract1 = json_encode($_POST['caract1']);
        $caract2 = json_encode($_POST['caract2']);
        $idAlojamientoRandom = json_encode($_POST['idAlojamiento']);

        // Servicios extras
        $personasExtras = json_encode($_POST['personasExtras']);
        $personasExtrasMenor = json_encode($_POST['personasExtrasMenor']);
        $personasExtrasMayor = json_encode($_POST['personasExtrasMayor']);

        // Datos usuario
        $alias = json_encode($_POST['alias']); /* ESTE FALLA UTF-8 */
        $telefono = json_encode($_POST['telefono']);
        $email = json_encode($_POST['email']);
        $dni = json_encode($_POST['dni']);

        // Datos de la reserva
        $numPersonas = intval(substr(json_encode($_POST['numPersonas']), 1, -1));
        $multiplicativo = floatval(substr(json_encode($_POST['multiplicativo']), 1, -1));

    }
    else if($opcion == '"8"'){
        $tipo = json_encode($_POST['tipo']);
        $caract1 =  str_replace('"','',json_encode($_POST['caract1']));
        $caract2 =  str_replace('"','',json_encode($_POST['caract2']));
    }


    // Genérico
    if($opcion == '"1"'){ // Opcion 1 == Recoger todos los alojamientos.
        $sql = "SELECT DISTINCT tipo FROM alojamiento;";
        print json_encode(consulta($conn, $sql));
    }


    // Parcelas
    if($opcion == '"2"'){ // Opcion 2 == Recoger la característica 1 de las parcelas, la sombra que no sean NULL.
        $sql = "SELECT DISTINCT sombra FROM alojamiento WHERE sombra IS NOT NULL AND idAlojamiento NOT IN (SELECT idAlojamiento FROM servicio WHERE idAlojamiento IS NOT NULL AND idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva IN (SELECT idReserva FROM reserva WHERE fecha_entrada < '$salida' AND fecha_salida > '$entrada')))";
        print json_encode(consulta($conn, $sql));
    }

    if($opcion == '"3"'){ // Opcion 3 == Recoger la característica 2 de las parcelas, la dimension que no sean NULL.
        switch ($sombra) {
            case 'Nada':
                $sombra = 0;
                break;
            
            case 'Media':
                $sombra = 1;
                break;

            case 'Bastante':
                $sombra = 2;
                break;

            case 'Mucha':
                $sombra = 3;
                break;
        }
        $sql = "SELECT DISTINCT dimension FROM alojamiento WHERE dimension IS NOT NULL AND sombra = $sombra AND idAlojamiento NOT IN (SELECT idAlojamiento FROM servicio WHERE idAlojamiento IS NOT NULL AND idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva IN (SELECT idReserva FROM reserva WHERE fecha_entrada < '$salida' AND fecha_salida > '$entrada')));";
        print json_encode(consulta($conn, $sql));
    }


    // Bungalows
    if($opcion == '"4"'){ // Opcion 4 == Recoger la característica 1 de los bungalows, el número de habitaciones que no sean NULL.
        $sql = "SELECT DISTINCT habitaciones FROM alojamiento WHERE habitaciones IS NOT NULL AND idAlojamiento NOT IN (SELECT idAlojamiento FROM servicio WHERE idAlojamiento IS NOT NULL AND idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva IN (SELECT idReserva FROM reserva WHERE fecha_entrada < '$salida' AND fecha_salida > '$entrada')))";
        print json_encode(consulta($conn, $sql));
    }

    if($opcion == '"5"'){ // Opcion 5 == Recoger la característica 2 de los bungalows, el número máximo de personas que no sean NULL.
        $sql = "SELECT DISTINCT maximo_personas FROM alojamiento WHERE maximo_personas IS NOT NULL AND habitaciones = $hab AND idAlojamiento NOT IN (SELECT idAlojamiento FROM servicio WHERE idAlojamiento IS NOT NULL AND idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva IN (SELECT idReserva FROM reserva WHERE fecha_entrada < '$salida' AND fecha_salida > '$entrada')))";
        print json_encode(consulta($conn, $sql));
    }

    if($opcion == '"6"'){ // Opcion 6 == Recoger todos los servicios que en el idAlojamiento sean NULL.
        $sql = "SELECT idServicio, nombre FROM servicio WHERE idAlojamiento IS NULL;";
        print json_encode(consulta($conn, $sql));
    }
    
    if($opcion == '"7"'){ // Opcion 7 == Realizar reserva, si tiene una sesión iniciada
        
        // Obtención idUsuario
        $usuario = "SELECT idUsuario FROM usuario WHERE telefono = $telefono AND email = $email AND nif_usuario = $dni";
        $idUsuario = (consulta($conn, $usuario))[0]['idUsuario'];

        // Cambio primera letra para que conincida con la bd
        if($alojamiento == '"Bungalow"'){

            $alojamiento = str_replace('Bungalow', 'bungalow',json_encode($_POST['alojamiento']));

        }else if($alojamiento == '"Parcela"'){

            $alojamiento = str_replace('Parcela', 'parcela',json_encode($_POST['alojamiento']));

        }

        // Inserción en la bd de la reserva
        $reserva = "INSERT INTO reserva (fecha_entrada, fecha_salida, hora_entrada, hora_salida, idUsuario, num_personas, multiplicativo) VALUES ('".$entrada."', '".$salida."', '12:00:00','11:59:59', $idUsuario, $numPersonas, $multiplicativo);";
        $conn = conexion();
        insert($conn, $reserva);

        // Obtención del id de la recién hecha reserva
        $reservaId = "SELECT idReserva FROM reserva WHERE fecha_entrada = '$entrada' AND fecha_salida = '$salida' AND idUsuario = $idUsuario AND num_personas = $numPersonas AND multiplicativo = $multiplicativo;";
        $conn = conexion();
        $idReserva = (consulta($conn, $reservaId))[0]['idReserva'];

        // Obtención del id del alojamiento elegido, este alojamiento será el primero que encuentre con las caracteristicas elegidas en el formulario de reserva
        $servicioId = "SELECT idServicio FROM servicio WHERE idAlojamiento = $idAlojamientoRandom;";
        $conn = conexion();
        $idServicio = (consulta($conn, $servicioId))[0];

        // Inserción de lo alojamiento reservado en servicios_reserva, vincula el alojamiento con la reserva
        $servicioReserva = "INSERT INTO servicios_reserva (idReserva, idServicio, cantidad) VALUES ( (SELECT idReserva FROM reserva WHERE fecha_entrada = '$entrada' AND fecha_salida = '$salida' AND idUsuario = $idUsuario AND num_personas = $numPersonas AND multiplicativo = $multiplicativo), (SELECT idServicio FROM servicio WHERE idAlojamiento = $idAlojamientoRandom), 1);";
        $conn = conexion();
        $resultadoFinal = insert($conn, $servicioReserva);

        // Con este foreach se insertan todos los servicios extras sin contar las pers
        $resultadoFinal2 = 1;

        foreach($_POST as $key => $value) {
            if (intval($key)) {
                if ($resultadoFinal == 1 && $resultadoFinal2 == 1) {
                    if (intval($value) == 0) {
                        $value = "1";
                    }
                    $value = intval($value);
                    $servicioExtras = "INSERT INTO servicios_reserva (idReserva, idServicio, cantidad) VALUES ((SELECT idReserva FROM reserva WHERE fecha_entrada = '$entrada' AND fecha_salida = '$salida' AND idUsuario = $idUsuario AND num_personas = $numPersonas AND multiplicativo = $multiplicativo), $key, $value)";
                    $conn = conexion();
                    $resultadoFinal2 = insert($conn, $servicioExtras);

                    $personasExtrasBD = "INSERT INTO servicios_reserva (idReserva, idServicio, cantidad) VALUES ((SELECT idReserva FROM reserva WHERE fecha_entrada = '$entrada' AND fecha_salida = '$salida' AND idUsuario = $idUsuario AND num_personas = $numPersonas AND multiplicativo = $multiplicativo), (SELECT idServicio FROM servicio WHERE nombre = 'Persona extra adulto'), $value)";
                }
            }
        }

        if ($resultadoFinal == 1 && $resultadoFinal2 == 1) {
            print 1;
        }


    }

    if($opcion == '"8"'){ // Obtención del id del alojamiento con las caracteristicas elegidas en el formulario, escoge el id del primer alojamiento que encuentre
        if($tipo == '"Bungalow"'){
            $sql = "SELECT * FROM alojamiento WHERE habitaciones = $caract1 AND maximo_personas = $caract2 LIMIT 1";
        }else if($tipo == '"Parcela"'){

            switch ($caract1) {
                case 'Nada':
                    $caract1 = 0;
                    break;
                
                case 'Media':
                    $caract1 = 1;
                    break;
    
                case 'Bastante':
                    $caract1 = 2;
                    break;
    
                case 'Mucha':
                    $caract1 = 3;
                    break;
            }

            $sql = "SELECT * FROM alojamiento WHERE sombra = $caract1 AND dimension = '$caract2' LIMIT 1";
        }
        print json_encode(consulta($conn, $sql));
    }

    if($opcion == '"9"'){ // Precio alojamiento
        $idAlojamientoRandom = substr(json_encode($_POST['idAlojamiento']),1,-1);
        $sql = "SELECT precio FROM servicio WHERE idAlojamiento = $idAlojamientoRandom";
        print json_encode(consulta($conn, $sql));
    }

    if($opcion == '"10"'){ // Precio servicios extras
        $preciosServicios = array();
        foreach($_POST as $key => $value) {
            if (intval($key)) {
                $idService = json_encode($key);
                $sql = "SELECT idServicio, precio FROM servicio WHERE idServicio = $idService";
                $conn = conexion();
                $preciosServicios[] = consulta($conn, $sql);

            }
        }
        print json_encode($preciosServicios);
    }

    // Temporadas
    if($opcion == '"11"'){
        $sql = "SELECT * FROM temporadas WHERE fecha_entrada < '$salida' AND fecha_salida > '$entrada'";
        print json_encode(consulta($conn, $sql));
    }
?>