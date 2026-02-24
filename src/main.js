import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 引入 Vant 样式
import 'vant/lib/index.css'
import { Lazyload, Tabbar, TabbarItem, Search, NavBar, List, PullRefresh, Image as VanImage, Icon, Button, Form, Field, CellGroup, Cell, Swipe, SwipeItem, Divider, Collapse, CollapseItem, ActionBar, ActionBarIcon, ActionBarButton, Loading, BackTop, Popup } from 'vant'
import Vant from 'vant'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)

const components = [Tabbar, TabbarItem, Search, NavBar, List, PullRefresh, VanImage, Icon, Button, Form, Field, CellGroup, Cell, Swipe, SwipeItem, Divider, Collapse, CollapseItem, ActionBar, ActionBarIcon, ActionBarButton, Loading, BackTop, Popup]
components.forEach(item => app.use(item))

app.use(Lazyload, {
    lazyComponent: true,
})

app.mount('#app')