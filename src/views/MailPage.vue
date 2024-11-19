<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
        <ion-back-button :icon="arrowBackCircleOutline" default-href="/MailTabs/categorizeTab" text="返回"></ion-back-button>
        </ion-buttons>
        <ion-title>收件箱</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        
      </ion-header>
      <ion-list>
        <ion-item v-for="mail in mails" :key="mail.id" @click="openMail(mail)">
          <ion-label>
            <h2>{{ mail.subject }}</h2>
            <p>{{ mail.fromAddress }}</p>
            <p>{{ formatDate(mail.sentTime) }}</p>
          </ion-label>
          <ion-icon 
            :icon="mail.isRead ? mailOpenOutline : mailUnreadOutline" 
            slot="start"
            :style="{ color: mail.isRead ? 'blue' : 'red' }">
          </ion-icon>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll @ionInfinite="loadMore">
        <ion-infinite-scroll-content loading-spinner="bubbles"></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonBackButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { arrowBackCircleOutline, mailOpenOutline, mailUnreadOutline } from 'ionicons/icons';
import router from '@/router';
import apiClient from '@/services/api';
import { useUserStore } from '@/store/user';

// 定义邮件类型
interface Mail {
  id: number;
  subject: string;
  fromAddress: string;
  sentTime: string;
  isRead: boolean;
}

const mails = ref<Mail[]>([]);
const pageNum = ref(1);
const pageSize = 10;
const userStore = useUserStore();

const fetchMails = async () => {
  try {
    const response = await apiClient.get<Mail[]>('/api/mail/inbox', {
      params: {
        userId: userStore.userId,
        pageNum: pageNum.value,
        pageSize: pageSize,
      },
    });
    mails.value.push(...response.data);
    pageNum.value++;
  } catch (error) {
    console.error('Failed to fetch mails:', error);
  }
};

const loadMore = async (event: Event) => {
  await fetchMails();
  (event.target as HTMLIonInfiniteScrollElement).complete();
};

const openMail = (mail : Mail) => {
 
  
  userStore.setMailId(mail.id);
  router.push(`/MailTabs/mailDetail`);
  if(!mail.isRead){
    mail.isRead = !mail.isRead;

  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

onMounted(() => {
  fetchMails();
});
</script>


<style scoped>
ion-item {
  --inner-padding-end: 10px;
}
</style>
