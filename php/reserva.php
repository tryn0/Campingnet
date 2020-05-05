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
        $entrada = str_replace('"','',str_replace('\/','/',json_encode($_POST['fechaEntrada'])));
        $salida = str_replace('"','',str_replace('\/','/',json_encode($_POST['fechaSalida'])));
    }
    
    if(!empty($_POST['sombra'])){
        $sombra = $_POST['sombra'];
    }

    if(!empty($_POST['habitaciones'])){
        $hab = json_encode($_POST['habitaciones']);
    }

    
    if($opcion == '"7"'){
        $alojamiento = str_replace('Bungalow', 'bungalow',json_encode($_POST['alojamiento']));
        $caract1 = json_encode($_POST['caract1']);
        $caract2 = json_encode($_POST['caract2']);
        $nombreUsuario = json_encode($_POST['nombreUsuario']); /* ESTE FALLA UTF-8 */
        $telefono = json_encode($_POST['telefono']);
        $email = json_encode($_POST['email']);
        $dni = json_encode($_POST['dni']);
        $numPersonas = json_encode($_POST['numPersonas']);
        $perExtras = json_encode($_POST['personasExtras']);
    }
    else if($opcion == '"8"'){
        $tipo = json_encode($_POST['tipo']);
        $caract1 =  str_replace('"','',json_encode($_POST['caract1']));
        $caract2 =  str_replace('"','',json_encode($_POST['caract2']));
    }
    

    //print json_encode($entrada.' '.$salida);


    // Genérico
    if($opcion == '"1"'){ // Opcion 1 == Recoger todos los alojamientos.
        $sql = "SELECT DISTINCT tipo FROM alojamiento;";
        print json_encode(consulta($conn, $sql));
    }


    // Parcelas
    if($opcion == '"2"'){ // Opcion 2 == Recoger la característica 1 de las parcelas, la sombra que no sean NULL.
        $sql = 'SELECT DISTINCT sombra FROM alojamiento WHERE sombra IS NOT NULL AND idAlojamiento NOT IN (SELECT idAlojamiento FROM servicio WHERE idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva IN (SELECT idReserva FROM reserva WHERE fecha_entrada < "'.$salida.'" AND fecha_salida > "'.$entrada.'")))';
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
        $sql = 'SELECT DISTINCT dimension FROM alojamiento WHERE dimension IS NOT NULL AND sombra = '.$sombra.' AND idAlojamiento NOT IN (SELECT idAlojamiento FROM servicio WHERE idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva IN (SELECT idReserva FROM reserva WHERE fecha_entrada < "'.$salida.'" AND fecha_salida > "'.$entrada.'")))';;
        print json_encode(consulta($conn, $sql));
        //print json_encode($sombra);
    }


    // Bungalows
    if($opcion == '"4"'){ // Opcion 4 == Recoger la característica 1 de los bungalows, el número de habitaciones que no sean NULL.
        $sql = 'SELECT DISTINCT habitaciones FROM alojamiento WHERE habitaciones IS NOT NULL AND idAlojamiento NOT IN (SELECT idAlojamiento FROM servicio WHERE idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva IN (SELECT idReserva FROM reserva WHERE fecha_entrada < "'.$salida.'" AND fecha_salida > "'.$entrada.'")))';
        print json_encode(consulta($conn, $sql));
    }

    if($opcion == '"5"'){ // Opcion 5 == Recoger la característica 2 de los bungalows, el número máximo de personas que no sean NULL.
        $sql = 'SELECT DISTINCT maximo_personas FROM alojamiento WHERE maximo_personas IS NOT NULL AND habitaciones = '.$hab.' AND idAlojamiento NOT IN (SELECT idAlojamiento FROM servicio WHERE idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva IN (SELECT idReserva FROM reserva WHERE fecha_entrada < "'.$salida.'" AND fecha_salida > "'.$entrada.'")))';
        print json_encode(consulta($conn, $sql));
    }

    if($opcion == '"6"'){ // Opcion 6 == Recoger todos los servicios que en el idAlojamiento sean NULL.
        $sql = 'SELECT idServicio, nombre FROM servicio WHERE idAlojamiento IS NULL AND nombre != "Persona extra adulto" AND nombre != "Persona extra menor" AND nombre != "Persona extra mayor";';
        print json_encode(consulta($conn, $sql));
    }
    
    if($opcion == '"7"'){ // Opcion 7 == Recoger todos los servicios que en el idAlojamiento sean NULL.
        /* MEJORAR LA CONSULTA SQL */
        if($alojamiento == '"bungalow"'){
            // SQL PARA BUNGALOW
            $diff = date_diff($entrada, $salida);
            print json_encode($diff);
        }else if($alojamiento == '"parcela"'){

            
            // SQL PARA PARCELA BUSCAR idAlojamiento
            // SQL PARA BUSCAR TODOS LOS ID NECESARIOS PARA REALIZAR LA RESERVA
            print json_encode($nombreUsuario);
        }
        // $sql = "INSERT INTO reserva (fecha_entrada, fecha_salida, hora_entrada, hora_salida, idUsuario, num_personas, multiplicativo) VALUES($entrada, $salida, '12:00', '11:59', (SELECT idUsuario FROM usuario WHERE email = $email AND telefono = $telefono), $numPersonas, 1.00);";
        /*print json_encode(consulta($conn, $sql));*/
        
    }

    if($opcion == '"8"'){
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
?>