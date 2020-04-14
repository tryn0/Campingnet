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
        //Devuelve la conexión (para ser usada)
        return $conn;
    }

    function cerrar_conexion($conn){
        return $conn -> close();
    }