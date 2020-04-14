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

    require_once('conexion.php');
    $conn = conexion();

    //Información enviada a través de POST desde el formulario de la app Angular
    $email = json_encode($_POST['email']);
    $pwd = json_encode(md5($_POST['password']));

    if(!empty($email) && !empty($pwd)){
        $sql = "SELECT * FROM usuario where email = $email and passwd = $pwd ;";
        $resultado = mysqli_query($conn,$sql); 
        $rows = array();
        if ($resultado->num_rows > 0) {
            while($row = $resultado->fetch_assoc()) {
                $rows[] = $row;
            }
            cerrar_conexion($conn);
            print json_encode($rows);
        }else{
            cerrar_conexion($conn);
            print json_encode(null);
        }
    }
?>