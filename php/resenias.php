<?php
    // Para evitar error XMLHttpRequest en Angular
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Allow: GET, POST, OPTIONS, PUT, DELETE");
    $method = $_SERVER['REQUEST_METHOD'];
    if($method == "OPTIONS") {
        die();
    }

    // Conexión a la base de datos
    require_once('bd.php');
    $conn = conexion();
    $opcion = json_encode($_POST['opcion']);

    if ($opcion == '"1"') { // Obtener todas las reseñas publicadas
        $idAlojamiento = json_encode($_POST['idAlojamiento']);
        $sql = "SELECT * FROM resenia WHERE publicado = 1 AND idResenia IN (SELECT idResenia FROM resenias WHERE idAlojamiento = $idAlojamiento)";
        print json_encode(consulta($conn, $sql));
    }else if ($opcion == '"2"') { // Obtener los datos del usuario de la reseña
        $idUsuario = json_encode($_POST['idUsuario']);
        $sql = "SELECT alias_usuario FROM usuario WHERE idUsuario = $idUsuario";
        print json_encode(consulta($conn, $sql));
    }else if($opcion == '"3"') { // Inserción de reseña
        $idUsuario = substr(json_encode($_POST['idUsuario']),1,-1);
        $idAlojamiento = json_encode($_POST['idAlojamiento']);
        $comentario = json_encode($_POST['comentario']);
        $anonimo = substr(json_encode($_POST['anonimo']),1,-1);
        $puntuacion = substr(json_encode($_POST['puntuacion']),1,-1);

        $sql = "INSERT INTO resenia (comentario, puntuacion, publicado, anonimo, idUsuario) VALUES ($comentario, $puntuacion, 0, $anonimo, $idUsuario)";
        $resenia = insert($conn, $sql);

        $conn = conexion();
        $sql2 = "SELECT idResenia FROM resenia WHERE comentario = $comentario AND puntuacion = $puntuacion AND anonimo = $anonimo AND idUsuario = $idUsuario";
        $idResenia = consulta($conn, $sql2)[0]['idResenia'];

        $conn = conexion();
        $sql3 = "INSERT INTO resenias (idResenia, idAlojamiento) VALUES ($idResenia, $idAlojamiento)";
        print json_encode(insert($conn, $sql3));
    }
