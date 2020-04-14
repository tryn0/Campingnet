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
    $alias = json_encode($_POST['alias']);
    $dni = json_encode($_POST['dni']);
    $nombre = json_encode($_POST['nombre_usuario']);
    $telefono = json_encode($_POST['telefono']);
    $email = json_encode($_POST['email']);
    $pwd = json_encode(md5($_POST['password']));

    $rol = 'cliente';
    

    if(!empty($dni) && !empty($nombre) && !empty($telefono) && !empty($email) && !empty($pwd) && !empty($alias)){
        $sql = "SELECT * FROM usuario where email = $email;";
        $resultado = mysqli_query($conn,$sql); 
        if ($resultado->num_rows > 0) {
            print json_encode('email');
        }else{
            $sql2 = "SELECT * FROM usuario where  nif_usuario = $dni;";
            $resultado2 = mysqli_query($conn,$sql2); 
            if ($resultado2->num_rows > 0) {
                print json_encode('dni');
            }else{
                $sql3 = "SELECT * FROM usuario where alias_usuario = $alias;";
                $resultado3 = mysqli_query($conn,$sql3); 
                if ($resultado3->num_rows > 0) {
                    print json_encode('alias');
                }else{
                    $sql4 = "INSERT INTO usuario (nif_usuario, nombre_usuario, telefono, email, rol, passwd, alias_usuario) VALUES ($dni, $nombre, $telefono, $email, '$rol', $pwd, $alias)";
                    $resultado4 = mysqli_query($conn, $sql4);
                    if($resultado4){
                        cerrar_conexion($conn);
                        print json_encode('registrado');
                    }else{
                        cerrar_conexion($conn);
                        print json_encode('error');
                    }
                }
            }       
        }
    }
?>
