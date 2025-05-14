<script setup>
import PageHeader from '@/components/PageHeader.vue';
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'
import { useErrorStore } from '@/stores/error'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router';
import { toast } from "@/components/ui/toast";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const storeError = useErrorStore()
const route = useRoute()
const storeAuth = useAuthStore()

let userId = ''
let token = ''

const credentials = ref({
    newPassword: '',
    newPasswordConfirm: ''
})

const cancel = () => {
    router.push({ name: 'home' })
}

const resetPassword = async () => {

    if (!userId || !token) {
        router.push({ name: 'home' })
        return
    }

    if (credentials.value.newPassword !== credentials.value.newPasswordConfirm) {
        toast({
            title: t('Error'),
            description: t('PasswordsDoNotMatch'),
            variant: 'destructive'
        })
        return
    }
    storeAuth.resetPassword(userId, token, credentials.value.newPassword)
}

onMounted(() => {
    userId = route.query.userId ?? ''
    token = route.query.token ?? ''

    if (!userId || !token) {
        router.push({ name: 'home' })
    }
})

</script >

<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <PageHeader :title="t('ResetPassword')" />

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="resetPassword">
                <div class="text-gray-900 dark:text-white">
                    <label for="newPassword" class="block text-sm/6 font-medium">{{t('NewPassword')}}</label>
                    <div class="mt-2">
                        <Input type="password" name="newPassword" class="dark:border-gray-400" autocomplete="current-password"
                            v-model="credentials.newPassword" />
                        <ErrorMessage :errorMessage="storeError.fieldMessage('NewPassword')"></ErrorMessage>
                    </div>
                </div>
                <div class="text-gray-900 dark:text-white">
                    <div class="flex items-center justify-between">
                        <label for="newPasswordConfirm" class="block text-sm/6 font-medium">{{t('ConfirmNewPassword')}}</label>
                    </div>
                    <div class="mt-2">
                        <Input type="password" name="newPasswordConfirm" class="dark:border-gray-400 mb-3"
                            autocomplete="current-password" v-model="credentials.newPasswordConfirm" />
                        <ErrorMessage :errorMessage="storeError.fieldMessage('ConfirmPassword')"></ErrorMessage>
                    </div>
                </div>
                <div>
                    <Button type="submit" class="w-full mb-3">{{ t('Confirm') }}</Button>
                    <Button class="w-full dark:text-white dark:bg-gray-800 dark:border-gray-400" variant="outline"@click="cancel">{{ t('Cancel') }}</Button>
                </div>
            </form>
        </div>
    </div>      
</template>