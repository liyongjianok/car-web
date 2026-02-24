<template>
    <div class="home-container">
      <div class="header-fixed">
        <van-nav-bar title="懂车小助手" />
        <van-search
          v-model="keyword"
          placeholder="搜索品牌或车型（如：本田、运动）"
          shape="round"
          background="#fff"
          @search="onSearch"
          @clear="onSearch"
        />
      </div>
  
      <div class="header-placeholder"></div>
  
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" head-height="80">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="已经到底啦 ~"
          @load="onLoad"
        >
          <div 
            v-for="item in carList" 
            :key="item.id" 
            class="car-item-card"
            @click="$router.push(`/detail/${item.id}`)"
          >
            <div class="thumb-box">
              <van-image
                width="100%"
                height="100%"
                fit="cover"
                :src="item.coverImg"
                lazy-load
              >
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </div>
  
            <div class="info-box">
              <div>
                <div class="brand-series">{{ item.brandName }} · {{ item.series }}</div>
                <div class="model-name van-ellipsis">{{ item.modelName }}</div>
              </div>
              <div class="price-section">
                <span class="price-num">{{ item.price }}</span>
                <span class="price-unit">万起</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
  
      <van-back-top bottom="60px" />
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
  
  // 核心加载逻辑
  const onLoad = async () => {
    try {
      if (refreshing.value) {
        carList.value = []
        pageIndex.value = 1
        refreshing.value = false
      }
  
      const res = await getCarList({
        keyword: keyword.value,
        pageIndex: pageIndex.value,
        pageSize: 10
      })
  
      // 将新数据追加到列表
      carList.value = [...carList.value, ...res.list]
      loading.value = false
  
      // 判断是否全部加载完成
      if (carList.value.length >= res.total || res.list.length === 0) {
        finished.value = true
      } else {
        pageIndex.value++
      }
    } catch (error) {
      loading.value = false
      finished.value = true
      console.error('加载车型列表失败:', error)
    }
  }
  
  // 搜索回调
  const onSearch = () => {
    refreshing.value = true
    finished.value = false // 重置完成状态
    onLoad()
  }
  
  // 下拉刷新回调
  const onRefresh = () => {
    finished.value = false
    loading.value = true
    onLoad()
  }
  </script>
  
  <style scoped>
  .home-container {
    min-height: 100vh;
    background-color: #f7f8fa;
  }
  
  /* 顶部固定布局修复 */
  .header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  }
  
  .header-placeholder {
    height: 100px; /* 准确匹配导航+搜索的高度 */
  }
  
  /* 车型卡片样式 */
  .car-item-card {
    display: flex;
    margin: 12px;
    padding: 12px;
    background-color: #fff;
    border-radius: 12px;
    transition: transform 0.2s;
  }
  
  .car-item-card:active {
    transform: scale(0.98);
    background-color: #fafafa;
  }
  
  .thumb-box {
    width: 130px;
    height: 90px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 6px;
  }
  
  .info-box {
    flex: 1;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2px 0;
    min-width: 0; /* 配合 van-ellipsis 使用 */
  }
  
  .brand-series {
    font-size: 16px;
    font-weight: 600;
    color: #323233;
  }
  
  .model-name {
    font-size: 13px;
    color: #969799;
    margin-top: 4px;
  }
  
  .price-section {
    display: flex;
    align-items: baseline;
  }
  
  .price-num {
    font-size: 20px;
    font-weight: bold;
    color: #ee0a24;
  }
  
  .price-unit {
    font-size: 12px;
    color: #ee0a24;
    margin-left: 2px;
  }
  </style>