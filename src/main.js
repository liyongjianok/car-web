import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 1. 全局引入 Vant 及样式，彻底解决重复注册的警告
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 2. 一次性注册 Vant
app.use(Vant)
app.use(Lazyload, {
    lazyComponent: true,
})

app.mount('#app')