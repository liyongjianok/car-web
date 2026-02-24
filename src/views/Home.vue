<template>
    <div class="home">
      <van-nav-bar title="懂车小助手" fixed placeholder />
      <van-search v-model="value" placeholder="请输入搜索关键词" />
      <div style="padding: 20px; text-align: center; color: #999;">
        车型列表加载中...
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const value = ref('')
  </script>