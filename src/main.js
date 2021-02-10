import Vue from 'vue';
import App from './App.vue';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
import bulma from 'bulma/css/bulma.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretUp,
  faCaretDown,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import BuOptionControl from './components/BuOptionControl.vue';
import EmailSearchControl from './components/EmailSearchControl.vue';
import DateControl from './components/DateControl.vue';

Vue.use(VueGoodTablePlugin, bulma, FontAwesomeIcon);
library.add(faCaretUp, faCaretDown, faExclamationTriangle);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('bu-option-control', BuOptionControl);
Vue.component('email-search-control', EmailSearchControl);
Vue.component('date-control', DateControl);

Vue.config.productionTip = false;

Vue.prototype.$apiVersion = '9.1';

new Vue({
  render: h => h(App),
}).$mount('#app');
