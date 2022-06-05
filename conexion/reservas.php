<?php
    require "conexion.php";

    $accion = isset($_POST['accion'])? mysqli_real_escape_string($mysqli, $_POST['accion']) : null;
    $id = isset($_POST['id'])? mysqli_real_escape_string($mysqli, $_POST['id']) : null;
    $cliente = isset($_POST['cliente'])? mysqli_real_escape_string($mysqli, $_POST['cliente']) : null;
    $telefono = isset($_POST['telefono'])? mysqli_real_escape_string($mysqli, $_POST['telefono']) : null;
    $fecha = isset($_POST['fecha'])? mysqli_real_escape_string($mysqli, $_POST['fecha']) : null;
    $tiempo = isset($_POST['tiempo'])? mysqli_real_escape_string($mysqli, $_POST['tiempo']) : null;
    $pago = isset($_POST['pago'])? mysqli_real_escape_string($mysqli, $_POST['pago']) : null;
    $coordenadas = isset($_POST['coordenadas'])? mysqli_real_escape_string($mysqli, $_POST['coordenadas']) : null;
    
    // READ: Leer las Fechas de la base de datos
    if($accion == "fechas"){
      //$sql = "SELECT fecha FROM reservas ORDER BY fecha";
      $sql = "SELECT COUNT(fecha) AS cantidad, DAYOFWEEK(fecha) AS dia FROM reservas WHERE DAYOFWEEK(fecha) GROUP BY fecha";
      $query = $mysqli->query($sql);        
      $datos = array();
      while($resultado = $query->fetch_assoc()) {
        $datos[] = $resultado;
      }        
      echo json_encode($datos);
      exit;
    }

    // READ: Leer los registros de la base de datos
    if($accion == 1){
      $sql = "SELECT * FROM reservas WHERE fecha='$fecha'";
      $query = $mysqli->query($sql);        
      $datos = array();
      while($resultado = $query->fetch_assoc()) {
        $datos[] = $resultado;
      }        
      echo json_encode($datos);
      exit;
    }

    // CREATE: Insertar registro en la base de datos
    if($accion == 2) {
        $sql = "INSERT INTO reservas(cliente, telefono, fecha, tiempo, pago, coordenadas) VALUES('$cliente', '$telefono', '$fecha', '$tiempo', '$pago', '$coordenadas')";
    }

    // UPDATE: Actualizar el registro de la base de datos
    if($accion == 3) {
      $sql = "UPDATE reservas SET cliente='$cliente', telefono='$telefono', fecha='$fecha', tiempo='$tiempo', pago='$pago', coordenadas='$coordenadas' WHERE id='$id'";
    }

    // DELETE: Borrar registro de la base de datos
    if($accion == 4) {
      $sql = "DELETE FROM reservas WHERE coordenadas='$coordenadas' AND fecha='$fecha'";
    }

    if($mysqli->query($sql) === TRUE) {
      echo json_encode(true);
      exit;
    } else {
      echo json_encode(false);
      exit;
    }  

?>