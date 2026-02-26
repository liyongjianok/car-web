<template>
    <div class="my-review-page">
      <van-nav-bar title="我的评价" left-arrow fixed placeholder @click-left="$router.back()" />
      
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多评价了"
          @load="onLoad"
        >
          <div v-for="item in reviewList" :key="item.id" class="my-review-card">
            <div class="car-info" @click="$router.push(`/detail/${item.modelId}`)">
              <van-image width="36" height="36" fit="cover" radius="4" :src="item.carImg" />
              <span class="car-name">{{ item.carName }}</span>
              <van-icon name="arrow" color="#969799" />
            </div>
            <div class="review-content">
              <div class="rate-row">
                <van-rate v-model="item.score" readonly allow-half size="12" />
                <span class="time">{{ item.createTime }}</span>
              </div>
              <p class="text">{{ item.content }}</p>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { getMyReviews } from '../api/car'
  
  const reviewList = ref([])
  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)
  const pageIndex = ref(1)
  
  const onLoad = async () => {
    try {
      if (refreshing.value) {
        reviewList.value = []
        pageIndex.value = 1
        refreshing.value = false
      }
  
      const res = await getMyReviews({
        pageIndex: pageIndex.value,
        pageSize: 10
      })
  
      reviewList.value.push(...res.list)
      loading.value = false
  
      if (reviewList.value.length >= res.total || res.list.length === 0) {
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
  .my-review-page {
    background-color: #f7f8fa;
    min-height: 100vh;
  }
  .my-review-card {
    background: #fff;
    margin: 12px;
    border-radius: 8px;
    padding: 16px;
  }
  .car-info {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f2f3f5;
    cursor: pointer;
  }
  .car-name {
    flex: 1;
    margin-left: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #323233;
  }
  .review-content {
    padding-top: 12px;
  }
  .rate-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .time {
    font-size: 12px;
    color: #969799;
  }
  .text {
    font-size: 14px;
    color: #323233;
    line-height: 1.6;
    margin-top: 10px;
    word-break: break-all;
  }
  </style>