require('@js/bootstrap')

import Vue   from 'vue';
import store from '@vue/store/index.js';

global.axios = require('axios');

Vue.component('the-container', require('@vue/the-container.vue'));

new Vue({
	el: '#app-wrapper',
	store
});