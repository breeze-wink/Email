<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
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
          <ion-input placeholder="用户名" v-model="username" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-input placeholder="密码" type="password" v-model="password" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-input placeholder="邮箱" type="email" v-model="email" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-input placeholder="授权码" v-model="authorizationCode" required></ion-input>
        </ion-item>
        <ion-button color="tertiary" shape="round" @click="register">注册</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import appClient from '@/services/api';

import { onMounted } from 'vue';

onMounted(() => {
  console.log('Register page mounted');
});

const username = ref('');
const password = ref('');
const email = ref('');
const authorizationCode = ref('');

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
    }
  } catch (error: any) {
    alert(`注册失败: ${error.response && error.response.data && error.response.data.message ? error.response.data.message : error.message}`);
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 35px;
}

</style>
