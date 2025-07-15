<script setup>
import { useRouter } from 'vue-router'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import ErrorMessage from '@/components//common/ErrorMessage.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/components/ui/toast'

const { t } = useI18n()

const router = useRouter()
const storeAuth = useAuthStore()
const storeError = useErrorStore()

const credentials = ref({
  email: '',
  name: '',
  password: '',
  passwordConfirm: '',
  recaptchaResponse: ''
})

const siteKey = "6LcevBArAAAAALx_2825UtGmnR66lc6n43rC6ctu"
const widgetId = ref(null)
let recaptchaInitialized = false

const cancel = () => {
  router.push({ name: 'home' })
}

const register = () => {
  if (!window.grecaptcha || widgetId.value === null) {
    toast({
      title: t('recaptcha_error_title'),
      description: t('recaptcha_not_loaded_message'),
      variant: 'destructive'
    })
    return
  }

  const token = grecaptcha.getResponse(widgetId.value)
  if (!token) {
    toast({
      title: t('recaptcha_error_title'),
      description: t('recaptcha_error_message'),
      variant: 'destructive'
    })
    grecaptcha.reset(widgetId.value)
    return
  }

  credentials.value.recaptchaResponse = token

  storeAuth.register(credentials.value)
    .catch(() => {
      grecaptcha.reset(widgetId.value)
    })
}

function loadReCaptchaScript() {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      return resolve(window.grecaptcha)
    }
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.grecaptcha)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  storeError.resetMessages()
  try {
    const grecaptcha = await loadReCaptchaScript()
    grecaptcha.ready(() => {
      if (!recaptchaInitialized && document.getElementById('recaptcha-register')) {
        recaptchaInitialized = true
        widgetId.value = grecaptcha.render('recaptcha-register', {
          sitekey: siteKey,
          callback: (response) => {
            credentials.value.recaptchaResponse = response
          },
          'expired-callback': () => {
            credentials.value.recaptchaResponse = ''
            grecaptcha.reset(widgetId.value)
            toast({
              title: t('recaptcha_expired_title'),
              description: t('recaptcha_expired_message'),
              variant: 'destructive'
            })
          }
        })
      }
    })
  } catch (error) {
    console.error('Erro ao carregar o reCAPTCHA:', error)
    toast({
      title: t('recaptcha_error_title'),
      description: t('recaptcha_not_loaded_message'),
      variant: 'destructive'
    })
  }
})

onBeforeUnmount(() => {
  if (window.grecaptcha && widgetId.value !== null) {
    window.grecaptcha.reset(widgetId.value)
    recaptchaInitialized = false
    widgetId.value = null
  }
})
</script>

<template>
 <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <PageHeader :title="t('RegisterNewAccount')"/>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="register">
                <div class="text-gray-900 dark:text-white">
                    <label for="name" class="block text-sm/6 font-medium">{{ t('Name') }}</label>
                    <div class="mt-2">
                        <Input type="text" name="name" class="dark:border-gray-400" autocomplete="username" v-model="credentials.name"/>
                        <ErrorMessage :errorMessage="storeError.fieldMessage('Name')"></ErrorMessage>
                    </div>
                </div>
                <div class="text-gray-900 dark:text-white">
                    <label for="email" class="block text-sm/6 font-medium">{{ t('Email_Address') }}</label>
                    <div class="mt-2">
                        <Input type="email" name="email" class="dark:border-gray-400" autocomplete="username" v-model="credentials.email"/>
                        <ErrorMessage :errorMessage="storeError.fieldMessage('Email')"></ErrorMessage>
                    </div>
                </div>
                <div class="text-gray-900 dark:text-white ">
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium">{{ t('Password') }}</label>
                    </div>
                    <div class="mt-2">
                        <Input type="password" name="password" class="dark:border-gray-400 mb-3" autocomplete="current-password" v-model="credentials.password"/>
                        <ErrorMessage :errorMessage="storeError.fieldMessage('Password')"></ErrorMessage>
                    </div>
                </div>
                <div class="text-gray-900 dark:text-white ">
                    <div class="flex items-center justify-between">
                        <label for="confirmPassword" class="block text-sm/6 font-medium">{{ t('Confirm_Password') }}</label>
                    </div>
                    <div class="mt-2">
                        <Input type="password" name="confirmPassword" class="dark:border-gray-400 mb-3" autocomplete="current-password" v-model="credentials.passwordConfirm"/>
                        <ErrorMessage :errorMessage="storeError.fieldMessage('ConfirmPassword')"></ErrorMessage>
                    </div>
                </div>
                <div class="w-fit mx-auto mt-2">
                    <div id="recaptcha-register" class="g-recaptcha"></div>
                </div>
                <div>
                    <Button type="submit" class="w-full mb-3">{{ t('Register') }}</Button>
                    <Button class="w-full dark:text-white dark:bg-gray-800 dark:border-gray-400" variant="outline" @click="cancel">{{ t('Cancel') }}</Button>
                </div>
                <div class="text-sm">
                    <p class="font-semibold inline dark:text-white">{{ t('Already_a_member') }}&nbsp;</p><RouterLink class="font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-500" :to="{ name: 'login' }">{{ t('SignIn_here') }}</RouterLink>
                 </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
@media only screen and (max-width: 500px) {
  .g-recaptcha {
    transform: scale(0.77);
  }
}
</style>