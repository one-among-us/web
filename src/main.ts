import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css'

createApp(App).use(router).mount('#app')
