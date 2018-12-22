<template>
    <div data-sidebar-box>
        <ScrollBar class="tags_view_scrollbar">
            <el-menu style="height: 100vh;" :class="{'is-collapse':isCollapse}"
                mode="vertical"
                menu-trigger="click"
                :default-active="$route.path"
                :collapse="isCollapse"
                background-color="#304156"
                text-color="#bfcbd9"
                active-text-color="#409eff">
                <SidebarItem v-for="(route, index) in permissionRouters" :key="index" :item="route" :base-path="route.path"></SidebarItem>
            </el-menu>
        </ScrollBar>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SidebarItem from '~comp/common/layout/SidebarItem';
import ScrollBar from '~comp/common/ScrollBar';
export default {
    computed: {
        ...mapGetters([
            'sidebar',
            'permissionRouters'
        ]),
        isCollapse() {
            return !this.sidebar.opened;
        }
    },
    components: {
        SidebarItem,
        ScrollBar
    }
}
</script>
<style lang="sass">
.el-menu--vertical {
    top: 0px!important;
    .el-menu--popup-right-start {
        margin-left: 2px;
    }
}
div[data-sidebar-box] {
    //reset element-ui css
    .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }
    .tags_view_scrollbar {
        height: 100vh;
        margin-bottom: -2px;
        flex: 1;
        .el-scrollbar__wrap{
            overflow-x: hidden;
        }
        .el-scrollbar__view:after{
            content: '';
            display: block;
            clear: both;
        }
        .is-collapse {
            .el-submenu {
                overflow: hidden;
                &>.el-submenu__title {
                    padding-left: 10px !important;
                    padding-right: 10px!important;
                    .el-submenu__icon-arrow {
                        display: none;
                    }
                }
            }
            .el-menu-item {
                &>.el-tooltip {
                    padding-left: 10px !important;
                }
            }
        }
        .el-menu--collapse.is-collapse {
            width: auto;
            .el-submenu {
                &>.el-submenu__title {
                    &>span {
                        height: 0;
                        width: 0;
                        overflow: hidden;
                        visibility: hidden;
                        display: inline-block;
                    }
                }
            }
            .el-submenu [class^=el-icon-] {
                margin-right: 0px!important;
            }
        }
    }
    .is-horizontal {
      display: none;
    }
    .sidebar-container .nest-menu .el-submenu>.el-submenu__title,
    .sidebar-container .el-submenu .el-menu-item {
        min-width: 180px !important;
        background-color: #1f2d3d!important;
        &:hover {
            background-color: #001528!important;
        }
    }
}
</style>


