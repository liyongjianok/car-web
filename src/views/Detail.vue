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
      <van-collapse-item v-for="(val, key) in detail.specs" :key="key" :title="key" :name="key">
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
      <van-action-bar-icon icon="chat-o" text="评论" @click="openReviews" />
      <van-action-bar-icon icon="star-o" text="收藏" />
      <van-action-bar-button type="warning" text="预约试驾" />
      <van-action-bar-button type="danger" text="立即订购" />
    </van-action-bar>

    <van-popup
      v-model:show="showReviews"
      position="bottom"
      round
      closeable
      :style="{ height: '70%' }"
    >
      <div class="review-container">
        <h3 class="review-title">车主评价 ({{ reviewTotal }})</h3>
        
        <van-list
          v-model:loading="reviewLoading"
          :finished="reviewFinished"
          finished-text="没有更多评论了"
          @load="onLoadReviews"
        >
          <div v-for="item in reviewList" :key="item.id" class="review-item">
            <div class="review-user">
              <van-image round width="32" height="32" :src="item.avatar" />
              <div class="user-meta">
                <span class="name">{{ item.nickname }}</span>
                <van-rate v-model="item.score" readonly allow-half size="12" />
              </div>
              <span class="time">{{ item.createTime }}</span>
            </div>
            <div class="review-content">{{ item.content }}</div>
            <div class="review-foot">
              <van-icon name="good-job-o" /> {{ item.likes }}
            </div>
          </div>
        </van-list>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCarDetail, getReviews } from '../api/car'

const route = useRoute()
const detail = ref(null)
const activeNames = ref(['发动机', '基础参数'])

// 评论相关变量
const showReviews = ref(false)
const reviewList = ref([])
const reviewLoading = ref(false)
const reviewFinished = ref(false)
const reviewTotal = ref(0)
const pageIndex = ref(1)

const fetchDetail = async () => {
  try {
    const res = await getCarDetail(route.params.id)
    detail.value = res
  } catch (err) { console.error(err) }
}

const openReviews = () => {
  showReviews.value = true
}

const onLoadReviews = async () => {
  try {
    const res = await getReviews({
      modelId: route.params.id,
      pageIndex: pageIndex.value,
      pageSize: 5
    })
    reviewList.value.push(...res.list)
    reviewTotal.value = res.total
    reviewLoading.value = false
    if (reviewList.value.length >= res.total) {
      reviewFinished.value = true
    } else {
      pageIndex.value++
    }
  } catch (err) {
    reviewFinished.value = true
  }
}

onMounted(fetchDetail)
</script>

<style scoped>
/* 原有样式保留 */
.info-card { padding: 15px; background: #fff; margin-bottom: 10px; }
.price-row { color: #ee0a24; margin-bottom: 8px; }
.price { font-size: 24px; font-weight: bold; }
.title { font-size: 18px; font-weight: bold; }
.model { font-size: 14px; color: #666; margin-top: 5px; }
.spec-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f2f3f5; font-size: 13px; }
.spec-item .label { color: #969799; }
.spec-item .value { color: #323233; font-weight: 500; }
.detail-page { padding-bottom: 60px; background: #f7f8fa; min-height: 100vh; }

/* 评论样式 */
.review-container { padding: 20px 16px; }
.review-title { text-align: center; margin-bottom: 20px; font-size: 16px; }
.review-item { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
.review-user { display: flex; align-items: center; margin-bottom: 10px; }
.user-meta { margin-left: 10px; flex: 1; display: flex; flex-direction: column; }
.user-meta .name { font-size: 14px; font-weight: bold; }
.review-user .time { font-size: 12px; color: #999; }
.review-content { font-size: 14px; color: #333; line-height: 1.6; margin: 10px 0; }
.review-foot { font-size: 12px; color: #666; display: flex; align-items: center; }
</style>