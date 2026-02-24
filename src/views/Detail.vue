<template>
  <div class="detail-page" v-if="detail">
    <van-nav-bar title="车型详情" left-arrow fixed @click-left="$router.back()" />
    <div style="height: 46px;"></div>

    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-if="detail.videoUrl">
        <video :src="detail.videoUrl" controls class="detail-video"></video>
      </van-swipe-item>
      <van-swipe-item v-for="(img, index) in detail.images" :key="index">
        <van-image width="100%" height="240" fit="cover" :src="img" lazy-load />
      </van-swipe-item>
      <van-swipe-item v-if="(!detail.images || detail.images.length === 0) && !detail.videoUrl">
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

    <van-divider content-position="left">参数配置</van-divider>
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

    <div class="review-preview">
      <van-cell title="用户评价" :value="'全部' + reviewTotal" is-link @click="showReviews = true" />
      <div v-if="reviewList.length === 0" class="no-data">暂无评价，快来抢沙发</div>
      <div v-else class="preview-item">
        <div class="u-info">
          <van-image round width="24" height="24" :src="reviewList[0].avatar" />
          <span class="u-name">{{ reviewList[0].nickname }}</span>
        </div>
        <div class="u-content van-multi-ellipsis--l2">{{ reviewList[0].content }}</div>
      </div>
    </div>

    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="评论" @click="showReviews = true" />
      <van-action-bar-icon icon="star-o" text="收藏" />
      <van-action-bar-button type="warning" text="写评价" @click="onClickWrite" />
      <van-action-bar-button type="danger" text="立即订购" />
    </van-action-bar>

    <van-popup v-model:show="showReviews" position="bottom" round closeable :style="{ height: '75%' }">
      <div class="popup-content">
        <h3 class="p-title">全部评价 ({{ reviewTotal }})</h3>
        <van-list
          v-model:loading="reviewLoading"
          :finished="reviewFinished"
          finished-text="没有更多了"
          @load="onLoadReviews"
        >
          <div v-for="item in reviewList" :key="item.id" class="review-item">
            <div class="u-info">
              <van-image round width="32" height="32" :src="item.avatar" />
              <div class="u-meta">
                <div class="u-name">{{ item.nickname }}</div>
                <van-rate v-model="item.score" readonly allow-half size="10" />
              </div>
              <span class="u-time">{{ item.createTime }}</span>
            </div>
            <div class="u-content">{{ item.content }}</div>
          </div>
        </van-list>
      </div>
    </van-popup>

    <van-popup v-model:show="showPost" position="bottom" round :style="{ height: '45%' }" @closed="resetPost">
      <div class="post-box">
        <div class="post-header">
          <span @click="showPost = false">取消</span>
          <span class="header-title">发表评价</span>
          <span class="submit-btn" @click="handlePost">发送</span>
        </div>
        <div class="rate-row">
          <span>综合评分：</span>
          <van-rate v-model="postData.score" allow-half />
        </div>
        <van-field
          v-model="postData.content"
          rows="4" autosize type="textarea" maxlength="200"
          placeholder="用车感受如何？快来分享吧..." show-word-limit class="post-input"
        />
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCarDetail, getReviews, postReview } from '../api/car'
import { showToast, showSuccessToast } from 'vant'

const route = useRoute()
const detail = ref(null)
const activeNames = ref(['基础参数', '安全配置'])

// 评论列表逻辑
const showReviews = ref(false)
const reviewList = ref([])
const reviewTotal = ref(0)
const reviewLoading = ref(false)
const reviewFinished = ref(false)
const pageIndex = ref(1)

// 发表评论逻辑
const showPost = ref(false)
const postData = ref({ score: 5, content: '' })

const fetchDetail = async () => {
  try {
    const res = await getCarDetail(route.params.id)
    detail.value = res
  } catch (err) { console.error(err) }
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

const onClickWrite = () => {
  if (!localStorage.getItem('car_token')) {
    showToast('请先登录')
    return
  }
  showPost.value = true
}

const handlePost = async () => {
  if (postData.value.content.length < 5) {
    showToast('内容不能少于5个字')
    return
  }
  try {
    await postReview({
      modelId: Number(route.params.id),
      score: postData.value.score,
      content: postData.value.content
    })
    showSuccessToast('发布成功')
    showPost.value = false
    // 重置评论列表并重新加载
    reviewList.value = []
    pageIndex.value = 1
    reviewFinished.value = false
    onLoadReviews()
  } catch (err) {}
}

const resetPost = () => {
  postData.value = { score: 5, content: '' }
}

onMounted(() => {
  fetchDetail()
  onLoadReviews()
})
</script>

<style scoped>
.detail-page { padding-bottom: 60px; background: #f7f8fa; min-height: 100vh; }
.detail-video { width: 100%; height: 240px; background: #000; display: block; }
.info-card { padding: 16px; background: #fff; }
.price-row { color: #ee0a24; margin-bottom: 4px; }
.price { font-size: 26px; font-weight: bold; }
.title { font-size: 18px; font-weight: bold; }
.model { font-size: 14px; color: #969799; margin-top: 4px; }

/* 配置项 */
.spec-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f2f3f5; font-size: 13px; }
.spec-item .label { color: #969799; }
.spec-item .value { color: #323233; font-weight: 500; }

/* 预览评论 */
.review-preview { background: #fff; margin-top: 10px; padding-bottom: 10px; }
.no-data { padding: 20px; text-align: center; color: #ccc; font-size: 13px; }
.preview-item { padding: 0 16px; }
.preview-item .u-info { display: flex; align-items: center; margin-bottom: 6px; }
.preview-item .u-name { font-size: 12px; margin-left: 8px; color: #666; }
.preview-item .u-content { font-size: 14px; color: #333; line-height: 1.5; }

/* 弹窗公共 */
.popup-content { padding: 40px 16px 20px; }
.p-title { text-align: center; font-size: 16px; margin-bottom: 20px; }
.review-item { padding: 15px 0; border-bottom: 1px solid #f2f3f5; }
.u-info { display: flex; align-items: center; }
.u-meta { margin-left: 10px; flex: 1; }
.u-name { font-size: 14px; font-weight: bold; }
.u-time { font-size: 12px; color: #999; }
.u-content { margin-top: 10px; font-size: 14px; color: #333; line-height: 1.6; }

/* 发布弹窗 */
.post-box { padding: 16px; }
.post-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; font-size: 16px; }
.header-title { font-weight: bold; }
.submit-btn { color: #ee0a24; font-weight: bold; }
.rate-row { display: flex; align-items: center; margin-bottom: 15px; font-size: 14px; }
.post-input { background: #f7f8fa; border-radius: 8px; }
</style>