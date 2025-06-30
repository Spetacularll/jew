import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import './router/axios.ts';
import VueLazyload from 'vue-lazyload';

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
    locale: zhCn
  })
app.use(VueLazyload)
app.mount('#app')
