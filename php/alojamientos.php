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
    require_once('conexion.php');
    $conn = conexion();

    $entrada = file_get_contents('php://input');
    $alojamiento = substr($entrada, 0, -1);
    //print json_encode($alojamiento);

    if($alojamiento == 'bungalow' || $alojamiento == 'parcela'){ // Si lo que entra al php es bungalow o parcela entonces realiza la busqueda por tipo de alojamiento

        $sql = "SELECT * FROM alojamiento WHERE tipo = '$alojamiento';";

        $resultado = mysqli_query($conn,$sql); 
        $alojamientos = array();
        $alojamientos2 = array();
        if ($resultado->num_rows > 0) {
            //Cada resultado se añade a la lista alojamientos y al salir del while se manda la lista en formato JSON para la app Angular
            while($row = $resultado->fetch_assoc()) {
                $alojamientos[] = $row;
            }
            $alojamientos2[$entrada] = $alojamientos;
            cerrar_conexion($conn);
            print json_encode($alojamientos2);
        }

    }else{ // Si entra en la URL con alojamiento sin parámetros
        $alojamientos = array();
        $bungalows = array();
        $parcelas = array();

        $sql = "SELECT * FROM alojamiento WHERE tipo = 'bungalow';";
        $sql2 = "SELECT * FROM alojamiento WHERE tipo = 'parcela';";

        $resultado = mysqli_query($conn,$sql);
        if ($resultado->num_rows > 0) {
            //Cada resultado se añade a la lista alojamientos y al salir del while se manda la lista en formato JSON para la app Angular
            while($row = $resultado->fetch_assoc()) {
                $bungalows[] = $row;
            }
            $alojamientos['bungalows'] = $bungalows;
        }

        $resultado = mysqli_query($conn,$sql2);
        if ($resultado->num_rows > 0) {
            //Cada resultado se añade a la lista alojamientos y al salir del while se manda la lista en formato JSON para la app Angular
            while($row = $resultado->fetch_assoc()) {
                $parcelas[] = $row;
            }
            $alojamientos['parcelas'] = $parcelas;
        }

        if(count($alojamientos) > 0){
            cerrar_conexion($conn);
            print json_encode($alojamientos);
        }else{
            cerrar_conexion($conn);
            print json_encode('Error');
        }
    }