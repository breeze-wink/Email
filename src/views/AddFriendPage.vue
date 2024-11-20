<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="dark">
                <ion-buttons slot="start">
                    <ion-back-button :icon="arrowBackCircleOutline" default-href="/MailTabs/friendsTab" text="返回"></ion-back-button>
                </ion-buttons>
                <ion-title>添加好友</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">添加好友</ion-title>
                </ion-toolbar>
            </ion-header>

            <!-- 搜索栏 -->
      
            <div class="search-container">
                <ion-searchbar v-model="searchEmail" placeholder="输入好友邮箱地址"></ion-searchbar>
                <ion-button expand="full" @click="searchFriend" class="search-button">搜索</ion-button>
            </div>



            <!-- 搜索结果 -->
            <div v-if="searchResult">
                <ion-card>
                    <ion-card-header>
                        <ion-card-title>{{ searchResult.nickname }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <p>邮箱: {{ searchResult.email }}</p>
                    </ion-card-content>
                </ion-card>
                <ion-button expand="full" @click="addFriend" color="primary">添加好友</ion-button>
            </div>
            <div v-else-if="searchStatus === 'not_found'">
                <p>未查找到此用户</p>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonButtons, IonBackButton,IonItem,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    alertController,
    
} from '@ionic/vue';
import { ref } from 'vue';
import appClient from '@/services/api';
import { arrowBackCircleOutline } from 'ionicons/icons';

const searchEmail = ref('');
const searchResult = ref<null | { nickname: string; email: string }>(null);
const searchStatus = ref('');

// 搜索好友函数
const searchFriend = async () => {
    if (!searchEmail.value) {
        await showAlert('提示', '请输入好友邮箱地址');
        return;
    }

    try {
        const response = await appClient.get(`/api/user/search`, {
            params: { email: searchEmail.value }
        });

        if (response.status === 200 && response.data) {
            searchResult.value = response.data;
            searchStatus.value = 'found';
        } else {
            searchResult.value = null;
            searchStatus.value = 'not_found';
        }
    } catch (error: any) {
        console.error('搜索用户失败', error);
        await showAlert('错误', error.response?.data?.message || '搜索用户失败，请重试。');
    }
};

// 添加好友函数
const addFriend = async () => {
    try {
        const response = await appClient.post('/api/user/friends/add', {
            
            email: searchResult.value?.email
        });

        if (response.status === 200) {
            await showAlert('成功', '好友添加成功！');
        } else {
            await showAlert('失败', '好友添加失败，请重试。');
        }
    } catch (error: any) {
        console.error('添加好友失败', error);
        await showAlert('错误', error.response?.data?.message || '添加好友失败，请重试。');
    }
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


.search-container {
  display: flex;
  align-items: center;
}

.search-container ion-searchbar {
  flex: 1; /* 让搜索框占据剩余的空间 */
  margin-right: 10px; /* 搜索框与按钮之间的间距 */
}

.search-container ion-button {
  flex-shrink: 0; /* 按钮宽度保持不变 */
}


ion-card {
    margin-top: 20px;
}



</style>
