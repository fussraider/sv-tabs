<template>
    <div>
        <div v-if="lazyLoad">
            <div class="sv-tabs__body sv-tabs__body_lazy" v-if="isActive">
                <slot></slot>
            </div>
        </div>
        <div v-else>
            <div class="sv-tabs__body" v-show="isActive">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                required: true
            },
            htmlTitle: {
                default: false
            },
            lazyLoad: {
                default: true
            },
            name: {
                required: false
            },
            active: {
                default: false
            }
        },

        data() {
            return {
                isActive: false
            };
        },

        computed: {
            href() {
                if (typeof this.name === 'undefined') {
                    return '#' + this.title.toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/[^A-Za-z0-9\-]/g, "");
                } else {
                    return '#' + this.name;
                }
            },
        },

    }
</script>