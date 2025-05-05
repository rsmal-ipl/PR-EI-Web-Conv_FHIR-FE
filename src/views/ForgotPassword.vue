<script setup>
import PageHeader from '@/components/PageHeader.vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'
import { useErrorStore } from '@/stores/error'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const storeError = useErrorStore()
const storeAuth = useAuthStore()

const email = ref('')

const cancel = () => {
    router.push({ name: 'login' })
}

const forgotPassword = () => {
    storeAuth.forgotPassword(email.value)
}
 
</script >

<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <PageHeader title="Forgot Password" />
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="forgotPassword">
                <div class="text-gray-900 dark:text-white">
                    <label for="email" class="block text-sm/6 font-medium">Email</label>
                    <div class="mt-2">
                        <Input type="email" name="email" class="dark:border-gray-400" autocomplete="username" v-model="email" />
                        <ErrorMessage :errorMessage="storeError.fieldMessage('Email')"></ErrorMessage>
                    </div>
                </div>
                <div>
                    <Button type="submit" class="w-full mb-3">Reset Password</Button>
                    <Button class="w-full dark:text-white dark:bg-gray-800 dark:border-gray-400" variant="outline"@click="cancel">Cancel</Button>
                </div>
            </form>
        </div>
    </div>      
</template>