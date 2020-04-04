import Tabs from "./components/Tabs";
import Tab from "./components/Tab";

export default {
    install(Vue, options) {
        import("./styles/style.scss");
        Vue.component('sv-tabs', Tabs);
        Vue.component('sv-tab', Tab)
    }
}