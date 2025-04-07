import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error.js'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const storeError = useErrorStore()

    const user = ref(null)
    const token = ref('')
    const refreshToken = ref('')

    const userName = computed(() => {
        return user.value ? user.value.name : ''
    })

    const userFirstLastName = computed(() => {
        const names = userName.value.trim().split(' ')
        const firstName = names[0] ?? ''
        const lastName = names.length > 1 ? names[names.length - 1] : ''
        return (firstName + ' ' + lastName).trim()
    })

    const userEmail = computed(() => {
        return user.value ? user.value.email : ''
    })

    const userType = computed(() => {
        return user.value ? user.value.type : ''
    })


    const clearUser = () => {
        resetIntervalToRefreshToken()
        user.value = null
        token.value = ''
        refreshToken.value = ''
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('token')
        axios.defaults.headers.common.Authorization = ''
    }


    const login = async (credentials) => {
        storeError.resetMessages()
        try {
            const responseLogin = await axios.post('login', credentials)

            token.value = responseLogin.data.accessToken
            refreshToken.value = responseLogin.data.refreshToken

            localStorage.setItem('token', token.value)
            localStorage.setItem('refreshToken', refreshToken.value)

            axios.defaults.headers.common.Authorization = 'Bearer ' + token.value

            const responseUser = await axios.get('user/me')
            user.value = responseUser.data.user

            repeatRefreshToken()

            router.push({ name: 'home' })
            return user.value
        } catch (e) {
            clearUser()
            storeError.setErrorMessages(e.response.data.message,  e.response.data.errors, e.response.status, 'Authentication Error!')
            return false
        }
    }


    const register = async (credentials) => {
        storeError.resetMessages()
        try {

            if (credentials.password !== credentials.passwordConfirm) {
                
                const error = {
                    ConfirmPassword: ['Passwords do not match!']
                }
                storeError.setErrorMessages('Passwords do not match!', error, 422, 'Registration Error!')
                return true
            }

            const responseRegister = await axios.post('register', credentials)

            token.value = responseRegister.data.accessToken
            refreshToken.value = responseRegister.data.refreshToken

            localStorage.setItem('refreshToken', refreshToken.value)
            localStorage.setItem('token', token.value)

            axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
            const responseUser = await axios.get('user/me')
            user.value = responseUser.data.user

            repeatRefreshToken()

            router.push({ name: 'home' })

            return user.value
        } catch (e) {
            clearUser()
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Registration Error!')
            return false
        }
    }

    const logout = async () => {
        storeError.resetMessages()
        try {
            await axios.post('logout')
            clearUser()
            return true
        } catch (e) {
            clearUser()
            storeError.setErrorMessages(e.response.data.message, [], e.response.status, 'Authentication Error!')
            return false
        }
    }

    let intervalToRefreshToken = null

    const resetIntervalToRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken)
        }
        intervalToRefreshToken = null
    }

    const repeatRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken)
        }
        intervalToRefreshToken = setInterval(async () => {
            try {
                const response = await axios.post('refresh', {
                    email: userEmail.value,
                    refreshToken: localStorage.getItem('refreshToken')
                })
                token.value = response.data.accessToken
                refreshToken.value = response.data.refreshToken

                localStorage.setItem('token', token.value)
                localStorage.setItem('refreshToken', refreshToken.value)

                axios.defaults.headers.common.Authorization = 'Bearer ' + token.value

                return true
            } catch (e) {
                clearUser()
                storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
                return false
            }
        }, 1000 * 60 * 1) // Repete a cada 45 minutos
    }

    const restoreToken = async function () {
        let storedToken = localStorage.getItem('token')
        let storedRefreshToken = localStorage.getItem('refreshToken')
    
        if (storedToken && storedRefreshToken) {
            try {
                token.value = storedToken
                axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
    
                const responseUser = await axios.get('user/me')
                user.value = responseUser.data.user
    
                repeatRefreshToken()
    
                return true
            } catch {
                clearUser()
                return false
            }
        }
        return false
    }

    return {
        user, userName, userFirstLastName, userEmail, userType, restoreToken, register,
        login, logout
    }
})
