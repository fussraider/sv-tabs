<template>
    <div :class="tabsClass">
        <slot name="beforeHeaderBegin" :activeTab="activeTab"></slot>
        <div :class="headerClass" ref="header">
            <slot name="afterHeaderBegin" :activeTab="activeTab"></slot>
            <div :class="listContainerClass" ref="listContainer">
                <div :class="listClass">
                    <div :class="indicatorClass" :style="indicatorStyles"></div>
                    <div v-for="tab in tabs" v-if="tab.href" :class="tabItemClass(tab)" :data-href="tab.href"
                         ref="items"
                         :key="tab.href">
                        <div :class="wrapClass">
                            <a @click.prevent="changeTab(tab.href)" :class="textWrapClass" :href="tab.href">
                                <span :class="textClass" v-if="tab.htmlTitle" v-html="tab.title"></span>
                                <span :class="textClass" v-else>{{ tab.title }}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="navClass" v-show="navShow">
                <button :class="leftArrowClass" @click="slide('left')"></button>
                <button :class="rightArrowClass" @click="slide('right')"></button>
            </div>
            <slot name="beforeHeaderEnd" :activeTab="activeTab"></slot>
        </div>
        <slot name="afterHeaderEnd" :activeTab="activeTab"></slot>

        <div :class="detailsClass">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import list from "@store/submodule/list";

    export default {
        props: {
            changeRoute: {
                type: Boolean,
                default: true,
            },
            classes: {
                type: Object,
                required: false,
            },
            onSelect: {
                type: Function,
                required: false,
            },
        },

        data() {
            return {
                tabs: [],
                activeTab: null,
                indicatorStyles: {width: 0, left: 0},
                refsLoaded: false,
                navShow: false,
                leftArrowActive: false,
                rightArrowActive: false,
            };
        },

        created() {
            this.tabs = this.$children;
        },

        mounted() {
            if (window.location.hash.length && this.changeRoute) {
                this.activeTab = window.location.hash;
            }
            window.addEventListener('resize', this.onResize);
            window.addEventListener('popstate', this.onLocationChange);
            this.$nextTick(function () {
                this.refsLoaded = true;
                this.$refs.listContainer.addEventListener('scroll', _.debounce(this.defineActiveArrows, 50));
                let activeTab = this.activeTab ? {href: this.activeTab} : this.tabs.find(tab => tab.active) || this.tabs[0];
                this.changeTab(activeTab.href, true);
                if (typeof this.onSelect === 'function')
                    this.onSelect({href: this.activeTab});
                this.updateTabs();
            })
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
            window.removeEventListener('popstate', this.onLocationChange);
        },

        computed: {
            tabsClass() {
                let classes        = this.getClassesByKey('tabs');
                classes['sv-tabs'] = true;
                return classes;
            },
            headerClass() {
                let classes                         = this.getClassesByKey('header');
                classes['sv-tabs__header']          = true;
                classes['sv-tabs__header_nav-show'] = this.navShow;
                return classes;
            },
            listContainerClass() {
                let classes                        = this.getClassesByKey('listContainer');
                classes['sv-tabs__list-container'] = true;
                return classes;
            },
            listClass() {
                let classes              = this.getClassesByKey('list');
                classes['sv-tabs__list'] = true;
                return classes;
            },

            indicatorClass() {
                let classes                   = this.getClassesByKey('indicator');
                classes['sv-tabs__indicator'] = true;
                return classes;
            },
            wrapClass() {
                let classes              = this.getClassesByKey('wrap');
                classes['sv-tabs__wrap'] = true;
                return classes;
            },
            textWrapClass() {
                let classes                   = this.getClassesByKey('textWrap');
                classes['sv-tabs__text-wrap'] = true;
                return classes;
            },
            textClass() {
                let classes              = this.getClassesByKey('text');
                classes['sv-tabs__text'] = true;
                return classes;
            },
            navClass() {
                let classes             = this.getClassesByKey('nav');
                classes['sv-tabs__nav'] = true;
                return classes;
            },
            leftArrowClass() {
                let classes                    = this.getClassesByKey('leftArrow');
                classes['sv-tabs__arrow']      = true;
                classes['sv-tabs__arrow_left'] = true;
                classes['active']              = this.leftArrowActive;
                return classes;
            },
            rightArrowClass() {
                let classes                     = this.getClassesByKey('rightArrow');
                classes['sv-tabs__arrow']       = true;
                classes['sv-tabs__arrow_right'] = true;
                classes['active']               = this.rightArrowActive;
                return classes;
            },
            detailsClass() {
                let classes                 = this.getClassesByKey('detail');
                classes['sv-tabs__details'] = true;
                return classes;
            },
        },

        methods: {
            setActiveTabHref(href) {
                this.activeTab = href;
                this.updateTabs();
                if (typeof this.onSelect === 'function')
                    this.onSelect({href: this.activeTab});
            },
            onResize() {
                _.debounce(() => {
                    this.updateTabs();
                }, 300)();
            },

            updateTabs() {
                this.tabs.forEach(tab => {
                    tab.isActive = (tab.href === this.activeTab);
                });
                if (Array.isArray(this.$refs.items)) {
                    let activeTab = this.$refs.items.find(item => this.activeTab === item.dataset.href);
                    if (typeof activeTab !== 'undefined') {
                      this.redefineNavShow();
                      this.recalculateIndicatorPosition(activeTab);
                      this.defineActiveArrows();
                      this.$nextTick(function () {
                        this.moveTabsToSeeActiveTab(activeTab);
                      });
                    }
                }
            },

            tabItemClass(tab) {
                let classes              = this.getClassesByKey('item');
                let active               = this.classes && this.classes.active ? this.classes.active : 'active';
                classes[active]          = tab.isActive;
                classes['sv-tabs__item'] = true;
                return classes;
            },

            getClassesByKey(key) {
                let classes = {};
                if (this.classes && typeof this.classes[key] !== 'undefined') {
                    let propClasses = this.classes[key];
                    if (Array.isArray(propClasses))
                        for (let className of propClasses) {
                            classes[className] = true;
                        }
                    else if (typeof propClasses === 'string')
                        classes[propClasses] = true;
                }
                return classes;
            },

            recalculateIndicatorPosition(activeTab) {
                this.indicatorStyles = {left: `${activeTab.offsetLeft}px`, width: `${activeTab.offsetWidth}px`};
            },

            redefineNavShow() {
                let listContainer = this.$refs.listContainer;
                this.navShow      = listContainer.offsetWidth < listContainer.scrollWidth;
            },

            slide(direction) {
                let listContainer = this.$refs.listContainer;
                let left;
                if (direction === 'right')
                    left = listContainer.scrollLeft + listContainer.offsetWidth;
                else
                    left = listContainer.scrollLeft - listContainer.offsetWidth;
                this.moveTabs(left);
            },

            moveTabs(leftPosition) {
                this.$refs.listContainer.scroll({
                    left: leftPosition,
                    behavior: 'smooth',
                });
            },

            moveTabsToSeeActiveTab(activeTab) {
                activeTab.scrollIntoView(false);
            },

            defineActiveArrows() {
                let listContainer     = this.$refs.listContainer;
                this.leftArrowActive  = listContainer.scrollLeft > 0;
                this.rightArrowActive = (listContainer.scrollWidth - listContainer.offsetWidth) > listContainer.scrollLeft;
            },
            changeTab(href, replace = false) {
                if(this.changeRoute === true && this.activeTab !== href) {
                    if(replace)
                        this.$router.replace({hash: href, query: this.$route.query});
                    else
                        this.$router.push({hash: href, query: this.$route.query});
                }
                else
                    this.setActiveTabHref(href);
            }
        },
        watch: {
            $route(to, from) {
                let href = to.hash;
                if (href && this.activeTab !== href && this.changeRoute) {
                    this.setActiveTabHref(href);
                }
            },
        }
    };
</script>


<style lang="scss">
    .sv-tabs {
        background-color: #ffffff;

        &__indicator {
            height: 3px;
            background: #00d1b2;
            position: absolute;
            bottom: 0;
        }

        &__header {
            overflow: hidden;
            user-select: none;
            align-items: stretch;
            display: flex;
            font-size: 1rem;
            justify-content: space-between;
            white-space: nowrap;

            .sv-tabs__list-container {
                width: 100%;
                overflow: hidden;
                z-index: 1;
            }

            &_nav-show {

                .sv-tabs__list-container {
                    margin: 0 30px;
                }
            }

            .sv-tabs__list {
                list-style: none;
                align-items: center;
                display: flex;
                flex-grow: 1;
                flex-shrink: 0;
                justify-content: flex-start;
                position: relative;
            }

            .sv-tabs__item {
                display: block;
                margin: 0;
                padding: 0;

                &.active {
                    a {
                        border-bottom-color: #00d1b2;
                        color: #00d1b2;
                    }
                }

                a {
                    text-decoration: none;
                    align-items: center;
                    color: #4a4a4a;
                    display: flex;
                    justify-content: center;
                    margin-bottom: -1px;
                    padding: .5em 1em;
                    vertical-align: top;

                    &:hover {
                        color: #363636;
                    }
                }
            }
        }

        &__nav {
            position: absolute;
            top: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: -1;

            button {
                width: 0;
                height: 0;
                border-style: solid;
                background: none;
            }

            .sv-tabs__arrow_left {
                border-width: 5px 10px 5px 0;
                border-color: transparent #6b6b6b transparent transparent;
                opacity: 0.3;
                position: absolute;
                left: 10px;
                outline: none;

                &.active {
                    cursor: pointer;
                    opacity: 1;
                }
            }

            .sv-tabs__arrow_right {
                border-width: 5px 0 5px 10px;
                border-color: transparent transparent transparent #6b6b6b;
                opacity: 0.3;
                position: absolute;
                right: 10px;
                outline: none;

                &.active {
                    cursor: pointer;
                    opacity: 1;
                }
            }
        }

        &__details {
            position: relative;
        }
    }
</style>
