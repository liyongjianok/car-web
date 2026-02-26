<template>
  <div class="category-page">
    <van-nav-bar title="选车" fixed placeholder :border="false" />
    
    <div class="main-content">
      <div class="sidebar-wrapper">
        <van-sidebar v-model="activeBrandIndex" @change="onChangeBrand">
          <van-sidebar-item 
            v-for="brand in brandList" 
            :key="brand.id" 
            :title="brand.name" 
          />
        </van-sidebar>
      </div>

      <div class="car-list-wrapper">
        <van-empty v-if="carList.length === 0 && !loading" description="该品牌下暂无车型" />
        
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoadCars"
        >
          <div 
            class="car-card" 
            v-for="car in carList" 
            :key="car.id" 
            @click="$router.push(`/detail/${car.id}`)"
          >
            <van-image width="100%" height="110" fit="cover" radius="6" :src="car.coverImg" />
            <div class="car-info">
              <div class="car-name van-multi-ellipsis--l2">
                {{ car.brandName }} {{ car.series }} {{ car.modelName }}
              </div>
              <div class="car-price">{{ car.price }} 万起</div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCarBrands, getCarList } from '../api/car'

// 品牌相关状态
const brandList = ref([])
const activeBrandIndex = ref(0)
const currentBrandId = ref(null)

// 车型列表相关状态
const carList = ref([])
const loading = ref(false)
const finished = ref(false)
const pageIndex = ref(1)

// 1. 初始化拉取品牌列表
const initBrands = async () => {
  try {
    const res = await getCarBrands()
    brandList.value = res.list || []
    
    // 默认选中第一个品牌，并加载其对应的车型
    if (brandList.value.length > 0) {
      currentBrandId.value = brandList.value[0].id
      onLoadCars()
    } else {
      finished.value = true
    }
  } catch (err) {
    finished.value = true
  }
}

// 2. 左侧侧边栏切换品牌时触发
const onChangeBrand = (index) => {
  const selectedBrand = brandList.value[index]
  if (!selectedBrand) return

  currentBrandId.value = selectedBrand.id
  // 重置右侧列表状态，重新拉取新品牌的数据
  carList.value = []
  pageIndex.value = 1
  finished.value = false
  loading.value = true
  
  onLoadCars()
}

// 3. 右侧列表分页加载 (根据当前选中的 BrandId 查询)
const onLoadCars = async () => {
  if (!currentBrandId.value) return

  try {
    const res = await getCarList({
      brandId: currentBrandId.value, // 【重点】带上动态的 brandId 传给后端
      pageIndex: pageIndex.value,
      pageSize: 10
    })

    carList.value.push(...res.list)
    loading.value = false

    if (carList.value.length >= res.total || res.list.length === 0) {
      finished.value = true
    } else {
      pageIndex.value++
    }
  } catch (err) {
    loading.value = false
    finished.value = true
  }
}

onMounted(() => {
  initBrands()
})
</script>

<style scoped>
.category-page {
  background-color: #f7f8fa;
  min-height: 100vh;
  /* 为底部导航栏留出空间 */
  padding-bottom: 50px; 
}

.main-content {
  display: flex;
  height: calc(100vh - 46px - 50px); /* 减去顶部 NavBar 和底部 TabBar 的高度 */
}

/* 左侧侧边栏区域 */
.sidebar-wrapper {
  width: 85px;
  height: 100%;
  overflow-y: auto;
  background-color: #f7f8fa;
}

/* 覆盖 Vant sidebar 样式，使其更美观 */
:deep(.van-sidebar-item) {
  padding: 16px 12px;
  background-color: #f7f8fa;
}
:deep(.van-sidebar-item--select) {
  background-color: #fff;
  font-weight: bold;
  color: #ee0a24;
}
:deep(.van-sidebar-item--select::before) {
  background-color: #ee0a24;
}

/* 右侧列表区域 */
.car-list-wrapper {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  padding: 12px;
}

.car-card {
  margin-bottom: 16px;
  border-bottom: 1px solid #f2f3f5;
  padding-bottom: 16px;
}

.car-card:last-child {
  border-bottom: none;
}

.car-info {
  margin-top: 8px;
}

.car-name {
  font-size: 14px;
  font-weight: 600;
  color: #323233;
  line-height: 1.4;
}

.car-price {
  margin-top: 6px;
  color: #ee0a24;
  font-size: 15px;
  font-weight: bold;
}
</style>