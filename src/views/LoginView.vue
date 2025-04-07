<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import ErrorMessage from '@/components//common/ErrorMessage.vue'


const router = useRouter()
const storeAuth = useAuthStore()
const storeError = useErrorStore()

const credentials = ref({
    email: '',
    password: ''
})

const cancel = () => {
    router.push({ name: 'home' })
}

const login = () => {
    storeAuth.login(credentials.value)
}

onMounted(() => {
    storeError.resetMessages()
})
</script>

<template>
    <div class="flex min-h-full flex-col justify-center px-5 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <span class="text-5xl block w-fit mx-auto noselect">⚙️</span>
            <h2 class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">Sign in to
                your account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="login">
                <div class="text-gray-900 dark:text-white">
                    <label for="email" class="block text-sm/6 font-medium">Email address</label>
                    <div class="mt-2">
                        <Input type="email" name="email" class="dark:border-gray-400" autocomplete="username"
                            v-model="credentials.email" />
                        <ErrorMessage :errorMessage="storeError.fieldMessage('Email')"></ErrorMessage>
                    </div>
                </div>
                <div class="text-gray-900 dark:text-white ">
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium">Password</label>
                    </div>
                    <div class="mt-2">
                        <Input type="password" name="password" class="dark:border-gray-400 mb-3"
                            autocomplete="current-password" v-model="credentials.password" />
                        <ErrorMessage :errorMessage="storeError.fieldMessage('Password')"></ErrorMessage>
                        <RouterLink
                            class="font-semibold  text-sm text-indigo-600 dark:text-indigo-300 hover:text-indigo-500 "
                            :to="{ name: 'register' }">Forgot your password?</RouterLink>
                    </div>
                </div>
                <div>
                    <Button type="submit" class="w-full mb-3">Sign In</Button>
                    <Button class="w-full dark:text-white dark:bg-gray-800 dark:border-gray-400" variant="outline"
                        @click="cancel">Cancel</Button>
                </div>
                <div class="text-sm">
                    <p class="font-semibold inline dark:text-white">Not a member?&nbsp;</p>
                    <RouterLink class="font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-500"
                        :to="{ name: 'register' }">Register here!</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>