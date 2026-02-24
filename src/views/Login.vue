<template>
    <div class="login">
      <van-nav-bar title="用户登录" left-arrow @click-left="$router.back()" />
      
      <div class="login-header">
        <img src="https://dummyimage.com/100/ee0a24/fff&text=CAR" alt="logo">
        <h3>欢迎使用懂车小助手</h3>
      </div>
  
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="phone"
            name="phone"
            label="手机号"
            placeholder="13800138000"
            :rules="[{ required: true, message: '请填写手机号' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="123456"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 32px 16px;">
          <van-button block type="primary" native-type="submit" :loading="loading">
            立即登录
          </van-button>
        </div>
      </van-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { login } from '../api/car'
  import { showSuccessToast } from 'vant'
  
  const router = useRouter()
  const phone = ref('13800138000') // 默认填入测试账号
  const password = ref('123456')   // 默认填入测试密码
  const loading = ref(false)
  
  const onSubmit = async (values) => {
    loading.value = true
    try {
      const res = await login(values)
      // 1. 存储 Token 到本地
      localStorage.setItem('car_token', res.token)
      localStorage.setItem('car_uid', res.uid)
      
      showSuccessToast('登录成功')
      // 2. 跳转回个人中心或首页
      router.replace('/user')
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .login-header {
    text-align: center;
    padding: 40px 0;
  }
  .login-header img {
    width: 80px;
    border-radius: 12px;
  }
  </style>