import Vue from 'vue';
import { $v, PromptBox, ObjPublic } from '~compJs/public';
import axios from 'axios';
export const userInfo = JSON.parse(window.sessionStorage.getItem('UINFO'));
Vue.use({
    install(Vue) {
        // 获取用户信息方法
        Vue.prototype.$getUserInfo = function() {
            return userInfo || {};
        }
        // 提示框方法
        Vue.prototype.PromptBox = PromptBox;
        Vue.prototype.$box = PromptBox.common;
        Vue.prototype.ObjPublic = ObjPublic;
        // ajax请求方法
        Vue.prototype.$v = $v;
        Vue.prototype.$get = function(...arg) {
            $v.get.apply(this, arg);
        }
        Vue.prototype.$delete = function(...arg) {
            $v.delete.apply(this, arg);
        }
        Vue.prototype.$post = function(...arg) {
            $v.post.apply(this, arg);
        }
        Vue.prototype.$put = function(...arg) {
            $v.put.apply(this, arg);
        }
        Vue.prototype.$axios = axios;
    }
})
/*
export default {
    install(Vue) {
        Vue.prototype.$v = $v;
        Vue.prototype.$get = function(...arg) {
            $v.get.apply(this, arg);
        }
        Vue.prototype.$delete = function(...arg) {
            $v.delete.apply(this, arg);
        }
        Vue.prototype.$post = function(...arg) {
            $v.post.apply(this, arg);
        }
        Vue.prototype.$put = function(...arg) {
            $v.put.apply(this, arg);
        }
        Vue.prototype.$axios = axios;
    }
}
*/