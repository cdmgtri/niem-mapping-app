
import "@babel/polyfill";
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from "bootstrap-vue";

// TODO: Review how best to include these files
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "jquery";
import "bootstrap/dist/js/bootstrap.bundle";
import "./assets/styles/main.css";
import "./assets/styles/main.scss";
import "./assets/styles/navbar.css";
import store from './store'

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    store.dispatch("load");
  }
}).$mount('#app');
