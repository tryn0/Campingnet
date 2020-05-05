<?php
    function conexion(){
        $servername = "localhost";
        $username   = "camping2";
        $password   = "CampingNetPI";
        $dbname     = "camping2";
        //Creacion de la conexion
        $conn = new mysqli($servername, $username, $password, $dbname);
        //Comprobación de la conexión
        if ($conn->connect_error) {
            die("La conexión ha fallado: " . $conn->connect_error);
        }
        //Devuelve la conexión lista para ser usada
        return $conn;
    }

    function consulta($conn, $sql){
        $resultado = mysqli_query($conn, $sql); // Hace la consulta
        $rows = array(); // Definiendo un array
        if ($resultado->num_rows > 0) { // Si la consulta devuelve resultado se guarda en el array
            while($row = $resultado->fetch_assoc()) {
                $rows[] = $row;
            }
            cerrar_conexion($conn);
            return $rows;
        }else{ // Sino devuelve resultado
            return 0;
        }
    }

    function cerrar_conexion($conn){ // Cerrar conexión
        return $conn -> close();
    }