import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/',
        component: () => import('../views/Layout.vue'),
        children: [
            { path: 'home', component: () => import('../views/Home.vue'), meta: { title: '首页' } },
            { path: 'category', component: () => import('../views/Category.vue'), meta: { title: '选车' } },
            { path: 'user', component: () => import('../views/User.vue'), meta: { title: '我的' } }
        ]
    },
    { path: '/login', component: () => import('../views/Login.vue'), meta: { title: '登录' } },
    { path: '/detail/:id', component: () => import('../views/Detail.vue'), meta: { title: '车辆详情' } },
    { path: '/my-reviews', component: () => import('../views/MyReview.vue'), meta: { title: '我的评价' } },
    { path: '/my-favorites', component: () => import('../views/MyFavorite.vue'), meta: { title: '我的收藏' } }
]

const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach((to, from, next) => {
    if (to.meta.title) document.title = to.meta.title + ' - 懂车小助手'
    next()
})
export default router