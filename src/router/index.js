import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth.js'
import ConvertView from '@/views/LoadView.vue'
import ConfigureView from '@/views/ConfigureView.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import HistoryView from '@/views/HistoryView.vue'
import ConversionView from '@/views/ConversionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/load',
      name: 'load',	
      component: ConvertView
    },
    {
      path: '/configure',
      name: 'configure',	
      component: ConfigureView
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    },
    {
      path: '/history',
      name: 'History',
      component: HistoryView
    },
    {
      path: '/conversion/:id',
      name: 'Conversion',
      component: ConversionView
    }

  ],
})


let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore()
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await storeAuth.restoreToken()
  }
  if (to.name == 'login' && (storeAuth.user)) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
