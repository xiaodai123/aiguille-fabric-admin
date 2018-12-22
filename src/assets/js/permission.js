import routes from '@src/router';
import VueRouter from 'vue-router';
import Vue from 'vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Session } from '~compJs/public';

NProgress.configure({ showSpinner: false });

// function hasPermission(roles, permissionRoles) {
//     if (roles.indexOf('admin') >= 0) return true;
//     if (!permissionRoles) return true;
//     return roles.some(role => permissionRoles.indexOf(role) >= 0);
// }
// const whiteList = ['/login', '/authredirect'];

Vue.use(VueRouter);

// 创建路由
const router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes
})

function configRouter(store, asyncRouterMap) {
    router.beforeEach((to, from, next) => {
        NProgress.start();// start progress bar
        let userInfo = Session.get('UINFO') || '';
        if (userInfo === '') {
            next(false);
            NProgress.done();
            window.location.href = 'login.html';
        } else {
            if (!store.getters.geti) {
                store.dispatch('auth/setUserInfo', JSON.parse(userInfo));
                store.dispatch('permission/generateRoutes', { asyncRouterMap }).then(() => {
                    // 动态添加可访问路由表
                    router.addRoutes(store.getters.addRouters);
                    store.dispatch('auth/setGeti', true);
                    // hack方法 确保addRoutes已完成 ,set the replace: true so the navugation will not leave a history record
                    next({ ...to, replace: true });
                });
                // NProgress.done();
                next();
            }
            next();
        }
    });
    router.afterEach(() => {
        NProgress.done();// finish progress bar
    });
    return router;
}

export default configRouter;
