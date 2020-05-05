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

    //Con la siguiente query se seleccionan todos los datos de la tabla alojamiento donde el tipo sea parcela, con ORDER BY RAND() se selccionan aleatoriamente y LIMIT 5 un límite de 5 alojamientos.
    $sql = "SELECT idAlojamiento, tipo, sombra, dimension, numeroAlojamiento  FROM alojamiento WHERE tipo = 'parcela' ORDER BY RAND() LIMIT 5;";
    $resultado = mysqli_query($conn,$sql); 
    $parcelas = array();
    if ($resultado->num_rows > 0) {
        //Cada resultado se añade a la lista parcelas y al salir del while se manda la lista en formato JSON para la app Angular
        while($row = $resultado->fetch_assoc()) {
            $parcelas[] = $row;
        }
        print json_encode($parcelas);
    }