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

    $idUsuario = substr(json_encode($_POST['idUsuario']),1,-1);
    $hoy = date('Y-m-d');

    $sql = "SELECT * FROM reserva WHERE idUsuario = $idUsuario";
    //$sql = "SELECT * FROM reserva WHERE idUsuario = $idUsuario AND fecha_entrada > '$hoy'";
    $reservas = consulta($conn, $sql);

    for ($i=0; $i < count($reservas); $i++) {
        $conn = conexion();
        $idReserva = $reservas[$i]['idReserva'];

        $sql = "SELECT * FROM servicio WHERE idAlojamiento IS NULL AND idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva = $idReserva)";
        $serviciosExtras = consulta($conn, $sql);

        if($serviciosExtras != null && $serviciosExtras != 0) {
            $reservas[$i]['serviciosExtras'] = $serviciosExtras;
            for ($x=0; $x < count($reservas[$i]['serviciosExtras']); $x++) {
                $idServicio = $reservas[$i]['serviciosExtras'][$x]['idServicio'];
                $conn = conexion();
                $sql = "SELECT cantidad FROM servicios_reserva WHERE idReserva = $idReserva AND idServicio = $idServicio";
                $cantidad = consulta($conn, $sql)[0]['cantidad'];
                $reservas[$i]['serviciosExtras'][$x]['cantidad'] = $cantidad;
            }
        }

        $conn = conexion();
        $sql = "SELECT * FROM servicio WHERE idAlojamiento IS NOT NULL AND idServicio IN (SELECT idServicio FROM servicios_reserva WHERE idReserva = $idReserva)";
        $idAlojamiento = consulta($conn, $sql)[0]['idAlojamiento'];

        $conn = conexion();
        $sql = "SELECT * FROM alojamiento WHERE idAlojamiento = $idAlojamiento";
        $caracteristicas = consulta($conn, $sql)[0];
        $reservas[$i]['caracteristicas'] = $caracteristicas;

        $conn = conexion();
        $sql = "SELECT precio FROM servicio WHERE idAlojamiento = $idAlojamiento";
        $precioAlojamiento = consulta($conn, $sql)[0]['precio'];
        $reservas[$i]['precioAlojamiento'] = $precioAlojamiento;
    }

    print json_encode($reservas);