import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/home', // 默认访问首页
        component: () => import('../views/Layout.vue'), // 我们下一步创建布局容器
        children: [
            { path: 'home', component: () => import('../views/Home.vue') },
            { path: 'category', component: () => import('../views/Category.vue') },
            { path: 'user', component: () => import('../views/User.vue') }
        ]
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/detail/:id',
        component: () => import('../views/Detail.vue') // 详情页占位
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router