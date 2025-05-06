<script setup>

import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import 'flowbite';
const router = useRouter()

const middleLinks = [
    { name: "Home", routeName: "home" },
    { name: "About", routeName: "home" },
    { name: "Convert", routeName: "home" },
    { name: "Settings", routeName: "home" },
];


const storeAuth = useAuthStore()


const logout = () => {
  storeAuth.logout()
  router.push({ name: 'home' })
}

</script>


<template>

    <nav class="bg-gray-100 dark:bg-darkSecondary dark:text-white top-0 left-0 right-0 z-50">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div class="flex items-center space-x-3 rtl:space-x-reverse sm:w-48 mb-1">
            <span class="text-2xl">⚙️</span>
            <span class="sm:block text-lg font-semibold name_and_image"
                >JSON to FHIR</span>
        </div>
    
        <div class=" ml-5 flex items-center md:order-2 space-x-3 md:space-x-0 justify-end rtl:space-x-reverse w-fit md:w-40">
          <div class="hidden md:block md:w-64 text-right">
            <RouterLink :to="{ name: 'login' }" v-if="!storeAuth.user"
                class="hover:text-gray-400 duration-300 transition">
                Login
            </RouterLink>
        <div v-else class="hidden md:block md:w-64 text-right space-x-2">
            <p class="inline">Hello, {{storeAuth.userFirstName}} |</p>
            <button 
                class="hover:text-gray-400 duration-300 transition"
                @click="logout"
            >Logout</button>
        </div>

          </div>
    
          <button data-collapse-toggle="navbar-user" type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-800 dark:text-white rounded-lg md:hidden focus:outline-none focus:ring-gray-600">
            <span class="sr-only">Open main menu</span>
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path class="stroke-current" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15" />
            </svg>
            </button>
        </div>
    
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-transparent rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0">
            <li class="mt-5 md:mt-0">
              <RouterLink :to="{ name: 'home' }"
                class="block text-black dark:text-white rounded">Home</RouterLink>
            </li>
            <li v-if="storeAuth.user" class="mt-5 md:mt-0">
              <RouterLink :to="{ name: 'load' }"
                class="block text-black dark:text-white rounded">Convert</RouterLink>
            </li>
            <li v-if="storeAuth.user" class="mt-5 md:mt-0">
              <RouterLink :to="{ name: 'load' }"
                class="block text-black dark:text-white rounded">Settings</RouterLink>
            </li>
            <li v-if="storeAuth.user" class="md:hidden mt-5 md:mt-0 flex flex-wrap justify-between items-center">
              <p>Hello, {{storeAuth.userFirstName}}</p>
              <button class="hover:text-gray-400 duration-300 transition mt-5" @click="logout">Logout</button>
            </li>
            <li v-else class="md:hidden mt-5 md:mt-0 flex flex-wrap justify-between items-center">
              <RouterLink :to="{ name: 'login' }" v-if="!storeAuth.user"
                class="hover:text-gray-400 duration-300 transition">
                Login
            </RouterLink>
            </li>
          </ul>
        </div>
    
      </div>
    </nav>
    
</template>
    

<style scoped>
    @media (max-width: 330px) {
    .name_and_image {
        display: none;
    }
    }
</style>