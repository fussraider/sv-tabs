# Simple Vue Tabs

Simple tabs component for Vue.js  
**Works only if you use vue-route in your project**

# Install

1. install to your project
    ```shell script
    npm install sv-tabs
    ```

2. Add to Vue:
    ```js
    import SvTabs from "sv-tabs";
    Vue.use(SvTabs);
    ```
   
3. Use:
    ```vue
   <sv-tabs>
       <sv-tab title="Simple tab" :active="true">
           <h1>It's simple tab content</h1>
           Here your html-content
       </sv-tab>
       <sv-tab title="<b>Html-titled tab</b>" :htmlTitle="true" name="CustomUrlHash">
           <h1>It's tab header with html</h1>
           And url-hash = name-property
       </sv-tab>
       <sv-tab title="Vue-component">
           <hello-world></hello-world>
           Initialization of components after activation of the tab
       </sv-tab>
       <sv-tab title="Vue-component#2" :lazyLoad="false">
           <hello-world></hello-world>
           Components are initialized immediately when the page loads, but are shown only when the tab is active.
       </sv-tab>
   </sv-tabs>
   ```