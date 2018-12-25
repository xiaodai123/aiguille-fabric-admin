<template>
    <div data-tags-view>
        <!-- <ScrollBar class="tags_view_scrollbar" horizontalSlide> -->
            <!-- @contextmenu.prevent.native="openMenu(tag,$event)" -->
            <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
                <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
                    :to="tag" :key="tag.path">
                    {{tag.title}}
                    <span v-if="tag.title != '首页'" class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
                </router-link>
            </scroll-pane>
        <!-- </ScrollBar> -->
    </div>
</template>
<script>
import ScrollPane from '~comp/common/layout/ScrollPane';
// import ScrollBar from '~comp/common/ScrollBar';
import { mapGetters } from 'vuex';
export default {
    components: {
        ScrollPane
    },
    data() {
        return {
            visible: false,
            top: 0,
            left: 0,
            selectedTag: {}
        }
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews;
        },
        ...mapGetters([
            'sidebar'
        ]),
        whichLeft() {
            if (this.sidebar.opened) {
                return 180;
            } else {
                return 15;
            }
        }
    },
    watch: {
        $route() {
            this.addViewTags();
            this.moveToCurrentTag();
        }
    },
    mounted() {
        this.addViewTags()
    },
    methods: {
        generateRoute() {
            if (this.$route.name) {
                return this.$route;
            }
            return false;
        },
        isActive(route) {
            return route.path === this.$route.path;
        },
        addViewTags() {
            const route = this.generateRoute();
            if (!route) {
                return false;
            }
            this.$store.dispatch('tagsView/addVisitedViews', route);
        },
        moveToCurrentTag() {
            const tags = this.$refs.tag;
            this.$nextTick(() => {
                for (const tag of tags) {
                    if (tag.to.path === this.$route.path) {
                        this.$refs.scrollPane.moveToTarget(tag.$el);
                        break
                    }
                }
            });
        },
        closeSelectedTag(view) {
            this.$store.dispatch('tagsView/delVisitedViews', view).then((views) => {
                if (this.isActive(view)) {
                    const latestView = views.slice(-1)[0];
                    if (latestView) {
                        this.$router.push(latestView);
                    } else {
                        this.$router.push('/');
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss">
div[data-tags-view]{
    // border-bottom: 1px solid #d8dce5;
    // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    // .tags_view_scrollbar{
    //     height: 34px;
    //     margin-bottom: -8px;
    //     flex: 1;
    //     .el-scrollbar__wrap{
    //         overflow-x: hidden;
    //     }
    //     .el-scrollbar__view:after{
    //         content: '';
    //         display: block;
    //         clear: both;
    //     }
    //     .el-scrollbar__bar.is-horizontal {
    //         height: 4px;
    //     }
    // }
    .tags-view-wrapper {
        background: #fff;
        height: 34px;
        border-bottom: 1px solid #d8dce5;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
        .tags-view-item {
            display: inline-block;
            position: relative;
            height: 26px;
            line-height: 26px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;
            &:first-of-type {
                margin-left: 15px;
            }
            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;
                &::before {
                    content: '';
                    background: #fff;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 2px;
                }
            }
            .el-icon-close {
                width: 16px;
                height: 16px;
                vertical-align: 2px;
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                transform-origin: 100% 50%;
                &:before {
                    transform: scale(.6);
                    display: inline-block;
                    vertical-align: -3px;
                }
                &:hover {
                    background-color: #b4bccc;
                    color: #fff;
                }
            }
        }
    }
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 100;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
                background: #eee;
            }
        }
    }
}
</style>


