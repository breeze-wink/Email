<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
        <ion-back-button :icon="arrowBackCircleOutline" default-href="/MailTabs/categorizeTab" text="返回"></ion-back-button>
        </ion-buttons>
        <ion-title>垃圾箱</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list v-if="!isLoading">
        <ion-item v-for="mail in mails" :key="mail.id" @click="openMail(mail)">
          <ion-label>
            <h2>{{ mail.subject }}</h2>
            <p>{{ mail.fromAddress }}</p>
            <p>{{ formatDate(mail.sentTime) }}</p>
          </ion-label>
          <ion-icon :icon="mailOutline" slot="start"></ion-icon>
        </ion-item>
      </ion-list>
      <ion-spinner v-if="isLoading" name="bubbles" color="primary"></ion-spinner>
      <ion-infinite-scroll @ionInfinite="loadMore">
        <ion-infinite-scroll-content loading-spinner="bubbles"></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonBackButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';
import { arrowBackCircleOutline, mailOutline } from 'ionicons/icons';
import router from '@/router';
import apiClient from '@/services/api';
import { useUserStore } from '@/store/user';

// 定义邮件类型
interface Mail {
  id: number;
  subject: string;
  fromAddress: string;
  sentTime: string;
}

const mails = ref<Mail[]>([]);
const pageNum = ref(1);
const pageSize = 10;
const isLoading = ref(true);
const userStore = useUserStore();
const shouldReloadMails = ref(true);


const fetchTrashMails = async (reset = false) => {
  try {
    // 清空之前的数据，确保重新获取
    if (reset) {
      mails.value = [];
      pageNum.value = 1;
    }
    const response = await apiClient.get<Mail[]>('/api/mail/trash', {
      params: {
        userId: userStore.userId,
        pageNum: pageNum.value,
        pageSize: pageSize,
      },
    });
    mails.value.push(...response.data);
    pageNum.value++;
  } catch (error) {
    console.error('Failed to fetch trash mails:', error);
  } finally {
    isLoading.value = false;
  }
};

const loadMore = async (event: Event) => {
  await fetchTrashMails();
  (event.target as HTMLIonInfiniteScrollElement).complete();
};

const openMail = (mail: Mail) => {
  userStore.setMailId(mail.id);
  router.push(`/MailTabs/trashDetail`);
  shouldReloadMails.value = true;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 页面进入时，重新加载邮件
onIonViewWillEnter(() => {
  if (shouldReloadMails.value) {
    shouldReloadMails.value = false;  // 防止重复加载
    fetchTrashMails(true);  // 每次进入页面时，重新获取最新数据
  }
});
</script>

<style scoped>
ion-item {
  --inner-padding-end: 10px;
}
</style>
