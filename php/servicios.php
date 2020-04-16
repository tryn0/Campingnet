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

    //Conexión a la base de datos
    require_once('bd.php');
    $conn = conexion();

    //Con la siguiente query se seleccionan todos los datos de la tabla alojamiento donde el tipo sea bungalow, con ORDER BY RAND() se selccionan aleatoriamente y LIMIT 5 un límite de 5 alojamientos.
    $sql = "SELECT idServicio, nombre, precio, idAlojamiento FROM servicio ORDER BY RAND() LIMIT 4;";
    print json_encode(consulta($conn, $sql));