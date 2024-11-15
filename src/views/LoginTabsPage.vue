<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet :animated="false"></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="logintab" href="/loginTabs/login">
            <ion-icon :icon="logInOutline" />
            <ion-label>登陆</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="tab2" href="/loginTabs/register">
            <ion-icon :icon="personAddOutline" />
            <ion-label>注册</ion-label>
          </ion-tab-button>
  
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  <script lang="ts">
    import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
    import { ellipse, logInOutline, square, triangle, personAddOutline} from 'ionicons/icons';
  
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
          logInOutline,
          personAddOutline
        };
      },
    };
  </script>