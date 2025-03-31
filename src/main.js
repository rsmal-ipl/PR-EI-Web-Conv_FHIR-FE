import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)

const apiDomain = import.meta.env.VITE_API_URL

axios.defaults.baseURL = `http://${apiDomain}/api`
app.use(createPinia())
app.use(router)

app.provide('serverBaseUrl', apiDomain)

app.mount('#app')
