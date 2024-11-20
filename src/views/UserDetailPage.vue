<template>
    <ion-page>
        <ion-header style="margin-bottom: 0;">
            <ion-toolbar color="dark">
                <ion-title>用户详情</ion-title>
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
            
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonIcon,
    IonButton,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonText,
    alertController
} from '@ionic/vue';
import { useUserStore } from '@/store/user';
import { ref, onMounted } from 'vue';
import appClient from '@/services/api';
import { useRouter, useRoute } from 'vue-router';
import { keyOutline, logOutOutline, pencilOutline } from 'ionicons/icons'; // 引入图标

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

interface User {
    username: string;
    email: string;
    pop3Server: string;
    smtpServer: string;
    pop3Port: number;
    smtpPort: number;
}

const user = ref<User | null>(null);
const detailId = ref<string | null>(null);

onMounted(async () => {
    detailId.value = route.query.detailId as string || null;
    console.log(detailId.value)
    try {
        const response = await appClient.get(`/api/administrator/${detailId.value}`);
        if (response.status === 200) {
            user.value = response.data;
        }
    } catch (error: any) {
        console.error('获取用户信息失败', error);
        alert(error.response?.data?.message || '获取用户信息失败请重试。');
    }
});


</script>

<style scoped>
.info-container {
    padding: 16px;
}

.logout-button {
    padding: 16px;
    --background: #828181;
    /* 覆盖 Ionic 的按钮背景色 */
}

.change-password-button {
    padding: 16px;
    --background: #9aa4e9;
    /* 覆盖 Ionic 的按钮背景色 */
}
</style>
