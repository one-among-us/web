import {createApp, h} from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'element-plus/dist/index.css'
import Divider from "@/components/divider.vue";
import RecaptchaV2 from "@/components/RecaptchaV2.vue"

createApp(App).use(router)
    .component('Divider', Divider)
    .component('RecaptchaV2', RecaptchaV2)
    .component('Dynamic', {
        props: ['template'],
        render() {
            return h({template: this.template})
        }
    })
    .mount('#app')
