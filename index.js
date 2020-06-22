import Tabs from "./components/Tabs";
import Tab from "./components/Tab";

export default {
    install(Vue, options) {
        Vue.component('sv-tabs', Tabs);
        Vue.component('sv-tab', Tab)
    }
}