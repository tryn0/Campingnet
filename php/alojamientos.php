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

    // Tipo de alojamiento
    $alojamiento = substr(json_encode($_POST['alojamiento']), 1, -2);

    // ID del alojamiento y conversión a INT
    $numero = intval(substr(json_encode($_POST['numero']), 1, -1));

    

    //print json_encode($numero);

    if($alojamiento == 'bungalow' || $alojamiento == 'parcela'){ // Si lo que entra al php es bungalow o parcela entonces realiza la busqueda por tipo de alojamiento

        if($numero !== 0){ // Si entra con URL /alojamiento/(bungalows o parcelas)/numeroAlojamiento
            $sql = "SELECT * FROM alojamiento WHERE tipo = '$alojamiento' AND numeroAlojamiento = $numero;";
            print json_encode(consulta($conn, $sql));

        }else{ // Si entra con URL /alojamiento(bungalows o parcelas)
            $sql = "SELECT * FROM alojamiento WHERE tipo = '$alojamiento';";
            print json_encode(consulta($conn, $sql));
        }

        

    }else{ // Si entra en la URL con alojamiento sin parámetros
        $alojamientos = array();
        $bungalows = array();
        $parcelas = array();

        // Select de los bungalows
        $sql = "SELECT * FROM alojamiento WHERE tipo = 'bungalow';";
        
        $resultado = mysqli_query($conn,$sql);
        if ($resultado->num_rows > 0) {
            // Cada resultado se añade a la lista alojamientos y al salir del while se manda la lista en formato JSON para la app Angular
            while($row = $resultado->fetch_assoc()) {
                $bungalows[] = $row;
            }
            $alojamientos['bungalows'] = $bungalows;
        }

        // Select de las parcelas
        $sql2 = "SELECT * FROM alojamiento WHERE tipo = 'parcela';";

        $resultado = mysqli_query($conn,$sql2);
        if ($resultado->num_rows > 0) {
            // Cada resultado se añade a la lista alojamientos y al salir del while se manda la lista en formato JSON para la app Angular
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