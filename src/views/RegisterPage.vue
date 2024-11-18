<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-header">
        <ion-title>注册</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true" scroll="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">注册</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="register-container">
        
        <ion-item>
          <ion-input placeholder="用户名" v-model="username" class="custom-input" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-input placeholder="密码" type="password" v-model="password" class="custom-input" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-input placeholder="邮箱" type="email" v-model="email" @input="validateEmail" class="custom-input" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-input placeholder="授权码" v-model="authorizationCode" class="custom-input" required></ion-input>
        </ion-item>
        <ion-button class="custom-button" @click="register">注册</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import appClient from '@/services/api';
import router from '@/router';

import { onMounted } from 'vue';

onMounted(() => {
  console.log('Register page mounted');
});

const username = ref('');
const password = ref('');
const authorizationCode = ref('');
const email = ref('');
const emailError = ref('');

const validateEmail = () => {
  if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'Invalid email format';
  } else {
    emailError.value = '';
  }
};
const register = async () => {
  try {
    const response = await appClient.post('/api/user/register', {
      username: username.value,
      password: password.value,
      email: email.value,
      authorizationCode: authorizationCode.value,
    });
    if (response.status === 201) {
      alert('注册成功');
      router.push('/loginTabs/login')
    }
  } catch (error: any) {
    alert(`注册失败: ${error.response && error.response.data && error.response.data.message ? error.response.data.message : error.message}`);
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
}
.register-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 35px;
}
.custom-header {
  --background: #5599FF; 
  display: flex;
  justify-content:center;
}
</style>
