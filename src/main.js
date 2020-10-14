import Vue from 'vue';
import App from './App.vue';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
import bulma from 'bulma/css/bulma.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretUp, faCaretDown, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

Vue.use(VueGoodTablePlugin, bulma, FontAwesomeIcon);
library.add(faCaretUp, faCaretDown, faExclamationTriangle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
