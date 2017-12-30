import Vue        from 'vue';
import Vuex       from 'vuex';

import guix      from '@store/guix';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    modules: {
    	guix,
    },
});
