<?php
    // Variables de la conexion a la DB
    $mysqli = new mysqli("remotemysql.com:3306","F4Kg0Rawf6","ek2O82DXEt","F4Kg0Rawf6");
    
    // Comprobamos la conexion
    if($mysqli->connect_errno) {
        die("Fallo la conexion");
    } else {
        //echo "Conexion exitosa";
    }
    
?>
