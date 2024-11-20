// store/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as string | null,
    mailId: null as number | null, 
    send_permission: null as number | null,
    receive_permission: null as number | null,

  }),
  actions: {
    setUserId(id: string) {
      this.userId = id;
    },
    setMailId(id: number) { 
      this.mailId = id;
    },
    setSendPermission(permission: number) {
      this.send_permission = permission;
    },
    setReceivePermission(permission: number) {
      this.receive_permission = permission;
    }
  },
});
