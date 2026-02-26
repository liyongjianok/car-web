import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        // 默认重定向到首页
        path: '/',
        redirect: '/home'
    },
    {
        // 带有底部导航栏的根布局
        path: '/',
        component: () => import('../views/Layout.vue'),
        children: [
            {
                path: 'home',
                component: () => import('../views/Home.vue'),
                meta: { title: '首页' }
            },
            {
                path: 'category',
                component: () => import('../views/Category.vue'),
                meta: { title: '选车' }
            },
            {
                path: 'user',
                component: () => import('../views/User.vue'),
                meta: { title: '我的' }
            }
        ]
    },
    {
        // 登录页
        path: '/login',
        component: () => import('../views/Login.vue'),
        meta: { title: '登录' }
    },
    {
        // 车辆详情页
        path: '/detail/:id',
        component: () => import('../views/Detail.vue'),
        meta: { title: '车辆详情' }
    },
    {
        // 我的评价页
        path: '/my-reviews',
        component: () => import('../views/MyReview.vue'),
        meta: { title: '我的评价' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫：动态修改网页标题
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + ' - 懂车小助手'
    }
    next()
})

export default router