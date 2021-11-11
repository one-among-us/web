import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css'
import ElementPlus from 'element-plus'

createApp(App).use(router).use(ElementPlus).mount('#app')
