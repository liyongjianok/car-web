<template>
    <div class="user-page">
      <van-nav-bar title="个人中心" />
  
      <div v-if="!isLogin" class="not-login">
        <van-icon name="user-circle-o" size="80" color="#ddd" />
        <p>登录后查看更多精彩内容</p>
        <van-button type="primary" block to="/login" style="width: 200px; margin: 0 auto;">去登录</van-button>
      </div>
  
      <div v-else class="user-info">
        <div class="header-card">
          <van-image round width="64" height="64" :src="userInfo.avatar || defaultAvatar" />
          <div class="info">
            <div class="nickname">{{ userInfo.nickname || '未设置昵称' }}</div>
            <div class="phone">{{ userInfo.phone }}</div>
          </div>
        </div>
  
        <van-cell-group inset style="margin-top: 20px;">
          <van-cell title="我的评论" icon="comment-o" is-link />
          <van-cell title="我的收藏" icon="star-o" is-link />
          <van-cell title="退出登录" icon="log-out" @click="handleLogout" />
        </van-cell-group>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getUserInfo } from '../api/car'
  import { showConfirmDialog } from 'vant'
  
  const isLogin = ref(!!localStorage.getItem('car_token'))
  const userInfo = ref({})
  const defaultAvatar = 'https://dummyimage.com/100/ccc/fff&text=U'
  
  const fetchUserInfo = async () => {
    if (!isLogin.value) return
    try {
      const res = await getUserInfo()
      userInfo.value = res
    } catch (err) {
      isLogin.value = false
    }
  }
  
  const handleLogout = () => {
    showConfirmDialog({ title: '提醒', message: '确定要退出登录吗？' }).then(() => {
      localStorage.clear()
      isLogin.value = false
      userInfo.value = {}
    })
  }
  
  onMounted(() => {
    fetchUserInfo()
  })
  </script>
  
  <style scoped>
  .not-login {
    text-align: center;
    padding-top: 100px;
  }
  .not-login p {
    color: #999;
    margin: 20px 0;
  }
  .header-card {
    background-color: #fff;
    padding: 30px 20px;
    display: flex;
    align-items: center;
  }
  .header-card .info {
    margin-left: 15px;
  }
  .header-card .nickname {
    font-size: 20px;
    font-weight: bold;
  }
  .header-card .phone {
    font-size: 14px;
    color: #999;
    margin-top: 5px;
  }
  </style>