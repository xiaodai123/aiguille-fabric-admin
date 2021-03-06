import constantRouterMap from '@src/router';
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.indexOf(role) >= 0 );
    } else {
        return true;
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 * @returns accessedRouters
 */
function fileAsyncRouter(asyncRouterMap, roles) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = fileAsyncRouter(route.children, roles);
            }
            return true;
        }
        return false;
    });
    return accessedRouters;
}

const permission = {
    namespaced: true,
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        generateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { asyncRouterMap } = data;
                // const { roles, asyncRouterMap } = data;
                // let accessedRouters;
                // if (roles.indexOf('admin') >= 0) {
                //     accessedRouters = asyncRouterMap;
                // } else {
                //     accessedRouters = fileAsyncRouter(asyncRouterMap, roles);
                // }
                commit('SET_ROUTERS', asyncRouterMap);
                resolve();
            })
        }
    }
}

export default permission