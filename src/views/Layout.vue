<template>
  <div class="layout-container">
    <div class="main-content">
      <router-view />
    </div>

    <van-tabbar 
      route 
      active-color="#ee0a24" 
      inactive-color="#939699" 
      safe-area-inset-bottom 
      class="custom-tabbar"
    >
      <van-tabbar-item replace to="/home">
        <span>首页</span>
        <template #icon="props">
          <van-icon 
            :name="props.active ? 'wap-home' : 'home-o'" 
            :class="{ 'icon-jump': props.active }" 
          />
        </template>
      </van-tabbar-item>
      
      <van-tabbar-item replace to="/category">
        <span>选车</span>
        <template #icon="props">
          <van-icon 
            name="apps-o" 
            :class="{ 'icon-jump': props.active, 'icon-pseudo-filled': props.active }" 
          />
        </template>
      </van-tabbar-item>
      
      <van-tabbar-item replace to="/user">
        <span>我的</span>
        <template #icon="props">
          <van-icon 
            :name="props.active ? 'manager' : 'user-o'" 
            :class="{ 'icon-jump': props.active }" 
          />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
// Layout 组件作为纯外壳，逻辑交给子路由处理，这里非常干净
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  /* 为底部导航预留空间，防止列表最底部的数据被遮挡 */
  padding-bottom: 50px; 
}

/* --- 高级 UI 定制 --- */

/* 1. 导航栏顶部增加轻微悬浮阴影，增加层次感 */
.custom-tabbar {
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
  z-index: 1000;
}

/* 2. 调整图标和文字的比例，使其更符合现代 App 审美 */
:deep(.van-tabbar-item__icon) {
  margin-bottom: 4px;
  font-size: 24px; /* 图标稍微放大 */
}
:deep(.van-tabbar-item__text) {
  font-size: 11px;
  font-weight: 500;
}

/* 3. 针对没有实心版本的图标，用 CSS 强行加粗模拟 */
.icon-pseudo-filled {
  font-weight: 900 !important;
  text-shadow: 0 0 1px #ee0a24; 
}

/* 4. 核心动效：果冻弹跳 (当图标被激活时触发) */
.icon-jump {
  animation: jelly 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes jelly {
  0% { transform: scale(1); }
  30% { transform: scale(0.85); }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
</style>