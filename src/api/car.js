import request from '../utils/request'

// --- 用户相关接口 ---
// 登录
export const login = (data) => request.post('/user/login', data)
// 获取当前登录用户信息
export const getUserInfo = () => request.get('/user/info')
// 更新个人资料接口
export const updateUserInfo = (data) => request.post('/user/update', data)
// 查询我的评论接口
export const getMyReviews = (params) => request.get('/user/reviews', { params })

// --- 车型相关接口 ---
// 分页搜索车型列表
export const getCarList = (params) => request.get('/cars/search', { params })
// 获取车型详情
export const getCarDetail = (id) => request.get(`/cars/detail/${id}`)

// --- 评论相关接口 ---
// 获取评论列表
export const getReviews = (params) => request.get('/cars/reviews', { params })
// 发表评论
export const postReview = (data) => request.post('/cars/review', data)