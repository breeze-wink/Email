<template>
    <ion-page>
        <ion-header style="margin-bottom: 0;">
            <ion-toolbar color="dark">
                <ion-title>好友列表</ion-title>
                <ion-buttons slot="end" @click="navigateToAddFriend">
                    <ion-button color="light">
                        <ion-icon :icon="addOutline" color="light" @click="navigateToAddFriend"></ion-icon>
                    </ion-button>
                </ion-buttons>
                        
                   
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">个人信息</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-list>
                <ion-item v-for="friend in friends" :key="friend.id">
                    <ion-label>
                        <h2>{{ friend.nickname }}</h2>
                        <p>{{ friend.email }}</p>
                    </ion-label>
                    <ion-icon :icon="sendOutline" slot="end"></ion-icon>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, alertController,IonButtons,IonButton } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { addOutline, searchOutline, sendOutline } from 'ionicons/icons';
import appClient from '@/services/api';
import { useUserStore } from '@/store/user';

interface Friend {
    id: number;
    nickname: string;
    email: string;
}

const friends = ref<Friend[]>([]);
const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
    try {
        const response = await appClient.get('/api/friends', { params: { userId: userStore.userId } });
        if (response.status === 200) {
            friends.value = response.data;
        }
    } catch (error: any) {
        console.error('获取好友列表失败', error);
        await showAlert('错误', error.response?.data?.message || '获取好友列表失败，请重试。');
    }
});


const navigateToAddFriend = () => {
    router.push('/MailTabs/addFriend');
};

// 使用 alertController 显示 alert
const showAlert = async (header: string, message: string) => {
    const alert = await alertController.create({
        header,
        message,
        buttons: ['确认'],
    });
    await alert.present();
};
</script>

<style scoped>
ion-item {
    --background: #f4f4f4;
    margin-bottom: 10px;
    border-radius: 8px;
}

ion-icon {
    font-size: 1.5em;
    color: var(--ion-color-primary);
}
</style>