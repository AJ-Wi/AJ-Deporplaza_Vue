<?php
    require "conexion.php";

    $request = isset($_POST['request'])? $_POST['request'] : null;
    $id = isset($_POST['id'])? $_POST['id'] : null;
    $nombre = isset($_POST['nombre'])? $_POST['nombre'] : null;
    $usuario = isset($_POST['usuario'])? $_POST['usuario'] : null;
    $clave = isset($_POST['clave'])? $_POST['clave'] : null;
    
    // READ: Leer los registros de la base de datos
    if($request == 1){

      $sql = "SELECT id, nombre, usuario, clave FROM usuarios";
      $query = $mysqli->query($sql);
        
      $datos = array();
      while($resultado = $query->fetch_assoc()) {
        $datos[] = $resultado;
      }        
      echo json_encode($datos);
      exit;
    }

    // CREATE: Insertar registro en la base de datos
    if($request == 2) {

      $sql_select = "SELECT usuario FROM usuarios WHERE usuario='$usuario'";
      $query_select = $mysqli->query($sql_select);

      if(($query_select->num_rows) == 0) {
        $sql_insert = "INSERT INTO usuarios(nombre, usuario, clave) VALUES('$nombre', '$usuario', '$clave')";
        if($mysqli->query($sql_insert) === TRUE) {
          echo json_encode("Se registro exitosamente.");
        } else {
          echo json_encode("Ocurrio un problema.");
        }
      } else {
        echo json_encode("El Usuario ya existe, intente un nuevo Usuario.");
      }
      exit;
    }

    // UPDATE: Actualizar el registro de la base de datos
    if($request == 3) {

      $sql_edit = "UPDATE usuarios SET nombre='$nombre', usuario='$usuario', clave='$clave' WHERE id='$id'";
      $query_update = $mysqli->query($sql_edit);

      echo json_encode("Se actualizo el registro.");
      exit;
    }

    // DELETE: Borrar registro de la base de datos
    if($request == 4) {

      $sql_delete = "DELETE FROM usuarios WHERE id='$id'";
      $query_delete = $mysqli->query($sql_delete);

      echo json_encode("Registro eliminado.");
      exit;
    }

?>
