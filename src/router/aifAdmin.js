import Layout from './../components/common/layout/Layout';
const routes = [
    {
        path: '/chainNetConfig',
        component: Layout,
        redirect: 'noredirect',
        // alwaysShow: true, // will always show the root menu
        meta: {
            roles: ['admin', 'editor'], // you can set roles in root nav
            icon: 'wangluo',
            title: '区块链网络配置'
        },
        children: [
            {
                path: 'ca',
                name: 'CA管理',
                component: () => import ( /* webpackChunkName: "test1" */ '@src/pages/chainNetConfig/CaManage'),
                meta: {
                    roles: ['admin', 'editor'],
                    icon: 'yingyong',
                    title: 'CA管理'
                }
            },
            {
                path: 'orderer',
                name: 'Orderer管理',
                component: () => import ( /* webpackChunkName: "test1" */ '@src/pages/chainNetConfig/OrdererManage'),
                meta: {
                    roles: ['admin', 'editor'],
                    icon: 'yingyong',
                    title: 'Orderer管理'
                }
            },
            {
                path: 'organization',
                name: 'Organization管理',
                component: () => import ( /* webpackChunkName: "test1" */ '@src/pages/chainNetConfig/OrganizationManage'),
                meta: {
                    roles: ['admin', 'editor'],
                    icon: 'yingyong',
                    title: 'Organization管理'
                }
            },
            {
                path: 'peer',
                name: 'Peer管理',
                component: () => import ( /* webpackChunkName: "test1" */ '@src/pages/chainNetConfig/PeerManage'),
                meta: {
                    roles: ['admin', 'editor'],
                    icon: 'yingyong',
                    title: 'Peer管理'
                }
            }
        ]
    },
    {
        path: '/channel&chaincode',
        component: Layout,
        redirect: 'noredirect',
        // alwaysShow: true, // will always show the root menu
        meta: {
            roles: ['admin', 'editor'], // you can set roles in root nav
            icon: 'lian',
            title: '通道&链码管理'
        },
        children: [
            {
                path: 'channel',
                name: 'Channel管理',
                component: () => import ( /* webpackChunkName: "test1" */ '@src/pages/channel&chaincode/ChannelManage'),
                meta: {
                    roles: ['admin', 'editor'],
                    icon: 'yingyong',
                    title: 'Channel管理'
                }
            },
            {
                path: 'chaincode',
                name: 'Chaincode管理',
                component: () => import ( /* webpackChunkName: "test1" */ '@src/pages/channel&chaincode/ChaincodeManage'),
                meta: {
                    roles: ['admin', 'editor'],
                    icon: 'yingyong',
                    title: 'Chaincode管理'
                }
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        redirect: 'noredirect',
        // alwaysShow: true, // will always show the root menu
        meta: {
            roles: ['admin', 'editor'],
            title: '通道&用户管理',
            icon: 'yonghu'
        },
        children: [
            {
                path: 'fabricUser',
                name: 'FabricUser',
                component: () => import ( /* webpackChunkName: "test1" */ '@src/pages/userManage/FabricUser'),
                meta: {
                    roles: ['admin', 'editor'],
                    icon: 'yingyong',
                    title: 'FabricUser'
                }
            },
            {
                path: 'platformUser',
                name: 'PlatformUser',
                component: () => import ( /* webpackChunkName: "test1" */ '@src/pages/userManage/PlatformUser'),
                meta: {
                    roles: ['admin', 'editor'],
                    icon: 'yingyong',
                    title: 'PlatformUser'
                }
            }
        ]
    },
];

export default routes;