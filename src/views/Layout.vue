<template>
    <div class="layout-container">
      <div class="main-content">
        <router-view />
      </div>
  
      <van-tabbar v-model="active" route active-color="#ee0a24">
        <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item replace to="/category" icon="apps-o">选车</van-tabbar-item>
        <van-tabbar-item replace to="/user" icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const active = ref(0)
  </script>
  
  <style scoped>
  .main-content {
    padding-bottom: 50px; /* 为底部导航预留空间 */
  }
  </style>