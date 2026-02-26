<template>
    <div class="my-favorite-page">
      <van-nav-bar title="我的收藏" left-arrow fixed placeholder @click-left="$router.back()" />
      
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多收藏了"
          @load="onLoad"
        >
          <div 
            v-for="item in favList" 
            :key="item.id" 
            class="fav-card"
            @click="$router.push(`/detail/${item.modelId}`)"
          >
            <van-image class="car-img" fit="cover" radius="8" :src="item.carImg" />
            <div class="car-info">
              <div class="car-name van-multi-ellipsis--l2">{{ item.carName }}</div>
              <div class="price">指导价：<span>{{ item.price }}</span> 万起</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { getMyFavorites } from '../api/car'
  
  const favList = ref([])
  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)
  const pageIndex = ref(1)
  
  const onLoad = async () => {
    try {
      if (refreshing.value) {
        favList.value = []
        pageIndex.value = 1
        refreshing.value = false
      }
      const res = await getMyFavorites({ pageIndex: pageIndex.value, pageSize: 10 })
      favList.value.push(...res.list)
      loading.value = false
      if (favList.value.length >= res.total || res.list.length === 0) {
        finished.value = true
      } else {
        pageIndex.value++
      }
    } catch (error) {
      loading.value = false
      finished.value = true
    }
  }
  
  const onRefresh = () => {
    finished.value = false
    loading.value = true
    onLoad()
  }
  </script>
  
  <style scoped>
  .my-favorite-page {
    background-color: #f7f8fa;
    min-height: 100vh;
  }
  .fav-card {
    display: flex;
    background: #fff;
    margin: 12px;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }
  .car-img {
    width: 110px;
    height: 80px;
    flex-shrink: 0;
  }
  .car-info {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }
  .car-name {
    font-size: 15px;
    font-weight: bold;
    color: #323233;
  }
  .price {
    font-size: 13px;
    color: #969799;
    margin-top: 10px;
  }
  .price span {
    color: #ee0a24;
    font-weight: bold;
    font-size: 16px;
  }
  </style>