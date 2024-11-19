<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>邮件分类</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="center-content">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">邮件分类</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- 2x2 网格布局 -->
      <ion-grid fixed>
        <ion-row>
          <!-- 草稿箱 -->
          <ion-col size="6">
            <ion-card @click="navigateTo('draft')">
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="documentOutline"></ion-icon>
                  草稿箱
                </ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <!-- 收件箱 -->
          <ion-col size="6">
            <ion-card color="tertiary" @click="navigateTo('mailTab')">
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="mailUnreadOutline"></ion-icon>
                  收件箱
                </ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row>
          <!-- 垃圾箱 -->
          <ion-col size="6">
            <ion-card @click="navigateTo('trash')">
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="trashOutline"></ion-icon>
                  垃圾箱
                </ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <!-- 发件箱 --> 
          <ion-col size="6">
            <ion-card @click="navigateTo('sent')">
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="sendOutline"></ion-icon>
                  发件箱
                </ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import {
  documentOutline,
  mailUnreadOutline,
  trashOutline,
  sendOutline,
} from 'ionicons/icons';

const router = useRouter();

// 导航函数，用于跳转到不同的邮箱界面
const navigateTo = (folder: string) => {
  router.push(`/MailTabs/${folder}`);
};
</script>

<style scoped>
/* 使用 flex 布局使内容垂直居中 */
.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: center;     /* 水平居中 */
  margin-top: 50px;

  padding: 0 16px;         /* 添加左右边距，避免内容紧贴屏幕边缘 */
  box-sizing: border-box;  /* 确保 padding 不影响整体布局 */
}

ion-card {
  text-align: center;
  --background: #f4f4f4;
  width: 90%; /* 控制卡片宽度，使其在小屏幕上更好显示 */
  margin: 10px auto; /* 给卡片添加一些上下的间距 */
}

ion-card-title {
  font-size: 1.2em;
  display: flex;
  align-items: center;
  gap: 10px;
}

ion-icon {
  font-size: 2em;
}
</style>
