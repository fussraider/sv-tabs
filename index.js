import Tabs from "./components/Tabs";
import Tab from "./components/Tab";
import VueRouter from "vue-router";

export default {
    install(Vue, options) {
        let router = null;

        if (options && typeof options.router !== 'undefined') {
            router = options.router;
        } else {
            router = new VueRouter({
                mode: 'history',
            });
        }

        Vue.use(router);
        Vue.component('sv-tabs', Tabs);
        Vue.component('sv-tab', Tab);
    }
}