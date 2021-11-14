import {createApp, h} from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css';
import 'element-ui/lib/theme-chalk/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@primer/octicons/index.scss'
import ElementPlus from 'element-plus'
import Divider from "@/components/divider.vue";

createApp(App).use(router).use(ElementPlus)
    .component('Divider', Divider)
    .component('Dynamic', {
        props: ['template'],
        render() {
            return h({template: this.template})
        }
    }).mount('#app')
