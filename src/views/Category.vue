<template>
  <div class="category-page">
    <van-nav-bar title="品牌选车" fixed placeholder />

    <van-index-bar :index-list="indexList" sticky-offset-top="46" highlight-color="#ee0a24">
      <div v-for="group in brandGroups" :key="group.initial">
        <van-index-anchor :index="group.initial" class="custom-anchor" />
        
        <van-cell 
          v-for="brand in group.list" 
          :key="brand.id" 
          :title="brand.name"
          is-link
          center
          size="large"
          class="brand-card"
          @click="onBrandClick(brand)"
        >
          <template #icon>
            <div class="logo-wrapper">
              <van-image
                width="45"
                height="45"
                fit="contain"
                :src="brand.logo"
                lazy-load
              />
            </div>
          </template>
        </van-cell>
      </div>
    </van-index-bar>

    <div class="footer-space"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 品牌数据列表
const indexList = ref(['A', 'B', 'F', 'T'])
const brandGroups = ref([
  {
    initial: 'A',
    list: [{ id: 4, name: '奥迪', logo: 'https://dummyimage.com/100/7f8c8d/fff&text=Audi' }]
  },
  {
    initial: 'B',
    list: [
      { id: 3, name: '宝马', logo: 'https://dummyimage.com/100/2980b9/fff&text=BMW' },
      { id: 1, name: '本田', logo: 'https://dummyimage.com/100/c0392b/fff&text=Honda' },
      { id: 5, name: '比亚迪', logo: 'https://dummyimage.com/100/d35400/fff&text=BYD' }
    ]
  },
  {
    initial: 'F',
    list: [{ id: 2, name: '丰田', logo: 'https://dummyimage.com/100/bdc3c7/000&text=Toyota' }]
  },
  {
    initial: 'T',
    list: [{ id: 6, name: '特斯拉', logo: 'https://dummyimage.com/100/c0392b/fff&text=Tesla' }]
  }
])

const onBrandClick = (brand) => {
  router.push({
    path: '/home',
    query: { brandId: brand.id, brandName: brand.name }
  })
}
</script>

<style scoped>
.category-page {
  background-color: #f7f8fa;
  min-height: 100vh;
}

/* 锚点样式：吸顶效果更明显 */
.custom-anchor {
  background-color: #f7f8fa;
  color: #969799;
  font-size: 14px;
  line-height: 32px;
}

/* 品牌卡片：撑满宽度，增加高度 */
.brand-card {
  padding: 16px;
  margin-bottom: 1px; /* 细微线条分隔 */
}

.logo-wrapper {
  width: 45px;
  height: 45px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  /* 增加轻微投影，让 Logo 更有立体感 */
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* 调整右侧索引字符间距，防止点击太挤 */
:deep(.van-index-bar__index) {
  padding: 4px 8px;
  font-size: 12px;
  line-height: 1.5;
}

.footer-space {
  height: 60px;
}

/* 品牌文字样式 */
:deep(.van-cell__title) {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
}
</style>