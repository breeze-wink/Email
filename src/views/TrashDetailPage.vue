<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="dark">
          <ion-buttons slot="start">
            <ion-back-button :icon="arrowBackCircleOutline" default-href="/MailTabs/trash" text="返回"></ion-back-button>
          </ion-buttons>
          <ion-title>邮件详情</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">邮件详情</ion-title>
          </ion-toolbar>
        </ion-header>
        <div v-if="mail">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ mail.subject }}</ion-card-title>
              <ion-card-subtitle>发件人: {{ mail.fromAddress }}</ion-card-subtitle>
              <ion-card-subtitle>收件人: {{ mail.toAddress }}</ion-card-subtitle>
              <ion-card-subtitle>时间: {{ formatDate(mail.sentTime) }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <p>{{ mail.content }}</p>
            </ion-card-content>
          </ion-card>
          <div v-if="mail.attachments.length > 0">
            <ion-list :inset="true">
              <ion-list-header color="light">
                <ion-label>附件</ion-label>
              </ion-list-header>
              <ion-item v-for="(attachment, index) in mail.attachments" :key="index">
                <ion-icon :icon="documentOutline" slot="start"></ion-icon>
                <ion-label>{{ attachment.fileName }}</ion-label>
                <ion-button size="default" fill="solid" color="primary" @click="downloadAttachment(attachment)" slot="end">
                    <ion-icon :icon="downloadOutline"></ion-icon>
                </ion-button>
              </ion-item>
            </ion-list>
          </div>
        </div>
        <div v-else class="loading-container">
          <ion-spinner></ion-spinner>
          <p>加载中...</p>
        </div>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-button expand="block" color="danger" @click="deleteMail">
            删除邮件
          </ion-button>
        </ion-toolbar>
      </ion-footer>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonFooter, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonListHeader, IonItem, IonLabel, IonIcon, IonButton, IonSpinner, IonBackButton, IonButtons } from '@ionic/vue';
  import { ref, onMounted } from 'vue';
  import apiClient from '@/services/api';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store/user';
import { arrowBackCircleOutline, documentOutline, downloadOutline } from 'ionicons/icons';
  
  interface Mail {
    id: number;
    userId: number;
    fromAddress: string;
    toAddress: string;
    subject: string;
    content: string;
    sentTime: string;
    isRead: boolean;
    attachments: Array<{
      fileName: string;
      fileType: string;
      fileData: string;
    }>;
  }
  
  const mail = ref<Mail | null>(null);
  const router = useRouter();
  const userStore = useUserStore();
  
  const fetchtTrashDetails = async () => {
    try {
      const mailId = userStore.mailId;
      const response = await apiClient.get<Mail>(`/api/mail/${mailId}`);
      mail.value = response.data;
    } catch (error) {
      console.error('Failed to fetch trash mail details:', error);
    }
  };
  
  const deleteMail = async () => {
  try {
    const mailId = userStore.mailId;
    await apiClient.delete(`/api/mail/${mailId}`);
    router.push('/MailTabs/trash');
  } catch (error) {
    console.error('Failed to delete mail:', error);
  }
  };

  const downloadAttachment = (attachment: { fileName: string; fileType: string; fileData: string }) => {
    const byteCharacters = atob(attachment.fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: attachment.fileType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = attachment.fileName;
    link.click();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  onMounted(() => {
    fetchtTrashDetails();
  });
  </script>
  
  <style scoped>
  ion-card {
    margin: 16px;
    --ion-card-background: #ffffff;
    --ion-card-border-radius: 10px;
    --ion-card-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  ion-list-header {
    font-weight: bold;
    font-size: 1.2rem;
    padding: 8px 16px;
    background: var(--ion-color-light);
  }
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  ion-item {
    --inner-padding-end: 10px;
    --background: #ffffff;
    margin: 8px 0;
    border-radius: 10px;
    --ion-item-box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }
  ion-button {
    --border-radius: 12px;
  }
  </style>
  