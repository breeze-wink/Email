<template>
  <ion-page>
    <ion-header >
      <ion-toolbar class="custom-header">
        <ion-title >邮件管理系统</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <div class="login-container">
        <ion-input class="custom-input" label-placement="stacked"  placeholder="请输入用户名" v-model="username"></ion-input>
        <ion-input class="custom-input" label-placement="stacked" placeholder="请输入密码" type="password" v-model="password">
      </ion-input>
        <ion-button class="custom-button" shape="round" @click="login">确认</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { alertController } from '@ionic/vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue';
import { eye, mailOutline } from 'ionicons/icons';
import router from '@/router/index';
import appClient from '@/services/api';
import { ref } from 'vue';
const userStore = useUserStore();
const username = ref('');
const password = ref('');

const login = async () => {
  if (!username.value || !password.value) {
    // 使用 Ionic 的 alertController 创建警告弹窗
    const alert = await alertController.create({
      header: '输入错误',
      message: '请输入用户名和密码',
      buttons: ['确定'],
      cssClass: 'alert-top'
    });
    await alert.present();
    return;
  }
  try {
    const response = await appClient.post('/api/user/login', {
      username: username.value,
      password: password.value,
    });
    if (response.status === 200) {
      const userId = response.data.id; // 假设 API 返回用户 ID
      userStore.setUserId(userId); // 设置全局用户 ID
      console.log(userStore.userId);
      router.push('/MailTabs/categorizeTab');
    }
  } catch (error: any) {
    console.error('登录失败', error);
    // 使用 Ionic 的 alertController 创建错误提示弹窗
    const errorAlert = await alertController.create({
      header: '登录失败',
      message: error.response?.data?.message || '登录失败，请重试。',
      buttons: ['确定'],
      cssClass: 'alert-top'
    });
    await errorAlert.present();
  }
};

</script>

<style scoped>
ion-alert {
  --backdrop-opacity: 0.5; /* 调整背景透明度 */
  --alert-header-padding-top: 20px; /* 调整头部内边距 */
  --alert-subheader-padding-top: 10px; /* 调整子头部内边距 */
  --alert-message-padding: 16px 24px; /* 调整消息内边距 */
  --alert-button-group-padding: 10px 24px; /* 调整按钮组内边距 */
  --alert-box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12); /* 添加阴影 */
}

ion-alert.alert-top {
  --alert-box-shadow: none; /* 移除阴影 */
  --alert-margin-top: 20vh; /* 调整弹窗顶部外边距 */
}
.custom-header {
  --background: #5599FF; 
  display: flex;
  justify-content:center;
}
ion-title {
  font-family: 'Arial', sans-serif; /* 设置字体 */
  color:white;
  text-align:center;
  font-size:18px;
}
.custom-button {
  --background:#5599FF;
  --border-radius: 4px;
}
.custom-input {
  background:white;
  border-radius: 4px;
  text-align: center;
}
.login-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 35px;
  margin-left:20px;
  margin-right:20px;
}
</style>
