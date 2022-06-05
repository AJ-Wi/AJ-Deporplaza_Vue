const eventosGlobales = new Vue();

const store = new Vuex.Store({
  state: {
    dateNow: new Date().toISOString().substr(0, 10)
  },
  mutations: {}
});