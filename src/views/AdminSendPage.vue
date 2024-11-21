<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="dark">
          <ion-title>发送邮件</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true" class="ion-padding custom-content">
        <!-- 收件人 -->
        <ion-item>
          <div class="recipient-input-container">
            <ion-chip
              v-for="(email, index) in recipientList"
              :key="index"
              class="recipient-chip"
            >
              <ion-label>{{ email }}</ion-label>
              <ion-icon :icon= "closeCircleOutline" @click="removeRecipient(index)"></ion-icon>
            </ion-chip>
            <ion-input label="收件人" label-placement="floating"
              v-model="newRecipient"
              type="email"
              placeholder="输入邮箱地址后按回车添加"
              @keydown.enter.prevent="addRecipient"
              class="recipient-input"
            ></ion-input>
          </div>
        </ion-item>
  
        <!-- 全部收件人选项 -->
        <ion-item lines="none" class="spacing-item">
          <ion-checkbox slot="start" v-model="sendToAll"></ion-checkbox>
          <ion-label>发送给所有人</ion-label>
        </ion-item>
  
        <!-- 主题 -->
        <ion-item class="spacing-item">
          <ion-input label="主题" label-placement="floating"  v-model="subject" type="text" placeholder="请输入邮件主题"></ion-input>
        </ion-item>
  
        <!-- 正文 -->
        <ion-item class="spacing-item">
          <ion-textarea label="正文" label-placement="floating" :auto-grow="true"
            v-model="content" placeholder="请输入邮件内容">
          </ion-textarea>
        </ion-item>
  
        <!-- 定时发送选项 -->
        <ion-item lines="none" class="spacing-item">
          <ion-checkbox slot="start" v-model="scheduledSend"></ion-checkbox>
          <ion-label>定时发送</ion-label>
          <div v-if="scheduledSend" class="datetime-container">
            <ion-icon :icon="alarmOutline" size="large"></ion-icon>
            <ion-datetime-button datetime="datetime"></ion-datetime-button>

            <ion-modal :keep-contents-mounted="true">
            <!-- 日期时间选择器 -->
            <ion-datetime 
              id="datetime" 
              v-model="selectedDate" 
              presentation="date-time" 
              @ionChange="updateSendTime">
            </ion-datetime>
          </ion-modal>

          </div>

          
        </ion-item>
  
        <!-- 附件选择框 -->
        <div class="attachment-container spacing-item">
          <ion-label class="attachment-label">附件</ion-label>
          <div class="attachment-box" @click="handleFileClick">
            <ion-icon :icon="attachOutline" size="large"></ion-icon>
          </div>
          <input type="file" multiple ref="fileInput" @change="handleFileChange" style="display: none;" />
        </div>
  
        <!-- 附件名称列表 -->
        <div class="attachment-list" v-if="attachments.length > 0">
          <div v-for="(file, index) in attachments" :key="index" class="attachment-item">
            <ion-icon :icon="documentOutline"></ion-icon>
            <span class="attachment-name">{{ file.name }}</span>
            <ion-icon
              :icon="closeCircleOutline"
              @click="removeAttachment(index)"
              class="remove-icon"
            ></ion-icon>
          </div>
        </div>
  
        <!-- 发送按钮 -->
        <ion-button id="sendButton" expand="block" color="primary" @click="sendMail" class="send-button">
          <ion-icon slot="start" :icon="sendOutline"></ion-icon>
          发送邮件
        </ion-button>
  
        <!-- 加载动画 -->
        <ion-loading :is-open="isLoading" :message="loadingMessage" spinner="crescent"></ion-loading>
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
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonItem,
    IonIcon,
    IonLoading,
    IonCheckbox,
    IonChip,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    alertController,
  } from '@ionic/vue';
  import { ref } from 'vue';
  import { useUserStore } from '@/store/user';
  import { apiFormDataClient } from '@/services/api';
  import {
    sendOutline,
    closeCircleOutline,
    documentOutline,
    attachOutline,
    alarmOutline,
  } from 'ionicons/icons';
  import { useRouter } from 'vue-router';
  
  // 定义状态变量
  const recipientList = ref<string[]>([]);
  const newRecipient = ref('');
  const sendToAll = ref(false);
  const subject = ref('');
  const content = ref('');
  const attachments = ref<File[]>([]);
  const fileInput = ref<HTMLInputElement | null>(null);
  const scheduledSend = ref(false);
  // 定义绑定变量
  const selectedDate = ref<string>(new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString());


  const sendTime = ref<string>(''); // 用于存储最终发送的时间



  
  // 定义加载动画状态变量
  const isLoading = ref(false);
  const loadingMessage = ref('正在发送邮件，请稍候...');
  
  // 使用用户存储
  const userStore = useUserStore();
  const router = useRouter();
  
  // 处理添加收件人
  const addRecipient = () => {
    const email = newRecipient.value.trim();
    if (email && validateEmail(email)) {
      if (!recipientList.value.includes(email)) {
        recipientList.value.push(email);
        newRecipient.value = '';
      } else {
        alertController
          .create({
            header: '提示',
            message: '该收件人已添加',
            buttons: ['确认'],
          })
          .then((alert) => alert.present());
      }
    } else {
      alertController
        .create({
          header: '警告',
          message: '请输入有效的邮箱地址',
          buttons: ['确认'],
        })
        .then((alert) => alert.present());
    }
  };
  const updateSendTime = (event: any) => {
  const selectedTime = event.detail.value;
  if (selectedTime) {
    const utcTime = new Date(selectedTime); // 选中的时间（UTC 时间）
    const localTime = new Date(utcTime.getTime() + 8 * 60 * 60 * 1000); // 加上8小时时差
    const formattedTime = localTime.toISOString().slice(0, 23); // 移除 Z 并保留毫秒部分
    sendTime.value = formattedTime; // 保存调整后的时间
    console.log('Formatted sendTime with time difference:', sendTime.value);
  }
};



  
  // 移除收件人
  const removeRecipient = (index: number) => {
    recipientList.value.splice(index, 1);
  };
  
  // 验证邮箱格式
  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(email);
  };
  
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
  if (!sendToAll.value && recipientList.value.length === 0) {
    const alert = await alertController.create({
      header: '警告',
      message: '请添加至少一个收件人或选择发送给所有人',
      buttons: ['确认'],
    });
    await alert.present();
    return;
  }

  if (!subject.value || !content.value) {
    const alert = await alertController.create({
      header: '警告',
      message: '请填写主题和内容',
      buttons: ['确认'],
    });
    await alert.present();
    return;
  }

  // 显示加载动画
  isLoading.value = true;

  // 创建表单数据
  const formData = new FormData();
  formData.append('userId', userStore.userId ? userStore.userId.toString() : '0'); // 使用 '0' 表示管理员

  if (sendToAll.value) {
    formData.append('sendToAll', 'true');
  } else {
    formData.append('sendToAll', 'false');
    recipientList.value.forEach((email) => {
      formData.append('receiveEmails', email);
    });
  }

  formData.append('subject', subject.value);
  formData.append('content', content.value);

  if (scheduledSend.value && sendTime.value) {
    formData.append('sendTime', sendTime.value);
  }

  attachments.value.forEach((file) => {
    formData.append('attachments', file);
  });

  // 异步发送请求，不等待其完成
  apiFormDataClient.post('/api/mail/group-send', formData).catch((error) => {
    console.error('发送邮件失败:', error);
  });

  // 模拟加载动画持续时间
  setTimeout(async () => {
    isLoading.value = false;

    // 显示成功提示框
    const successAlert = await alertController.create({
      header: '成功',
      message: '邮件已发送！',
      buttons: ['确认'],
    });
    await successAlert.present();

    // 清空输入框和附件列表
    recipientList.value = [];
    newRecipient.value = '';
    sendToAll.value = false;
    subject.value = '';
    content.value = '';
    attachments.value = [];
    scheduledSend.value = false;
    sendTime.value = '';
  }, 4000); // 设置为4秒
};

  </script>
  
  <style>
  .custom-content {
    padding: 20px;
  }
  
  .spacing-item {
    margin-top: 15px;
  }
  
  .recipient-input-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 0px;
  }
  
  .recipient-chip {
    margin: 5px 5px 0 0;
  }
  
  .recipient-input {
    flex: 1;
    min-width: 200px;
    margin-top: 5px;
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
  
  .send-button {
    margin-top: 20px;
  }
  
  .datetime-picker {
    width: 100%;
  }
  .datetime-container {
  display: flex;
  align-items: center;
  gap: 10px; /* 设置图标和按钮之间的间距 */
  }

  </style>
  