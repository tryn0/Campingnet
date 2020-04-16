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
    //print json_encode($opcion);

    if($opcion == '"1"'){
        $sql = "SELECT DISTINCT tipo FROM alojamiento;";
        print json_encode(consulta($conn, $sql));
    }

    if($opcion == '"2"'){
        $sql = "SELECT DISTINCT sombra FROM alojamiento WHERE sombra IS NOT NULL;";
        print json_encode(consulta($conn, $sql));
    }

    if($opcion == '"3"'){
        $sql = "SELECT DISTINCT habitaciones FROM alojamiento WHERE habitaciones IS NOT NULL;";
        print json_encode(consulta($conn, $sql));
    }
    

?>
