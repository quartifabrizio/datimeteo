import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
//import { useDisplay } from 'vuetify';
//import Hls from 'hls.js';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
app.use(VueApexCharts);

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(router).use(vuetify).mount('#app')
