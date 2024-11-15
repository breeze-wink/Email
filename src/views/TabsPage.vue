<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="mailTab" href="/tabs/mailTab">
          <ion-icon :icon="triangle" />
          <ion-label>收件箱</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="sendMailTab" href="/tabs/sendMailTab">
          <ion-icon :icon="ellipse" />
          <ion-label>发送邮件</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="PersonalInfoTab" href="/tabs/PersonalInfoTab">
          <ion-icon :icon="square" />
          <ion-label>个人信息</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
  import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
  import { ellipse, square, triangle } from 'ionicons/icons';

  export default {
    name: 'Tabs',
    components: {
      IonLabel,
      IonTabs,
      IonTabBar,
      IonTabButton,
      IonIcon,
      IonPage,
      IonRouterOutlet,
    },
    setup() {
      return {
        ellipse,
        square,
        triangle,
      };
    },
  };
</script>