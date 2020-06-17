<?php

    /**
     * Archivo con funciones para la BD
     */

    /**
     * Función para crear la conexión con la BD
     * @return mysqli retorna la conexión a la BD a través de mysqli
     */
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

    /**
     * Función para consultar datos a la BD
     * @param mysqli $conn la conexión a la BD
     * @param string $sql consulta a hacer a la BD
     * @return array o int $rows o 0, retorna, si encuentra información un array con esa infromación, o sino, 0
     */
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

    /**
     * Función para insertar en la BD
     * @param mysqli $conn la conexión a la BD
     * @param string $sql consulta a hacer a la BD, en este caso es un insert
     * @return number o mysqli_error(), si la inserción ha sido exitosa, retorna 1 y sino pues el error que corresponda
     */
    function insert($conn, $sql){
        if(mysqli_query($conn, $sql)) {
            cerrar_conexion($conn);
            return 1;
        }else{
            cerrar_conexion($conn);
            return mysqli_error($conn);
        }
    }

    /**
     * Función para actualizar la BD, mismo código que update(), pero decidí separarlos por si fuese necesario modificar alguna de las 3 funciones
     * @param mysqli $conn conexión a la BD
     * @param string $sql consulta a la BD, en este caso es un update
     * @return int o mysqli_error(), si el update fue exitoso, devuelve 1, sino el correspondiente error
     */
    function update($conn, $sql){
        if(mysqli_query($conn, $sql)) {
            cerrar_conexion($conn);
            return 1;
        }else{
            cerrar_conexion($conn);
            return mysqli_error($conn);
        }
    }

    /**
     * Función para borrar de la BD
     * @param mysqli $conn conexión a la BD
     * @param string $sql consulta a la BD, este caso es un delete
     * @return int o mysqli_error(), retorna, si el delete fue exitoso 1, sino el correspondiente error
     */
    function delete($conn, $sql){ // Esta función, la de update y la de insert son iguales, pero quería tenerlas distinguidas insert, update y delete, separadas
        if(mysqli_query($conn, $sql)) {
            cerrar_conexion($conn);
            return 1;
        }else{
            cerrar_conexion($conn);
            return mysqli_error($conn);
        }
    }

    /**
     * Función para cerrar la conexión a la BD
     * @param mysqli $conn conexión a la BD
     * @return void, en el retorno cierra la conexión, no devuelve nada
     */
    function cerrar_conexion($conn){ // Cerrar conexión
        return $conn -> close();
    }