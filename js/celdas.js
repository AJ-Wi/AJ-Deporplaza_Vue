Vue.component("celda", {
  /*html*/
  template: `
    <div class="seccion" :id="coordenadas" :class="{'bg-positive': color, 'bg-negative': !color, 'inicio': inicio, 'centro': centro, 'fin': fin}" @click="bar = true">
        <div class="q-pa-md q-gutter-sm">
        <q-dialog v-model="bar" persistent transition-show="flip-down" transition-hide="flip-up">
          <q-card class="bg-primary text-white">
            <q-bar>
              <div>Realizar Reserva</div>
              <q-space ></q-space>
              <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
              </q-btn>
            </q-bar>
            <q-card-section>
              <form>
                <label>Nombre Cliente</label>
                <input type="text" v-model="nombre" name="nombre" placeholder="Nombre" required :disabled="disable">
                <label>Celular Cliente (Opcional)</label>
                <input type="text" v-model="celular" name="celular" placeholder="Celular" :disabled="disable">
                <div>
                <label>Tiempo de Reserva</label>                
                <select v-model.number="tiempo" required :disabled="disable">
                  <option disabled value="">Seleccione un Tiempo</option>
                  <option value="30">1/2 hora</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 1/2 hora</option>
                  <option value="120">2 horas</option>
                  <option value="150">2 1/2 horas</option>
                  <option value="180">3 horas</option>
                </select>  
                </div>
                <div>
                <label>Pago de Cancha (Opcional)</label>
                <input type="number" v-model.number="pago" name="pago" placeholder="Pago" :disabled="disable">
                </div>
                <q-btn v-if="mostrarBoton" @click="seleccionarCeldas" v-close-popup>{{labelBoton}}</q-btn>           
              </form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
    `,
  data() {
    return {
      nombre: "",
      celular: 0,
      tiempo: "",
      pago: 0,
      bar: false,
      color: true,
      inicio: false,
      centro: false,
      fin: false,
      labelBoton: "Reservar",
      coordenadainicio: this.coordenadas.slice(5),
      celdasReservadas: [],
      dateNow: store.state.dateNow,
      dateSelected: "",
      mostrarBoton: true,
      disable: false
    };
  },
  props: ["coordenadas"],
  methods: {
    seleccionarCeldas() {
      if (this.labelBoton === "Reservar") {
        let t = this.tiempo / 30;
        var posi = [
          this.coordenadainicio.slice(0, 1),
          this.coordenadainicio.slice(1)
        ];
        for (i = 0; i < t; i++) {
          var b = "celda" + posi[0] + (parseInt(posi[1]) + i);
          if (document.querySelector("#" + b + ".bg-negative")) {
            alert("Tiempo no disponible, seleccione otro Tiempo.");
            this.celdasReservadas = [];
            return false;
          } else {
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
        }
        let datos = new FormData();
        datos.append("accion", 2);
        datos.append("cliente", this.nombre);
        datos.append("telefono", this.celular);
        datos.append("fecha", this.dateSelected);
        datos.append("tiempo", this.tiempo);
        datos.append("pago", this.pago);
        datos.append("coordenadas", this.coordenadainicio);
        fetch("conexion/reservas.php", {
          method: "POST",
          body: datos
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data) {
              eventosGlobales.$emit("crear", [
                this.celdasReservadas,
                this.nombre,
                this.celular,
                this.tiempo,
                this.pago
              ]);
            } else {
              alert(
                "No se pudo guardar la reserva, por favor intente de nuevo."
              );
            }
          });
      } else {
        let datos = new FormData();
        datos.append("accion", 4);
        datos.append("fecha", this.dateSelected);
        datos.append("coordenadas", this.coordenadainicio);
        fetch("conexion/reservas.php", {
          method: "POST",
          body: datos
        })
          .then(res => res.json())
          .then(data => {
            if (data) {
              eventosGlobales.$emit("eliminar", this.celdasReservadas);
            } else {
              alert(
                "No se pudo eliminar la reserva, por favor intente de nuevo."
              );
            }
          });
      }
    },
    crearReserva(newValue) {
      for (cel of newValue[0]) {
        if (this.coordenadas === cel.slice(1)) {
          this.labelBoton = "Eliminar";
          this.color = false;
          if (cel.slice(0, 1) === "i") {
            this.inicio = true;
          }
          if (cel.slice(0, 1) === "c") {
            this.centro = true;
          }
          if (cel.slice(0, 1) === "f") {
            this.fin = true;
          }
          this.celdasReservadas = newValue[0];
          this.nombre = newValue[1];
          this.celular = newValue[2];
          this.tiempo = newValue[3];
          this.pago = newValue[4];
        }
      }
    },
    eliminarReserva(newValue) {
      for (cel of newValue) {
        if (this.coordenadas === cel.slice(1)) {
          limpiar();
        }
      }
    },
    dateSelect(newValue) {
      this.dateSelected = newValue;
      if (Date.parse(this.dateSelected) < Date.parse(this.dateNow)) {
        this.mostrarBoton = false;
        this.disable = true;
      } else {
        this.mostrarBoton = true;
        this.disable = false;
      }
    },
    limpiar() {
      this.labelBoton = "Reservar";
      this.color = true;
      this.inicio = false;
      this.centro = false;
      this.fin = false;
      this.celdasReservadas = [];
      this.nombre = "";
      this.celular = 0;
      this.tiempo = "";
      this.pago = 0;
    }
  },
  created() {
    eventosGlobales.$on("crear", this.crearReserva);
    eventosGlobales.$on("eliminar", this.eliminarReserva);
    eventosGlobales.$on("dateSelected", this.dateSelect);
    eventosGlobales.$on("limpiar", this.limpiar);
  }
});