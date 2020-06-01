<?php
    function conexion(){
        $servername = "localhost";
        $username   = "camping";
        $password   = "CampingNetPI";
        $dbname     = "camping";
        //Creacion de la conexion
        $conn = new mysqli($servername, $username, $password, $dbname);
	$conn->set_charset("utf8");
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
            cerrar_conexion($conn);
            return 0;
        }
    }

    function insert($conn, $sql){
        if(mysqli_query($conn, $sql)) {
            cerrar_conexion($conn);
            return 1;
        }else{
            cerrar_conexion($conn);
            return mysqli_error($conn);
        }
    }

    function update($conn, $sql){
        if(mysqli_query($conn, $sql)) {
            cerrar_conexion($conn);
            return 1;
        }else{
            cerrar_conexion($conn);
            return mysqli_error($conn);
        }
    }

    function delete($conn, $sql){ // Esta función, la de update y la de insert son iguales, pero quería tenerlas distinguidas insert, update y delete, separadas
        if(mysqli_query($conn, $sql)) {
            cerrar_conexion($conn);
            return 1;
        }else{
            cerrar_conexion($conn);
            return mysqli_error($conn);
        }
    }

    function cerrar_conexion($conn){ // Cerrar conexión
        return $conn -> close();
    }
