<template>
    <div data-navbar-box>
        <el-menu class="navbar" mode="horizontal">
            <div style="display: flex;">
                <!-- 控制左边菜单是否收缩 -->
                <div class="hamburger-container">
                    <FontIcon class="hamburger" @click.native="toggleSideBar" :class="{'is-active':isActive}" icon="menu"></FontIcon>
                </div>
                <!-- 菜单面包屑 -->
                <Breadcrumb style="flex:1;"></Breadcrumb>
                <!-- 其他功能 -->
                <div class="right-menu">
                    <!-- 是否全屏显示 -->
                    <!-- <Screenfull class="for-line"></Screenfull> -->
                    <!-- 设置国际化 -->
                    <!-- <LangSelect class="for-line"></LangSelect> -->
                    <!-- 用户操作 -->
                    <div style="font-size: 14px;">欢迎{{username}}</div>
                    <el-dropdown class="for-line" trigger="hover">
                        <div style="display:flex;">
                            <img class="user-img" :src="userJpg" alt="">
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <router-link to="/">
                                <el-dropdown-item>首页</el-dropdown-item>
                            </router-link>
                            <el-dropdown-item divided>
                                <span @click="logout" style="display:block;">退出登录</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-menu>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import FontIcon from '~comp/common/FontIcon';
// import Screenfull from '~comp/common/Screenfull';
// import LangSelect from '~comp/common/LangSelect';
import Breadcrumb from '~comp/common/layout/Breadcrumb';
import userJpg from '~compImg/user.jpg';
import { Session } from '~compJs/public';
import { AIGUILLE_FABRIC } from '~compJs/const';
export default {
    components: {
        FontIcon,
        Breadcrumb
        // Screenfull,
        // LangSelect
    },
    mounted() {
        this.userInfo = JSON.parse(Session.get('UINFO'));
        this.username = this.userInfo.username;
    },
    computed: {
        ...mapGetters([
            'sidebar'
        ]),
        isActive() {
            return !this.sidebar.opened;
        }
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('publics/toggleSideBar');
        },
        logout() {
            this.$get(AIGUILLE_FABRIC + '/login/userLogout', {}, data => {
                if (data.code === '0000') {
                    this.$store.dispatch('auth/setGeti', false);
                    Session.remove('UINFO');
                    window.location.href = 'login.html';
                }
            })
        }
    },
    data() {
        return {
            userJpg,
            userInfo: '',
            username: ''
        }
    }
}
</script>
<style lang="scss">
div[data-navbar-box] {
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px!important;
        .hamburger-container {
            line-height: 53px;
            height: 50px;
            padding: 0 13px;
            float: left;
            .hamburger {
                display: inline-block;
                cursor: pointer;
                width: 20px;
                height: 20px;
                transform: rotate(0deg);
                transition: .38s;
                transform-origin: 50% 50%;
            }
            .hamburger.is-active {
                transform: rotate(90deg);
            }
        }
        .right-menu {
            height: 50px;
            line-height: 50px;
            margin-right: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            .for-line {
                font-size: 25px!important;
                line-height: inherit;
                margin: 0 15px;
            }
            .user-img{
                width: 30px;
                height: 30px;
            }
            .user-img:hover {
                transform: rotate(666turn);
                transition-duration: 59s;
                transition-timing-function: cubic-bezier(.34, 0, .84, 1)
            }
        }
    }
}
</style>

