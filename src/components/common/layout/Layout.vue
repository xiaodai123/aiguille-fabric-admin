<template>
    <div data-layout-box>
        <div :class="{'is-collapse':isCollapse}">
            <Sidebar class="sidebar-container"></Sidebar>
        </div>
        <div class="main-container">
            <Navbar></Navbar>
            <TagsView></TagsView>
            <Main></Main>
        </div>
    </div>
</template>
<script>
import Sidebar from '~comp/common/layout/Sidebar';
import Navbar from '~comp/common/layout/Navbar';
import TagsView from '~comp/common/layout/TagsView';
import Main from '~comp/common/layout/Main';
import { mapGetters } from 'vuex';
export default {
    components: {
        Sidebar,
        Navbar,
        TagsView,
        Main
    },
    computed: {
        ...mapGetters([
            'sidebar'
        ]),
        isCollapse() {
            return !this.sidebar.opened;
        }
    }
}
</script>
<style lang="scss">
div[data-layout-box] {
    display: flex;
    .sidebar-container {
        transition: width 0.5s;
        width: 210px;
        height: 100%;
        font-size: 0px;
        z-index: 1001;
        overflow: hidden;
    }
    .is-collapse {
        .sidebar-container{width: 45px;}
    }
    .main-container{
        min-height: 100%;
        transition: margin-left .28s;
        flex: 1;
        width: 100%;
    }
}
</style>


