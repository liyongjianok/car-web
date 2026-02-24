<template>
    <div class="detail-page" v-if="detail">
      <van-nav-bar title="车型详情" left-arrow fixed @click-left="$router.back()" />
      <div style="height: 46px;"></div>
  
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(img, index) in detail.images" :key="index">
          <van-image width="100%" height="240" fit="cover" :src="img" />
        </van-swipe-item>
        <van-swipe-item v-if="!detail.images || detail.images.length === 0">
          <van-image width="100%" height="240" fit="cover" :src="detail.baseInfo.coverImg" />
        </van-swipe-item>
      </van-swipe>
  
      <div class="info-card">
        <div class="price-row">
          <span class="price">{{ detail.baseInfo.price }}</span>
          <span class="unit">万起</span>
        </div>
        <div class="title">{{ detail.baseInfo.brandName }} · {{ detail.baseInfo.series }}</div>
        <div class="model">{{ detail.baseInfo.modelName }}</div>
      </div>
  
      <van-divider content-position="left">详细配置</van-divider>
      <van-collapse v-model="activeNames">
        <van-collapse-item 
          v-for="(val, key) in detail.specs" 
          :key="key" 
          :title="key" 
          :name="key"
        >
          <template v-if="typeof val === 'string'">{{ val }}</template>
          <template v-else>
            <div v-for="(v, k) in val" :key="k" class="spec-item">
              <span class="label">{{ k }}</span>
              <span class="value">{{ v }}</span>
            </div>
          </template>
        </van-collapse-item>
      </van-collapse>
  
      <van-action-bar>
        <van-action-bar-icon icon="chat-o" text="评论" @click="showReviews = true" />
        <van-action-bar-icon icon="star-o" text="收藏" />
        <van-action-bar-button type="warning" text="预约试驾" />
        <van-action-bar-button type="danger" text="立即订购" />
      </van-action-bar>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getCarDetail } from '../api/car'
  
  const route = useRoute()
  const detail = ref(null)
  const activeNames = ref(['发动机', '基础参数']) // 默认展开
  
  const fetchDetail = async () => {
    try {
      const res = await getCarDetail(route.params.id)
      detail.value = res
    } catch (err) {
      console.error(err)
    }
  }
  
  onMounted(fetchDetail)
  </script>
  
  <style scoped>
  .info-card {
    padding: 15px;
    background: #fff;
    margin-bottom: 10px;
  }
  .price-row {
    color: #ee0a24;
    margin-bottom: 8px;
  }
  .price {
    font-size: 24px;
    font-weight: bold;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .model {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
  }
  .spec-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f2f3f5;
    font-size: 13px;
  }
  .spec-item .label { color: #969799; }
  .spec-item .value { color: #323233; font-weight: 500; }
  .detail-page {
    padding-bottom: 60px;
    background: #f7f8fa;
    min-height: 100vh;
  }
  </style>