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

    // Conexión a la base de datos
    require_once('bd.php');
    $conn = conexion();


    // Variables pasadas desde la web app de Angular
    $telefono = json_encode($_POST['telefono']);
    $telefono = intval(substr($telefono, 1, -1));

    $email = json_encode($_POST['email']);

    $pwd = json_encode($_POST['password']);
    $pwd = md5($pwd);

    $id = json_encode($_POST['id']);
    $id = intval(substr($id, 1, -1));


    //print json_encode($email);

    // Comprobar que el teléfono no está ya en uso
    $sqlVerTel = "SELECT * FROM usuario WHERE telefono = $telefono ;";
    $resultadoVerTel = mysqli_query($conn,$sqlVerTel); 
    if ($resultadoVerTel->num_rows > 0) { // Si existe algún usuario con el teléfono 

        cerrar_conexion($conn);
        print json_encode(0); // Muestra error 0

    }else{ // Si el teléfono no está en uso

        // Comprobar que el email no está ya en uso
        $sqlVerEmail = "SELECT * FROM usuario WHERE email = $email;";
        $resultadoVerEmail = mysqli_query($conn,$sqlVerEmail); 
        if ($resultadoVerEmail->num_rows > 0) { // Si existe algún usuario con el email

            cerrar_conexion($conn);
            print json_encode(1); // Muestra error 1

        }else{
            // Contadores de entrada
            $i = 0;
            $a = 0;

            // Creación del UPDATE solo con los campos modificados
            $sql = "UPDATE usuario SET ";
            if($telefono != '"null"'){ // Si hay telefono modificado
                $i++;
                $sql .= "telefono = $telefono";
            }
            if($email != '"null"'){ // Si hay email modificado
                $a++;
                if($i === 1){
                    $sql .= ', ';
                }
                $sql .= "email = $email";
            }
            if($pwd != '"null"'){ // Si hay contraseña modificada
                if($i === 1 || $a === 1){
                    $sql .= ', ';
                }
                $sql .= "passwd = '$pwd'";
            }


            $sql .= " WHERE idUsuario = $id;";

            //print json_encode($sql);

            $resultado = mysqli_query($conn,$sql); 
            if ($resultado) { // Si se ha actualizado el usuario

                /*cerrar_conexion($conn);
                print json_encode('Actualizado');*/

                // recojo los nuevos datos para actualizarlos en la webapp de Angular
                $sqlFinal = "SELECT * FROM usuario WHERE idUsuario = $id;"; 
                $resultadoFinal = mysqli_query($conn,$sqlFinal);
                $rows = array();
                if ($resultadoFinal->num_rows > 0) {
                    while($row = $resultadoFinal->fetch_assoc()) {
                        $rows[] = $row;
                    }
                    cerrar_conexion($conn);
                    print json_encode($rows);
                }else{
                    cerrar_conexion($conn);
                print json_encode('Error');
                }
            }else{
                cerrar_conexion($conn);
                print json_encode('Error');
            }
        }
        
        
    }

    