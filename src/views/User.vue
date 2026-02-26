<template>
  <div class="user-page">
    <van-nav-bar title="个人中心" fixed placeholder :border="false" />

    <div v-if="!isLogin" class="not-login">
      <van-icon name="user-circle-o" size="80" color="#ebedf0" />
      <p class="tips">登录后享受更完善的选车体验</p>
      <van-button type="primary" round block to="/login" class="login-btn">
        立即登录 / 注册
      </van-button>
    </div>

    <div v-else class="user-content">
      <div class="header-card" @click="openEdit">
        <van-image round width="64" height="64" :src="userInfo.avatar || defaultAvatar" class="avatar" />
        <div class="info">
          <div class="nickname">{{ userInfo.nickname || '车友_' + userInfo.phone?.slice(-4) }}</div>
          <div class="phone">绑定手机：{{ userInfo.phone }}</div>
        </div>
        <div class="edit-hint">
          <span>修改资料</span>
          <van-icon name="arrow" />
        </div>
      </div>

      <van-cell-group inset class="menu-group">
        <van-cell title="我的评论" icon="comment-o" is-link to="/my-reviews" />
        <van-cell title="我的收藏" icon="star-o" is-link to="/my-favorites" />
      </van-cell-group>

      <div class="logout-btn-box">
        <van-button block round class="logout-btn" @click="handleLogout">退出当前账号</van-button>
      </div>
    </div>

    <van-popup v-model:show="showEdit" position="right" :style="{ width: '100%', height: '100%', background: '#f7f8fa' }">
      <van-nav-bar title="编辑个人资料" left-arrow @click-left="showEdit = false" right-text="保存" @click-right="saveProfile" fixed placeholder />
      <div class="edit-form">
        <van-cell-group inset>
          <van-cell title="头像" center is-link @click="showAvatarPicker = true">
            <template #right-icon>
              <van-image round width="44" height="44" fit="cover" :src="editData.avatar || defaultAvatar" />
            </template>
          </van-cell>
          <van-field v-model="editData.nickname" label="用户昵称" placeholder="请输入新昵称" input-align="right" maxlength="12" clearable />
          <van-field v-model="userInfo.phone" label="手机号码" input-align="right" readonly class="readonly-field" />
        </van-cell-group>
      </div>
    </van-popup>

    <van-popup v-model:show="showAvatarPicker" position="bottom" round :style="{ height: 'auto', paddingBottom: '20px' }">
      <div class="avatar-picker-header">
        <span class="title">选择系统头像</span>
        <van-icon name="cross" class="close-btn" @click="showAvatarPicker = false" />
      </div>
      <van-grid :column-num="4" :border="false" class="avatar-grid">
        <van-grid-item v-for="(img, index) in presetAvatars" :key="index" @click="selectPresetAvatar(img)">
          <div :class="['preset-avatar-wrapper', { 'is-active': editData.avatar === img }]">
            <van-image round width="56" height="56" fit="cover" :src="img" />
            <div class="active-mask" v-if="editData.avatar === img"><van-icon name="success" color="#fff" size="24" /></div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo, updateUserInfo } from '../api/car'
import { showConfirmDialog, showToast, showSuccessToast } from 'vant'

const isLogin = ref(!!localStorage.getItem('car_token'))
const userInfo = ref({})
const defaultAvatar = 'https://dummyimage.com/100/ccc/fff&text=U'
const showEdit = ref(false)
const editData = ref({ nickname: '', avatar: '' })
const showAvatarPicker = ref(false)

const presetAvatars = [
  'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/dog.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/tree.jpeg',
  'https://fastly.jsdelivr.net/npm/@vant/assets/sand.jpeg',
  'https://dummyimage.com/150/ee0a24/fff&text=Car',
  'https://dummyimage.com/150/2980b9/fff&text=Boy',
  'https://dummyimage.com/150/8e44ad/fff&text=Girl'
]

const fetchUserInfo = async () => {
  if (!isLogin.value) return
  try {
    const res = await getUserInfo()
    userInfo.value = res
  } catch (err) {
    isLogin.value = false
    localStorage.removeItem('car_token')
  }
}

const handleLogout = () => {
  showConfirmDialog({ title: '退出确认', message: '确定要退出吗？' }).then(() => {
    localStorage.clear()
    isLogin.value = false
    userInfo.value = {}
  }).catch(() => {})
}

const openEdit = () => {
  editData.value.nickname = userInfo.value.nickname || ''
  editData.value.avatar = userInfo.value.avatar || presetAvatars[0]
  showEdit.value = true
}

const selectPresetAvatar = (url) => {
  editData.value.avatar = url
  showAvatarPicker.value = false
}

const saveProfile = async () => {
  if (!editData.value.nickname.trim()) return showToast('昵称不能为空')
  try {
    await updateUserInfo({ nickname: editData.value.nickname, avatar: editData.value.avatar })
    showSuccessToast('资料已更新')
    userInfo.value.nickname = editData.value.nickname
    userInfo.value.avatar = editData.value.avatar
    showEdit.value = false
  } catch (err) {}
}

onMounted(() => fetchUserInfo())
</script>

<style scoped>
.user-page { background-color: #f7f8fa; min-height: 100vh; }
.not-login { text-align: center; padding-top: 80px; }
.not-login .tips { color: #969799; font-size: 14px; margin: 20px 0 30px; }
.login-btn { width: 200px; margin: 0 auto; }
.header-card { display: flex; align-items: center; background-color: #fff; padding: 30px 20px; margin-bottom: 12px; }
.header-card .avatar { border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.header-card .info { flex: 1; margin-left: 16px; }
.header-card .nickname { font-size: 20px; font-weight: 600; color: #323233; }
.header-card .phone { font-size: 13px; color: #969799; margin-top: 6px; }
.edit-hint { display: flex; align-items: center; color: #969799; font-size: 13px; }
.menu-group { margin-top: 10px; }
.logout-btn-box { padding: 30px 16px; }
.logout-btn { color: #ee0a24; border: none; background: #fff; }
.edit-form { padding-top: 12px; }
.readonly-field { color: #c8c9cc; }
.avatar-picker-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; font-size: 16px; font-weight: bold; color: #323233; }
.close-btn { color: #969799; font-size: 20px; padding: 4px; }
.avatar-grid { padding: 0 10px; }
.preset-avatar-wrapper { position: relative; border-radius: 50%; border: 2px solid transparent; transition: all 0.2s; }
.preset-avatar-wrapper.is-active { border-color: #ee0a24; transform: scale(1.05); }
.active-mask { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
</style>