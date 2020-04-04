<template>
    <div class="sv-tabs">
        <div class="sv-tabs__header">
            <ul class="sv-tabs__list">
                <li v-for="tab in tabs" class="sv-tabs__title" :class="{ 'active': tab.isActive }">
                    <a :href="tab.href" @click.prevent="selectTab(tab)">
                        <span v-if="tab.htmlTitle" v-html="tab.title"></span>
                        <span v-else>{{ tab.title }}</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="sv-tabs__details">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tabs: [],
                activeTab: null,
            };
        },

        created() {
            this.tabs = this.$children;
        },

        mounted() {
            if (window.location.hash.length) {
                this.activeTab = window.location.hash;
            }

            this.updateTabs();
        },

        methods: {
            selectTab(selectedTab) {
                this.activeTab = selectedTab.href;
                window.location.hash = selectedTab.href;
                this.updateTabs();
            },

            updateTabs() {
                this.tabs.forEach(tab => {
                    if (this.activeTab == null) {
                        if (tab.active) {
                            this.activeTab = tab.href;
                            window.location.hash = tab.href;
                        }
                    }

                    tab.isActive = (tab.href === this.activeTab);
                });
            }
        },
    }
</script>