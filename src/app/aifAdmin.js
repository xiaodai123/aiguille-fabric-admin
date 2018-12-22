import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);
require('~compIcon/iconfont.css');
require('~compCss/index');
import '~compJs/ajax';
import store from '@src/store';
import i18n from '@src/i18n';
import aifAdminRouterMap from '@src/router/aifAdmin';
import configRouter from '~compJs/permission';
// import '@src/mock';

const router = configRouter(store, aifAdminRouterMap);

let aifAdmin = new Vue({
    el: '#aifAdmin',
    data: {
    },
    router,
    store,
    i18n
});
