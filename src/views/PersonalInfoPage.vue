<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>个人信息</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">个人信息</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="info-container" v-if="user">
        <ion-item>
          <ion-label>用户名: </ion-label>
          <ion-text>{{ user.username }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>邮箱: </ion-label>
          <ion-text>{{ user.email }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>POP3 服务器: </ion-label>
          <ion-text>{{ user.pop3Server }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>SMTP 服务器: </ion-label>
          <ion-text>{{ user.smtpServer }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>POP3 端口: </ion-label>
          <ion-text>{{ user.pop3Port }}</ion-text>
        </ion-item>
        <ion-item>
          <ion-label>SMTP 端口: </ion-label>
          <ion-text>{{ user.smtpPort }}</ion-text>
        </ion-item>
      </div>
       <!-- 退出登录按钮 -->
       <ion-button expand="full"  @click="logout" class="logout-button">
        <ion-icon :icon="logOutOutline"></ion-icon>
        退出登录
      </ion-button>

      
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonText } from '@ionic/vue';
import { useUserStore } from '@/store/user';
import { ref, onMounted } from 'vue';
import appClient from '@/services/api';
import { useRouter } from 'vue-router';
import { logOutOutline } from 'ionicons/icons'; // 引入 log-out 图标

const userStore = useUserStore();
const router = useRouter();

interface User {
  username: string;
  email: string;
  pop3Server: string;
  smtpServer: string;
  pop3Port: number;
  smtpPort: number;
}

const user = ref<User | null>(null);

onMounted(async () => {
  try {
    const response = await appClient.get(`/api/user/${userStore.userId}`);
    if (response.status === 200) {
      user.value = response.data;
    }
  } catch (error: any) {
    console.error('获取用户信息失败', error);
    alert(error.response?.data?.message || '获取用户信息失败请重试。');
  }
});

// 退出登录函数
const logout = () => {
  userStore.$reset(); // 清空用户数据
  router.push('/loginTabs/login'); // 跳转到登录页面
};

</script>

<style scoped>
.info-container {
  padding: 16px;
}
.logout-button {
  padding: 16px;
  --background: #828181; /* 覆盖 Ionic 的按钮背景色 */
}

</style>
