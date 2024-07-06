import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './assets/main.css'
import 'animate.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
