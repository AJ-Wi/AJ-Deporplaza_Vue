Vue.component("acceso", {
  /*html*/
  template: `
    <div id="acceso">
        <h1>Iniciar sesión</h1>
        <div id="inp">
            <input type="text" v-model="usuario" name="usuario" placeholder="Usuario" required>
            <input type="password" v-model="clave" name="clave" @keyup.enter="login" placeholder="Contraseña" required>
        </div>
        <div id="btn">
            <button @click="login">Entrar</button>
        </div>
    </div>
    `,
  data() {
    return {
      usuario: "",
      clave: ""
    };
  },
  methods: {
    login() {
      let datos = new FormData();
      datos.append("usuario", this.usuario);
      datos.append("clave", this.clave);
      fetch("conexion/login.php", {
        method: "POST",
        body: datos
      })
        .then(res => res.json())
        .then(data => {
          if (data) {
            window.location.href = "reservas.html";
          } else {
            alert("Error de acceso, intente nuevamente.");
            this.usuario = "";
            this.clave = "";
          }
        });
    }
  }
});