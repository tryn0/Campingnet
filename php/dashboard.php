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
        $sql = "SELECT COUNT(*) FROM reserva WHERE fecha_entrada = $hoy";
        print json_encode(consulta($conn, $sql));
    }

    // Salidas del camping
    if($opcion == '"2"'){
        $hoy = date('Y-m-d');
        $sql = "SELECT COUNT(*) FROM reserva WHERE fecha_salida = $hoy";
        print json_encode(consulta($conn, $sql));
    }

    // Resenias por revisar
    if($opcion == '"3"'){
        $sql = "SELECT COUNT(*) FROM resenia WHERE publicado = 0";
        print json_encode(consulta($conn, $sql));
    }

    // Últimas 10 reservas
    if($opcion == '"4"'){
        $sql = "SELECT * FROM reserva ORDER BY idReserva DESC LIMIT 10";
        print json_encode(consulta($conn, $sql));
    }
?>