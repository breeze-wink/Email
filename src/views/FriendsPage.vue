<template>
    <ion-page>
        <ion-header>
            <ion-toolbar color="dark">
                <ion-title>好友列表</ion-title>
                <ion-buttons slot="end">
                    <ion-button color="light" @click="presentAddFriendAlert">
                        <ion-icon :icon="addOutline" color="light"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">好友列表</ion-title>
                </ion-toolbar>
            </ion-header>
            

            <ion-list>
                <ion-item v-for="friend in friends" :key="friend.friendId">
                    <ion-label>
                        <h2>{{ friend.friendName }}</h2>
                        <p>{{ friend.friendEmail }}</p>
                    </ion-label>
                    <ion-icon :icon="sendOutline" slot="end"  @click="sendToSb(friend.friendEmail)"></ion-icon>
                    <ion-icon :icon="closeOutline" slot="end"  @click="deleteFriend(friend.friendId)"></ion-icon>
                </ion-item>
            </ion-list>
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
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    alertController,
    IonButtons,
    IonButton
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { addOutline, closeOutline, sendOutline } from 'ionicons/icons';
import appClient from '@/services/api';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';

interface Friend {
    friendId: number;
    friendName: string;
    friendEmail: string;
}

const friends = ref<Friend[]>([]);
const userStore = useUserStore();
const searchResult = ref<{ userId: number; nickname: string; email: string } | null>(null);
const router = useRouter();


// 获取好友列表
onMounted(async () => {
    try {
        const response = await appClient.get('/api/user/friends', { params: { userId: userStore.userId } });
        if (response.status === 200) {
            friends.value = response.data.friends;
            console.log('好友列表:', response.data);  // 打印收到的好友列表信息
            console.log ('shuzu',friends.value);
        }
    } catch (error: any) {
        console.error('获取好友列表失败', error);
        await showAlert('错误', error.response?.data?.message || '获取好友列表失败，请重试。');
    }
});
const deleteFriend = async(FriendId: number) => {
    try{
        const response = await appClient.delete('/api/user/friend', { params: { userId: userStore.userId,friendId:FriendId } });
        if (response.status === 200) {
            friends.value = friends.value.filter(friend => friend.friendId !== FriendId);
            await showAlert('成功','成功删除该好友');
        }

    } catch(error: any) {
        console.error('获取好友列表失败', error);
        await showAlert('错误', error.response?.data?.message || '获取好友列表失败，请重试。');
    }

}


// 发送邮件函数
const sendToSb = (email: string) => {
  router.push({
    path: '/MailTabs/sendMailTab',
    query: { email: email },
  });
};



// 显示添加好友弹窗
const presentAddFriendAlert = async () => {
    const alert = await alertController.create({
        header: '添加好友',
        inputs: [
            {
                name: 'email',
                type: 'text',
                placeholder: '输入好友邮箱地址',
            },
        ],
        buttons: [
            {
                text: '取消',
                role: 'cancel',
            },
            {
                text: '搜索',
                handler: async (data: any) => {
                    const email = data.email;
                    if (!email) {
                        await showAlert('提示', '请输入好友邮箱地址');
                        return false;
                    }
                    await searchFriend(email);
                },
            },
        ],
    });
    await alert.present();
};

// 搜索好友函数
const searchFriend = async (email: string) => {
    try {
        const response = await appClient.get(`/api/user/search`, {
            params: { email: email }
        });

        if (response.status === 200 && response.data.userId) {
            // 检查该用户是否已经是好友
           
            if (friends.value && Array.isArray(friends.value) && friends.value.some(friend => friend.friendId === response.data.userId)) {
                await showAlert('提示', '该用户已经是您的好友');
                return;
            }
            
            searchResult.value = {
                userId: response.data.userId,
                nickname: response.data.username,
                email: email,
            };
            presentAddFriendConfirmation();
        } else {
            searchResult.value = null;
            await showAlert('提示', '未查找到此用户');
        }
    } catch (error: any) {
        console.error('搜索用户失败', error);
        await showAlert('错误', error.response?.data?.message || '搜索用户失败，请重试。');
    }
};

// 显示确认添加好友弹窗
const presentAddFriendConfirmation = async () => {
    const alert = await alertController.create({
        header: '添加好友',
        message: `用户名: ${searchResult.value?.nickname}`,
        buttons: [
            {
                text: '取消',
                role: 'cancel',
            },
            {
                text: '添加',
                handler: async () => {
                    await addFriend();
                },
            },
        ],
    });
    await alert.present();
};

// 添加好友函数
const addFriend = async () => {
    try {
        const response = await appClient.post('/api/user/addFriend', {
            userId: userStore.userId,
            friendId: searchResult.value?.userId,
        });

        if (response.status === 200 ) {
            friends.value.push({
                friendId: searchResult.value!.userId,
                friendName: searchResult.value!.nickname,
                friendEmail: searchResult.value!.email,
            });
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
