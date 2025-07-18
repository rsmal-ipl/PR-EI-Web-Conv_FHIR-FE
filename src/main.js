import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import vue3GoogleLogin from 'vue3-google-login'
import i18n from './i18n'

const app = createApp(App)

const googleCliendId = import.meta.env.VITE_GOOGLE_CLIENT_ID

app.use(vue3GoogleLogin, {
    clientId: googleCliendId,
})

const apiDomain = import.meta.env.VITE_API_URL

axios.defaults.baseURL = `${apiDomain}/api`

app.use(i18n)
app.use(createPinia())
app.use(router)

app.provide('serverBaseUrl', apiDomain)

app.mount('#app')
