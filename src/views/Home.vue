<template>
    <div class="home">
      <van-nav-bar title="懂车小助手" fixed placeholder />
      <van-search
        v-model="keyword"
        placeholder="搜索品牌或车型"
        sticky
        @search="onSearch"
        @clear="onSearch"
      />
  
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div 
            v-for="item in carList" 
            :key="item.id" 
            class="car-card"
            @click="$router.push(`/detail/${item.id}`)"
          >
            <van-image
              width="120"
              height="90"
              fit="cover"
              radius="8"
              :src="item.coverImg"
            />
            <div class="car-info">
              <div class="title">{{ item.brandName }} · {{ item.series }}</div>
              <div class="model">{{ item.modelName }}</div>
              <div class="price-row">
                <span class="price">{{ item.price }}</span>
                <span class="unit">万起</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { getCarList } from '../api/car'
  
  const keyword = ref('')
  const carList = ref([])
  const loading = ref(false)
  const finished = ref(false)
  const refreshing = ref(false)
  const pageIndex = ref(1)
  
  // 加载数据
  const onLoad = async () => {
    try {
      if (refreshing.value) {
        carList.value = []
        refreshing.value = false
        pageIndex.value = 1
      }
  
      const res = await getCarList({
        keyword: keyword.value,
        pageIndex: pageIndex.value,
        pageSize: 10
      })
  
      carList.value.push(...res.list)
      loading.value = false
  
      if (carList.value.length >= res.total) {
        finished.value = true
      } else {
        pageIndex.value++
      }
    } catch (error) {
      loading.value = false
      finished.value = true
    }
  }
  
  // 搜索触发
  const onSearch = () => {
    refreshing.value = true
    onLoad()
  }
  
  // 下拉刷新
  const onRefresh = () => {
    finished.value = false
    loading.value = true
    onLoad()
  }
  </script>
  
  <style scoped>
  .car-card {
    display: flex;
    padding: 15px;
    background: #fff;
    margin: 10px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .car-info {
    margin-left: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .car-info .title {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
  }
  
  .car-info .model {
    font-size: 13px;
    color: #969799;
    margin-top: 4px;
  }
  
  .car-info .price-row {
    margin-top: 8px;
  }
  
  .car-info .price {
    font-size: 18px;
    font-weight: bold;
    color: #ee0a24;
  }
  
  .car-info .unit {
    font-size: 12px;
    color: #ee0a24;
    margin-left: 2px;
  }
  </style>