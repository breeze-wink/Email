<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>登陆</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <div class="login-container">
        <ion-input placeholder="用户名" v-model="username"></ion-input>
        <ion-input placeholder="密码" type="password" v-model="password"></ion-input>
        <ion-button color="tertiary" shape="round" @click="login">Tertiary</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton } from '@ionic/vue';
import router from '@/router/index';
import appClient from '@/services/api';
import { ref } from 'vue';

const username = ref('');
const password = ref('');

const login = async () => {
  if (!username.value || !password.value) {
    alert('请输入用户名和密码');
    return;
  }
  try {
    const response = await appClient.post('/api/user/login', {
      username: username.value,
      password: password.value,
    });
    if (response.status === 200) {
      router.push('/tabs/mailTab');
    }
  } catch (error : any) {
    console.error('登陆失败', error);
    alert(error.response?.data?.message || '登录失败，请重试。');
  }
}

</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 35px;
}
</style>
