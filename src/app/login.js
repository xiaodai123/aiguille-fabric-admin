require('~compIcon/iconfont.css');
require('~compCss/login');

import Vue from 'vue';
import i18n from '@src/i18n';
import store from '@src/store';
import '~compJs/ajax';
// import '@src/mock';
import { Input, Button, FormItem, Form, Row, Col, Message } from 'element-ui';
// import $v from '~compJs/ajax';
import { Session } from '~compJs/public';
import { AIGUILLE_FABRIC } from '~compJs/const';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const router = new VueRouter({
    routes: []
})

router.beforeEach((to, from, next) => {
    let userInfo = Session.get('UINFO');
    if (userInfo) {
        window.location.href = 'aifAdmin.html';
    } else {
        next();
    }
})

Vue.use(Input);
Vue.use(Button);
Vue.use(FormItem);
Vue.use(Form);
Vue.use(Row);
Vue.use(Col);
const checkPassword = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入密码'));
    } else {
        callback();
    }
}
const checkUserName = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入用户名'));
    } else {
        callback();
    }
}
let login = new Vue({
    el: '#login',
    data: {
        loginFrom: {
            username: '',
            password: ''
        },
        passwordType: 'password',
        loginRules: {
            password: [{ required: true, trigger: 'blur', validator: checkPassword }],
            username: [{ required: true, trigger: 'blur', validator: checkUserName }]
        },
        loading: false
    },
    methods: {
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    let loginFrom = JSON.parse(JSON.stringify(this.loginFrom));
                    // Session.set('UINFO', JSON.stringify(this.loginFrom));
                    // this.loading = false;
                    // window.location.href = 'aifAdmin.html';
                    this.$get(AIGUILLE_FABRIC + '/login/userLogin', loginFrom, data => {
                        if (data.code === '0000') {
                            Session.set('UINFO', JSON.stringify(this.loginFrom));
                            this.loading = false;
                            window.location.href = 'aifAdmin.html';
                        } else {
                            this.loading = false;
                            Message.error(data.message);
                        }
                    }, error => {
                        console.log(error);
                        this.loading = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false
                }
            })
        },
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
        }
    },
    i18n,
    store,
    router
})
