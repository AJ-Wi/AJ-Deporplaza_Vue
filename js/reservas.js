

Vue.component("reservas", {
  /*html*/
  template: `
    <div class="contenedor">
        <div class="fila">
        <input type="date" id="fecha" name="fecha" v-model="dateNow" @change="cargarporFecha(dateNow)">
        </div>
        <div class="titulo bg-primary text-white">
            <label></label>
        </div>
        <div class="titulo bg-primary text-white" v-for="i in 6">
            <label>{{i}}</label>
        </div>
        <div class="fila" v-for="i in 14">
            <div class="hora bg-primary text-white" :class="{par: i%2 === 0, impar: i%2 != 0}">
                <label v-if="i%2 != 0">{{horas[i]}}:00</label>
                <label v-if="i%2 === 0">&nbsp;</label>
            </div>
            <celda v-bind:coordenadas="cel.concat(a,i)" v-for="a in 6" :key="cel.concat(a,i)"></celda>
        </div>
    </div>
    `,
  data() {
    return {
      color: true,
      horas: [0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10],
      cel: "celda",
      celdasReservadas: [],
      dateNow: store.state.dateNow
    };
  },
  methods: {
    cargarporFecha(date) {
      eventosGlobales.$emit("limpiar");
      let datos = new FormData();
      datos.append("accion", 1);
      datos.append("fecha", date);
      fetch("conexion/reservas.php", {
        method: "POST",
        body: datos
      })
        .then(res => res.json())
        .then(data => {
          for (cel of data) {
            let t = cel.tiempo / 30;
            var posi = [cel.coordenadas.slice(0, 1), cel.coordenadas.slice(1)];
            for (i = 0; i < t; i++) {
              var b = "celda" + posi[0] + (parseInt(posi[1]) + i);
              let estilo = "";
              if (t === 1) {
                estilo = "n";
              }
              if (t > 1 && i === 0) {
                estilo = "i";
              }
              if (t > 1 && i < t && i > 0) {
                estilo = "c";
              }
              if (t > 1 && i === t - 1) {
                estilo = "f";
              }
              let c = estilo + b;
              this.celdasReservadas.push(c);
            }
            eventosGlobales.$emit("crear", [
              this.celdasReservadas,
              cel.cliente,
              cel.telefono,
              cel.tiempo,
              cel.pago
            ]);
            this.celdasReservadas = [];
          }
        });
      eventosGlobales.$emit("dateSelected", this.dateNow);
    }
  },
  created() {
    this.cargarporFecha(this.dateNow);
  }
});