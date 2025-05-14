<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import ErrorMessage from '@/components//common/ErrorMessage.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const storeAuth = useAuthStore()
const storeError = useErrorStore()

const credentials = ref({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
})

const cancel = () => {
  router.push({ name: 'home' })
}

const register = () => {
   storeAuth.register(credentials.value)
}

onMounted(() => {
   storeError.resetMessages()
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