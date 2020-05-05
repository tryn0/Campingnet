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

    // ID Alojamiento

    $id = intval(substr(json_encode($_POST['numero']), 1, -1));
    $sql = "SELECT * FROM resenia WHERE idResenia IN (SELECT idResenia FROM resenias WHERE idAlojamiento = $id)";
    print json_encode(consulta($conn, $sql));