<template>
  <div class="home-container">
    <div class="header-fixed" ref="headerRef">
      <van-nav-bar title="懂车小助手" />
      <van-search
        v-model="keyword"
        placeholder="搜索品牌或车型（如：本田、运动）"
        shape="round"
        background="#fff"
        @search="onSearch"
        @clear="onSearch"
      />
      <div v-if="brandId" class="filter-bar">
        <span class="filter-text">当前筛选：</span>
        <van-tag 
          closeable 
          size="medium" 
          type="primary" 
          color="#ee0a24" 
          @close="clearFilter"
        >
          {{ brandName }}
        </van-tag>
      </div>
    </div>

    <div :class="['header-placeholder', { 'has-filter': brandId }]"></div>

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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCarList } from '../api/car'

const route = useRoute()
const router = useRouter()

// 检索相关的状态
const keyword = ref('')
const brandId = ref(null)
const brandName = ref('')

// 列表相关的状态
const carList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageIndex = ref(1)

// 初始化筛选条件 (从选车页传过来的 query)
const initFilter = () => {
  if (route.query.brandId) {
    brandId.value = Number(route.query.brandId)
    brandName.value = route.query.brandName
  }
}

// 核心加载逻辑
const onLoad = async () => {
  try {
    if (refreshing.value) {
      carList.value = []
      pageIndex.value = 1
      refreshing.value = false
    }

    // 组装请求参数
    const params = {
      keyword: keyword.value,
      pageIndex: pageIndex.value,
      pageSize: 10
    }
    // 如果有品牌筛选，加入参数
    if (brandId.value) {
      params.brandId = brandId.value
    }

    const res = await getCarList(params)

    carList.value = [...carList.value, ...res.list]
    loading.value = false

    if (carList.value.length >= res.total || res.list.length === 0) {
      finished.value = true
    } else {
      pageIndex.value++
    }
  } catch (error) {
    loading.value = false
    finished.value = true
  }
}

// 搜索回调
const onSearch = () => {
  refreshing.value = true
  finished.value = false
  onLoad()
}

// 清除品牌筛选
const clearFilter = () => {
  brandId.value = null
  brandName.value = ''
  // 清除 URL 中的参数，防止刷新后参数还在
  router.replace({ path: '/home' }) 
  // 重新加载全量列表
  onSearch() 
}

// 下拉刷新回调
const onRefresh = () => {
  finished.value = false
  loading.value = true
  onLoad()
}

// 页面挂载时初始化参数
onMounted(() => {
  initFilter()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

/* 顶部固定布局 */
.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

/* 筛选提示条 */
.filter-bar {
  padding: 8px 16px 12px;
  background: #fff;
  display: flex;
  align-items: center;
  border-top: 1px solid #fcfcfc;
}
.filter-text {
  font-size: 13px;
  color: #666;
  margin-right: 8px;
}

/* 占位区：高度需匹配导航(46) + 搜索框(54) + 筛选条(44) */
.header-placeholder {
  height: 100px;
  transition: height 0.3s;
}
.header-placeholder.has-filter {
  height: 144px;
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
  min-width: 0;
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