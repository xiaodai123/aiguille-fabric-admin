<template>
    <section class="app-main">
        <ScrollBar class="tags_view_scrollbar">
            <transition name="fade-transform" mode="out-in">
                <keep-alive :include="cachedViews">
                    <router-view :key="key"></router-view>
                </keep-alive>
            </transition>
        </ScrollBar>
    </section>
</template>

<script>
import ScrollBar from '~comp/common/ScrollBar';
export default {
    name: 'Main',
    computed: {
        cachedViews() {
            return this.$store.state.tagsView.cachedViews
        },
        key() {
            return this.$route.fullPath
        }
    },
    components: {
        ScrollBar
    }
}
</script>

<style lang="sass">
.app-main {
    .tags_view_scrollbar {
        height: calc(100vh - 122px);
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
    }
    /*84 = navbar + tags-view = 50 +34 */
    min-height: calc(100vh - 84px);
    position: relative;
    overflow: hidden;
    padding: 20px 0px 20px 20px;   
    /*fade*/

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.28s;
    }

    .fade-enter-to,
    .fade-leave-active {
        opacity: 0;
    }

    /*fade-transform*/
    .fade-transform-leave-active,
    .fade-transform-enter-active {
        transition: all .5s;
    }
    .fade-transform-enter {
        opacity: 0;
        transform: translateX(-30px);
    }
    .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
}
</style>
