<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-back-button slot="start" v-if="isDraft" :icon="arrowBackCircleOutline" default-href="/MailTabs/drafts" text="返回"></ion-back-button>
        <ion-title>{{ isDraft ? '草稿邮件详情' : '发送邮件' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding custom-content">
      <!-- 收件人 -->
      <ion-input label="收件人" label-placement="floating" fill="solid" v-model="toAddress" type="email" 
                 placeholder="请输入收件人邮箱" class="white-input">
      </ion-input>

      <!-- 主题 -->
      <ion-input label="主题" label-placement="floating" fill="solid" v-model="subject" type="text" 
                placeholder="请输入邮件主题" class="white-input">
      </ion-input>

      <!-- 正文 -->
      <ion-textarea label="正文" label-placement="floating" :auto-grow="true"
       v-model="content" fill="solid" placeholder="请输入邮件内容">
      </ion-textarea>

      <!-- 附件选择框 -->
      <div class="attachment-container">
        <ion-label class="attachment-label">附件</ion-label>
        <div class="attachment-box" style="border: none;" @click="handleFileClick">
          <ion-icon :icon="attachOutline" size="large"></ion-icon>
        </div>
        <input type="file" multiple ref="fileInput" @change="handleFileChange" style="display: none;" />
      </div>

      <!-- 附件名称列表 -->
      <div class="attachment-list" v-if="attachments.length > 0">
        <div v-for="(file, index) in attachments" :key="index" class="attachment-item">
          <ion-icon :icon="documentOutline"></ion-icon>
          <span class="attachment-name">{{ file.name }}</span>
          <ion-icon :icon="closeCircleOutline" @click="removeAttachment(index)" class="remove-icon"></ion-icon>
        </div>
      </div>

      <!-- 发送/保存按钮 -->
      <ion-button id="sendButton" expand="block" color="primary" @click="sendMail" class="send-button">
        <ion-icon slot="start" :icon="sendOutline"></ion-icon>
        发送邮件
      </ion-button>
      <ion-button id="saveButton" expand="block" color="medium" @click="saveDraft" class="send-button">
        <ion-icon slot="start" :icon="saveOutline"></ion-icon>
        保存草稿
      </ion-button>
      <ion-button v-if="isDraft" expand="block" color="danger" @click="deleteMail" class="send-button">
      <ion-icon :icon="trashOutline"></ion-icon>
        删除草稿
      </ion-button>

      <!-- 加载动画 -->
      <ion-loading
        :is-open="isLoading"
        :message="loadingMessage"
        spinner="crescent"
      ></ion-loading>
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
  IonItem,
  IonAlert,
  alertController,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonBackButton,
  IonIcon,
  IonLoading,
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import {onIonViewWillEnter} from '@ionic/vue';
import apiClient from '@/services/api';
import { apiFormDataClient } from '@/services/api';
import {arrowBackCircleOutline, trashOutline,sendOutline, closeCircleOutline, documentOutline, attachOutline, saveOutline } from 'ionicons/icons';
import { useRouter, useRoute } from 'vue-router';

// 定义状态变量
const toAddress = ref('');
const subject = ref('');
const content = ref('');
const attachments = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const isDraft = ref(false);
const mailId = ref<string | null>(null);

// 定义加载动画状态变量
const isLoading = ref(false);
const loadingMessage = ref('正在发送邮件，请稍候...');

// 使用用户存储
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// 处理文件选择点击
const handleFileClick = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const newFiles = Array.from(target.files);
    attachments.value = [...attachments.value, ...newFiles];
  }
};

// 移除附件
const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1);
};

// 发送邮件
const sendMail = async () => {
  if (!toAddress.value || !subject.value || !content.value) {
    const alert = await alertController.create({
      header: '警告',
      message: '输入内容不能为空',
      buttons: ['确认'],
    });

    await alert.present();
    return;
  }

  // 显示加载动画
  isLoading.value = true;

  setTimeout(async () => {
  isLoading.value = false;

  // 显示成功提示框
  const successAlert = await alertController.create({
    header: '成功',
    message: '邮件已发送！',
    buttons: ['确认'],
  });
  await successAlert.present();

  // 清空 URL 查询参数
  router.replace({ path: '/MailTabs/sendMailTab' });

  // 清空输入框和附件列表
  toAddress.value = '';
  subject.value = '';
  content.value = '';
  attachments.value = [];
  isDraft.value = false;
  mailId.value = null;
}, 2000);


  // 创建表单数据
  const formData = new FormData();
  formData.append('userId', userStore.userId as string);
  formData.append('toAddress', toAddress.value);
  formData.append('subject', subject.value);
  formData.append('content', content.value);

  attachments.value.forEach((file) => {
    formData.append('attachments', file);
  });

  try {
    // 如果是草稿，则删除草稿
    if (isDraft.value && mailId.value) {
      await apiClient.delete(`/api/mail/${mailId.value}`);
    }
    // 异步发送邮件
    await apiFormDataClient.post('/api/mail/send', formData);
  } catch (error) {
    console.error('发送邮件失败:', error);
  }
};
const deleteMail = async () => {
  try {
    const mailId = userStore.mailId;
    await apiClient.delete(`/api/mail/${mailId}`);
    router.push('/MailTabs/drafts');
  } catch (error) {
    console.error('Failed to delete mail:', error);
  }
};
// 保存草稿
const saveDraft = async () => {
  if (!subject.value && !content.value) {
    const alert = await alertController.create({
      header: '警告',
      message: '草稿内容不能为空',
      buttons: ['确认'],
    });

    await alert.present();
    return;
  }

  // 创建表单数据
  const formData = new FormData();
  formData.append('userId', userStore.userId as string);
  formData.append('toAddress', toAddress.value);
  formData.append('subject', subject.value);
  formData.append('content', content.value);
  if (mailId.value) {
    formData.append('mailId', mailId.value);
  }

  attachments.value.forEach((file) => {
    formData.append('attachments', file);
  });

  try {
    // 异步保存草稿
    await apiFormDataClient.post('/api/mail/save', formData);
    const successAlert = await alertController.create({
      header: '成功',
      message: '草稿已保存！',
      buttons: ['确认'],
    });
  
    await successAlert.present();
  } catch (error) {
    console.error('保存草稿失败:', error);
  }
};

// 页面挂载时检查是否有草稿信息需要填充
onIonViewWillEnter(async () => {
  mailId.value = route.query.mailId as string || null;
  const friendEmail = route.query.email as string || null;
  if (mailId.value) {
    try {
      const response = await apiClient.get(`/api/mail/${mailId.value}`);
      const draftMail = response.data;
      toAddress.value = draftMail.toAddress;
      subject.value = draftMail.subject;
      content.value = draftMail.content;
      attachments.value = draftMail.attachments.map((attachment: { fileName: string; fileType: string; fileData: string }) => {
        return new File([new Uint8Array(atob(attachment.fileData).split('').map(c => c.charCodeAt(0)))], attachment.fileName, { type: attachment.fileType });
      });
      isDraft.value = true;
    } catch (error) {
      console.error('Failed to fetch draft details:', error);
    }
  }
  if (friendEmail) {
    toAddress.value = friendEmail;
  }
  
});
</script>

<style >
.custom-content {
  padding: 20px;
}

.custom-item {
  margin-bottom: 15px;
}

.transparent-label {
  font-weight: bold;

  background: transparent;
}

.white-input {
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 0px;
}

.attachment-container {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.attachment-label {
  font-weight: bold;
  margin-right: 10px;
}

.attachment-box {
  width: 50px;
  height: 50px;
  border: 2px dashed var(--ion-color-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.attachment-box ion-icon {
  color: var(--ion-color-primary);
}

.send-button {
  margin-top: 20px;
}

.attachment-container {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.attachment-label {
  font-weight: bold;
  margin-right: 10px;
}

.attachment-box {
  width: 50px;
  height: 50px;
  border: 2px dashed var(--ion-color-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 10px;
}

.attachment-box ion-icon {
  color: var(--ion-color-primary);
}

.attachment-list {
  margin-top: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.attachment-item ion-icon {
  color: var(--ion-color-medium);
  margin-right: 5px;
}

.attachment-name {
  font-size: 14px;
  color: var(--ion-color-dark);
}


.attachment-list {
  margin-top: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.attachment-item ion-icon {
  color: var(--ion-color-medium);
  margin-right: 5px;
}

.attachment-name {
  font-size: 14px;
  color: var(--ion-color-dark);
  margin-right: 10px;
}

.remove-icon {
  color: var(--ion-color-danger);
  cursor: pointer;
}

ion-alert.custom-alert {
  --backdrop-opacity: 0.7;
}

.custom-alert .alert-button-group {
  padding: 1px;
}
button.alert-button.alert-button-cancel {
    background-color: var(--ion-color-medium);
    color: var(--ion-color-success-contrast);
}
button.alert-button.alert-button-confirm {
    background-color: var(--ion-color-success);
    color: var(--ion-color-success-contrast);
}
</style>
