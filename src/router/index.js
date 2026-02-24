import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        // 我们暂时指向一个占位组件，稍后替换
        component: () => import('../App.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router