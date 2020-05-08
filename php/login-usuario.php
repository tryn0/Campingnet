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
    $email = json_encode($_POST['email']);
    $pwd = json_encode(md5($_POST['password']));

    if(!empty($email) && !empty($pwd)){
        $sql = "SELECT * FROM usuario WHERE email = $email AND passwd = $pwd ;";
        print json_encode(consulta($conn, $sql));
    }
?>