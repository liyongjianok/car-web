import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 引入 Vant 样式
import 'vant/lib/index.css'
import Vant from 'vant'

// 引入 Pinia
import { createPinia } from 'pinia'

// 这里会报错说找不到 router，别担心，我们下一步马上建
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)

app.mount('#app')