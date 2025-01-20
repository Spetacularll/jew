import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './router/axios.ts';
import VueLazyload from 'vue-lazyload';


const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(VueLazyload)
app.mount('#app')
