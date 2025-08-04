import './assets/scss/main.scss';

import { createApp } from 'vue';
import App from './App.vue';

import './telegram-web-app.js';

createApp(App).mount('#app');

window.Telegram.WebApp.ready();
