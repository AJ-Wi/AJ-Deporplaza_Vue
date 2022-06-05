<?php

require 'conexion.php';

$usuario = isset($_POST["usuario"]) ? mysqli_real_escape_string($mysqli, $_POST["usuario"]) : null;
$clave = isset($_POST["clave"]) ? mysqli_real_escape_string($mysqli, $_POST["clave"]) : null;

if ($usuario){
    $sql_select = "SELECT usuario, clave FROM usuarios WHERE usuario='$usuario'";
    $query_select = $mysqli->query($sql_select);

    if(($query_select->num_rows) == 0){
        echo json_encode(false);
    }else{
        while ($fila = $query_select->fetch_row()) {		
            if ($clave == $fila[1]){
                echo json_encode(true);
            }else{
                echo json_encode(false);
            }
        }
    }
}else{
    echo json_encode(false);
}

?>