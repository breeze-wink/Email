<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>发送邮件</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content :fullscreen="true" class="ion-padding custom-content">
			<!-- 收件人 -->

			<ion-label position="stacked" class="transparent-label">收件人</ion-label>
			<ion-input v-model="toAddress" type="email" placeholder="请输入收件人邮箱" class="white-input"></ion-input>


			<!-- 主题 -->

			<ion-label position="stacked" class="transparent-label">主题</ion-label>
			<ion-input v-model="subject" type="text" placeholder="请输入邮件主题" class="white-input"></ion-input>


			<!-- 正文 -->

			<ion-label position="stacked" class="transparent-label">正文</ion-label>
			<ion-textarea v-model="content" placeholder="请输入邮件内容" class="white-textarea"></ion-textarea>


			<!-- 附件选择框 -->
			<div class="attachment-container">
				<ion-label class="attachment-label">附件</ion-label>
				<div class="attachment-box" @click="handleFileClick">
					<ion-icon name="add-outline" size="large"></ion-icon>
				</div>
				<input type="file" multiple ref="fileInput" @change="handleFileChange" style="display: none;" />
			</div>

			<!-- 附件名称列表 -->
			<div class="attachment-list" v-if="attachments.length > 0">
				<div v-for="(file, index) in attachments" :key="index" class="attachment-item">
					<ion-icon name="document-outline"></ion-icon>
					<span class="attachment-name">{{ file.name }}</span>
					<ion-icon name="close-circle-outline" 
					@click="removeAttachment(index)" 
					class="remove-icon"></ion-icon>
				</div>
			</div>
			



			<!-- 发送按钮 -->
			<ion-button expand="full" color="primary" @click="sendMail" class="send-button">
				<ion-icon slot="start" name="send-outline"></ion-icon>
				发送邮件
			</ion-button>
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
	IonLabel,
	IonInput,
	IonTextarea,
	IonButton,
	IonIcon,
} from '@ionic/vue';
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import axios from 'axios';
import { sendOutline, documentAttachOutline, closeCircleOutline } from 'ionicons/icons'; // 引入图标

// 定义状态变量
const toAddress = ref('');
const subject = ref('');
const content = ref('');
const attachments = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

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
		alert('请填写所有必填项');
		return;
	}

	const formData = new FormData();
	formData.append('userId', userStore.userId as string);
	formData.append('toAddress', toAddress.value);
	formData.append('subject', subject.value);
	formData.append('content', content.value);
	

	attachments.value.forEach((file) => {
		formData.append(`attachments`, file);
	});

	// 打印 FormData 的内容

	formData.forEach((value, key) => {
  	console.log(`${key}: ${value}`);
	});

	try {
		const response = await axios.post('/api/mail/send', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		alert(response.data.message);
	} catch (error) {
		console.error('发送邮件失败:', error);
		alert('发送邮件失败，请稍后重试');
	}
};
</script>

<style scoped>
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

.white-input,
.white-textarea {
	background: #ffffff;
	border-radius: 5px;
	margin-top: 10px;
	margin-bottom: 20px;
	/* 输入框与下一个元素的间距 */
	padding: 10px;
}

.white-textarea {
	height: 200px;
	/* 增加高度 */
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

</style>
