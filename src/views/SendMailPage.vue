<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>发送邮件</ion-title>
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

      <!-- 发送按钮 -->
      <ion-button id="sendButton" expand="full" color="primary" @click="sendMail" class="send-button">
        <ion-icon slot="start" :icon="sendOutline"></ion-icon>
        发送邮件
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
  IonIcon,
  IonLoading, // 引入加载动画组件
} from '@ionic/vue';
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import axios from 'axios';
import { apiFormDataClient } from '@/services/api';
import { sendOutline, closeCircleOutline, documentOutline, attachOutline } from 'ionicons/icons'; // 引入图标

// 定义状态变量
const toAddress = ref('');
const subject = ref('');
const content = ref('');
const attachments = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

// 定义加载动画状态变量
const isLoading = ref(false);
const loadingMessage = ref('正在发送邮件，请稍候...');

// 使用用户存储
const userStore = useUserStore();

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
    attachments.value = [...attachments.value, ...newFiles]; // 追加新文件到现有附件列表中
  }
};

// 移除附件
const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1); // 从附件列表中移除指定索引的附件
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

  const sendConfirm = await alertController.create({
    header: '是否发送',
    buttons: [
      {
        text: '取消',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
      },
      {
        text: '确认',
        role: 'confirm',
        cssClass: 'alert-button-confirm',
        handler: async () => {
          // 显示加载动画
          isLoading.value = true;

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
            // 异步发送邮件
            const response = await apiFormDataClient.post('/api/mail/send', formData);

            // 成功后的提示框
            const successAlert = await alertController.create({
              header: '成功',
              message: response.data.message || '邮件发送成功！',
              buttons: ['确认'],
            });
            await successAlert.present();
          } catch (error) {
            // 捕获错误后的提示框
            const errorAlert = await alertController.create({
              header: '发送失败',
              message: '发送邮件失败，请稍后重试',
              buttons: ['确认'],
            });
            await errorAlert.present();
            console.error('发送邮件失败:', error);
          } finally {
            // 关闭加载动画
            isLoading.value = false;
          }
        },
      },
    ],
  });

  await sendConfirm.present();
};
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
	/* 输入框与下一个元素的间距 */
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
