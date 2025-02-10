import { createApp } from 'vue';
import Toast from 'vue-toastification';
import 'vue-Toastification/dist/index.css';
import './assets/Style.css';
import App from './App.vue';

const app = createApp(App)
app.use(Toast);
app.mount('#app');

