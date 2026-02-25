<template>
  <div class="category-page">
    <van-nav-bar title="品牌选车" fixed placeholder :border="false" class="nav-bar" />

    <van-index-bar 
      :index-list="indexList" 
      :sticky-offset-top="46" 
      highlight-color="#ee0a24"
    >
      <div v-for="group in brandGroups" :key="group.initial">
        <van-index-anchor :index="group.initial" class="anchor-title" />
        
        <div 
          v-for="brand in group.list" 
          :key="brand.id" 
          class="brand-row"
          @click="onBrandClick(brand)"
        >
          <van-image
            class="brand-logo"
            fit="contain"
            :src="brand.logo"
          />
          <div class="brand-name van-hairline--bottom">{{ brand.name }}</div>
        </div>
      </div>
    </van-index-bar>

    <div style="height: 60px;"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  background-color: #fff;
  width: 100%;
  min-height: 100vh;
}

.nav-bar {
  background-color: #fff;
}
.nav-bar::after {
  border-bottom: 1px solid #f2f3f5;
}

/* 锚点字母栏：浅灰色底，占满全宽 */
.anchor-title {
  background-color: #f7f8fa;
  color: #323233;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
  padding-left: 16px;
  width: 100%;
}

:deep(.van-index-anchor--sticky) {
  background-color: rgba(247, 248, 250, 0.9) !important;
  backdrop-filter: blur(8px);
}

/* 品牌行：Flex 布局，真正撑满左右边界 */
.brand-row {
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 16px; /* 左侧留白 */
  background-color: #fff;
}

.brand-row:active {
  background-color: #f2f3f5;
}

/* Logo 固定大小 */
.brand-logo {
  width: 40px;
  height: 40px;
  margin-right: 16px;
  flex-shrink: 0;
}

/* 品牌名字占据剩余全宽，底部带极细分割线 */
.brand-name {
  flex: 1;
  font-size: 16px;
  color: #323233;
  padding: 16px 0; /* 控制行高 */
  /* 让分割线不穿透到 Logo 下方 */
}

/* Vant 内置的极细下边框类 van-hairline--bottom 需要配合 position */
.van-hairline--bottom::after {
  border-bottom-color: #ebedf0;
}

/* 索引侧边栏，微调防止和右侧内容重叠 */
:deep(.van-index-bar__sidebar) {
  right: 0;
  padding: 10px 4px;
}
:deep(.van-index-bar__index) {
  padding: 2px 6px;
  line-height: 16px;
  font-size: 11px;
}
</style>