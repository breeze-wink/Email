import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.app',
  appName: 'mailApp',
  webDir: 'dist',
  server: {
    cleartext: true, // 允许 HTTP 请求（明文传输）
  },
  android: {
    webContentsDebuggingEnabled: true, // 启用调试模式（可选）
    allowMixedContent: true, // 允许混合内容
  },
};

export default config;
