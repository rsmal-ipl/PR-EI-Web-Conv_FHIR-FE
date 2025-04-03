<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'

const router = useRouter()

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
//   storeAuth.register(credentials.value)
}

onMounted(() => {
//   storeError.resetMessages()
})
</script>

<template>
 <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <span class="text-5xl block w-fit mx-auto noselect">⚙️</span>
            <h2 class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">Register a new Account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" action="#" method="POST">
                <div class="text-gray-900 dark:text-white">
                    <label for="name" class="block text-sm/6 font-medium">Name</label>
                    <div class="mt-2">
                        <Input type="text" name="name" class="dark:border-gray-400" autocomplete="username" v-model="credentials.email"/>
                        <!-- <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage> -->
                    </div>
                </div>
                <div class="text-gray-900 dark:text-white">
                    <label for="email" class="block text-sm/6 font-medium">Email address</label>
                    <div class="mt-2">
                        <Input type="email" name="email" class="dark:border-gray-400" autocomplete="username" v-model="credentials.email"/>
                        <!-- <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage> -->
                    </div>
                </div>
                <div class="text-gray-900 dark:text-white ">
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium">Password</label>
                    </div>
                    <div class="mt-2">
                        <Input type="password" name="password" class="dark:border-gray-400 mb-3" autocomplete="current-password" v-model="credentials.password"/>
                        <!-- <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage> -->
                    </div>
                </div>
                <div class="text-gray-900 dark:text-white ">
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium">Confirm Password</label>
                    </div>
                    <div class="mt-2">
                        <Input type="password" name="confirmPassword" class="dark:border-gray-400 mb-3" autocomplete="current-password" v-model="credentials.password"/>
                        <!-- <ErrorMessage :errorMessage="storeError.fieldMessage('confirmPassword')"></ErrorMessage> -->
                    </div>
                </div>
                <div>
                    <Button type="button" class="w-full mb-3" @click="register">Register</Button>
                    <Button class="w-full dark:text-white dark:bg-gray-800 dark:border-gray-400" variant="outline" @click="cancel">Cancel</Button>
                </div>
                <div class="text-sm">
                    <p class="font-semibold inline dark:text-white">Already a member?&nbsp;</p><RouterLink class="font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-500" :to="{ name: 'login' }">Sign in here!</RouterLink>
                 </div>
            </form>
        </div>
    </div>
</template>