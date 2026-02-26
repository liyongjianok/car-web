<template>
  <div class="login-page">
    <van-nav-bar title="用户登录 / 注册" left-arrow @click-left="$router.back()" />
    
    <div class="login-header">
      <img src="https://dummyimage.com/100/ee0a24/fff&text=CAR" alt="logo">
      <h3>欢迎使用懂车小助手</h3>
    </div>

    <van-tabs v-model:active="activeTab" animated swipeable color="#ee0a24">
      
      <van-tab title="账号登录" name="login">
        <van-form @submit="onSubmitLogin">
          <van-cell-group inset class="form-group">
            <van-field
              v-model="loginForm.phone"
              name="phone"
              label="手机号"
              placeholder="请填写11位的手机号"
              :rules="[{ required: true, message: '请填写手机号' }]"
            />
            <van-field
              v-model="loginForm.password"
              type="password"
              name="password"
              label="密码"
              placeholder="请填写不少于6位的密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </van-cell-group>
          <div style="margin: 32px 16px;">
            <van-button block type="primary" native-type="submit" :loading="loading">
              立即登录
            </van-button>
          </div>
        </van-form>
      </van-tab>

      <van-tab title="新用户注册" name="register">
        <van-form @submit="onSubmitRegister">
          <van-cell-group inset class="form-group">
            <van-field
              v-model="registerForm.phone"
              name="phone"
              label="手机号"
              placeholder="请输入常用手机号"
              :rules="[{ required: true, message: '请填写手机号' }]"
            />
            <van-field
              v-model="registerForm.password"
              type="password"
              name="password"
              label="设置密码"
              placeholder="至少6位"
              :rules="[{ required: true, message: '请设置密码' }, { validator: val => val.length >= 6, message: '密码不能少于6位' }]"
            />
            <van-field
              v-model="registerForm.confirmPassword"
              type="password"
              name="confirmPassword"
              label="确认密码"
              placeholder="请再次输入密码"
              :rules="[{ required: true, message: '请确认密码' }]"
            />
          </van-cell-group>
          <div style="margin: 32px 16px;">
            <van-button block type="danger" native-type="submit" :loading="regLoading">
              立即注册
            </van-button>
          </div>
        </van-form>
      </van-tab>

    </van-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../api/car'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()
const activeTab = ref('login')

// 登录表单状态
const loginForm = ref({ phone: '', password: '' })
const loading = ref(false)

// 注册表单状态
const registerForm = ref({ phone: '', password: '', confirmPassword: '' })
const regLoading = ref(false)

// 处理登录逻辑
const onSubmitLogin = async (values) => {
  loading.value = true
  try {
    const res = await login({
      phone: values.phone,
      password: values.password
    })
    
    // 1. 存储 Token 和 uid 到本地
    localStorage.setItem('car_token', res.token)
    localStorage.setItem('car_uid', res.uid)
    
    showSuccessToast('登录成功')
    
    // 2. 跳转回个人中心 (使用 replace 避免按返回键又回到登录页)
    setTimeout(() => {
      router.replace('/user')
    }, 500)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 处理注册逻辑
const onSubmitRegister = async (values) => {
  if (values.password !== values.confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }

  regLoading.value = true
  try {
    const res = await register({
      phone: values.phone,
      password: values.password
    })
    
    showSuccessToast(res.message || '注册成功')
    
    // 注册成功后，自动填充手机号并切回登录页
    loginForm.value.phone = values.phone
    loginForm.value.password = ''
    registerForm.value = { phone: '', password: '', confirmPassword: '' }
    activeTab.value = 'login'

  } catch (err) {
    console.error(err)
  } finally {
    regLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  background-color: #f7f8fa;
  min-height: 100vh;
}
.login-header {
  text-align: center;
  padding: 40px 0 20px;
}
.login-header img {
  width: 80px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.login-header h3 {
  margin-top: 16px;
  color: #323233;
  font-size: 20px;
}
.form-group {
  margin-top: 24px;
}
</style>