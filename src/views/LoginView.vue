<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { GoogleLogin } from 'vue3-google-login'
import { toast } from '@/components/ui/toast'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()
const storeAuth = useAuthStore()
const storeError = useErrorStore()

const credentials = ref({
    email: '',
    password: '',
    recaptchaResponse: ''
})

const siteKey = '6LcevBArAAAAALx_2825UtGmnR66lc6n43rC6ctu'

const cancel = () => {
    router.push({ name: 'home' })
}

const login = () => {

    const token = grecaptcha.getResponse()
    if (!token) {
        toast({
            title: "reCAPTCHA Error!",
            description: "Please verify that you are not a robot.",
            variant: 'destructive'
        })
        return
    }
    credentials.value.recaptchaResponse = token
    storeAuth.login(credentials.value)
}

onMounted(() => {
    storeError.resetMessages()
    if (window.grecaptcha) {
        grecaptcha.ready(() => {
            grecaptcha.render('recaptcha-container', {
                sitekey: siteKey
            })
        })
    }
})

const callback = (response) => {
    if (response.credential) {
        storeAuth.loginWithGoogle(response)
    } else {
        toast({
            title: "Google Sign-in error!",
            description: "There was an issue signing in with Google. Please try again later.",
            variant: 'destructive'
        })
    }
}
</script>

<template>
    <div class="flex min-h-full flex-col justify-center mx-2 sm:mx-5 py-12 lg:mx-8">
        <PageHeader title="Sign in to your account"/>

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
                <div class="text-gray-900 dark:text-white">
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium">Password</label>
                    </div>
                    <div class="mt-2">
                        <Input type="password" name="password" class="dark:border-gray-400 mb-3"
                            autocomplete="current-password" v-model="credentials.password" />
                        <ErrorMessage :errorMessage="storeError.fieldMessage('Password')"></ErrorMessage>
                        <RouterLink
                            class="font-semibold  text-sm text-indigo-600 dark:text-indigo-300 hover:text-indigo-500 "
                            :to="{ name: 'forgot-password' }">Forgot your password?</RouterLink>
                    </div>
                </div>
                <div>
                    <div class="w-fit mx-auto mt-2">
                        <div id="recaptcha-container" class="g-recaptcha"></div>
                    </div>
                    <div class="w-fit mx-auto my-2">
                        <GoogleLogin :callback="callback" />
                    </div> 

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

<style scoped>
@media only screen and (max-width: 500px) {
    .g-recaptcha {
        transform:scale(0.77);
    }
}
</style>