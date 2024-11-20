<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>邮件分类</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">邮件分类</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- 2x2 网格布局 -->
      <ion-grid :fixed="true">
        <ion-row class="center-content">
          <!-- 草稿箱 -->
          <ion-col size="6">
            <ion-card color="light" @click="navigateTo('draft')">
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

        <ion-row class="center-content">
          <!-- 垃圾箱 -->
          <ion-col size="6">
            <ion-card color="dark" @click="navigateTo('trash')">
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
            <ion-card color="medium" @click="navigateTo('outbox')">
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
  flex-direction: row;
  justify-content: center;
  align-items: center;    /* 水平居中 */
  margin-top: 50px; 
  --ion-grid-column-padding: 0px;
  padding: 0 20px;         /* 添加左右边距，避免内容紧贴屏幕边缘 */
  box-sizing: border-box;  /* 确保 padding 不影响整体布局 */
}

ion-card {
  text-align: center;
  --background: #f4f4f4;
  width: 90%; /* 控制卡片宽度，使其在小屏幕上更好显示 */
  height: 100px; /* 设定卡片的固定高度 */
  margin: 20px auto; /* 给卡片添加一些上下的间距 */
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 使内容纵向排列 */
  justify-content: center; /* 垂直居中内容 */
  align-items: center; /* 水平居中内容 */
}


ion-card-title {
  font-size: 1.4em;
  display: flex;
  align-items: center;
  gap: 10px;
}

ion-icon {
  font-size: 2em;
}
</style>
