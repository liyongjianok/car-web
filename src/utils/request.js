import axios from 'axios'
import { showToast } from 'vant'
import router from '../router'

// 创建实例
const request = axios.create({
    baseURL: '/api/v1',
    timeout: 10000
})

// 请求拦截：自动携带 Token
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('car_token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截：统一错误处理
request.interceptors.response.use(
    response => response.data,
    error => {
        const { status, data } = error.response || {}

        if (status === 401) {
            showToast('登录过期')
            localStorage.clear()
            router.push('/login')
        } else if (data && typeof data === 'string') {
            showToast(data) // 弹出 Go-Zero 返回的业务错误提示
        } else {
            showToast('网络繁忙，请稍后再试')
        }

        return Promise.reject(error)
    }
)

export default request