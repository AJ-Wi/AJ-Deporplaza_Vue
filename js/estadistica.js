Vue.component("grafico", {
  /*html*/
  template: `
    <div id="graficos">
        <canvas id="grafico" width="400" height="400"></canvas>
    </div>
    `,
  data() {
    return {
      data: [0, 0, 0, 0, 0, 0, 0],
      count: [0, 0, 0, 0, 0, 0, 0]
    };
  },
  methods: {
    crearGrafico() {
      Chart.platform.disableCSSInjection = true;
      var ctx = document.getElementById("grafico");
      var grafico = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "Domingo",
            "Lunes",
            "Martes",
            "Miercoles",
            "Jueves",
            "Viernes",
            "Sabado"
          ],
          datasets: [
            {
              label: "N° de Reservas",
              data: this.data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 200, 30, 0.2)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 200, 30, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    },
    cargar() {
      var datos = new FormData();
      datos.append("accion", "fechas");
      fetch("conexion/reservas.php", {
        method: "POST",
        body: datos
      })
        .then(res => res.json())
        .then(dates => {
          var actual = "";
          for (date of dates) {
            this.data[date.dia - 1] += parseInt(date.cantidad);
            this.count[date.dia - 1] += 1;
          }
          for (i = 0; i < 7; i++) {
            if (this.data[i] != 0) {
              this.data[i] = this.data[i] / this.count[i];
            }
          }
          this.crearGrafico();
        });
    }
    /*Pepe(f){
            return new Date(f).toISOString().substr(0, 10).split("-").reverse().join("-");
        }*/
  },
  created() {
    this.cargar();
  }
});