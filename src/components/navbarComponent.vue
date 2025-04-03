<script setup>

const middleLinks = [
    { name: "Home", routeName: "home" },
    { name: "About", routeName: "home" },
    { name: "Convert", routeName: "home" },
    { name: "Settings", routeName: "home" },
];

</script>


<template>
  <nav class="bg-gray-100 dark:bg-gray-800 dark:text-white p-4 flex items-center justify-between border-b-2">
        <div class="flex items-center space-x-2">
            <span class="text-2xl">⚙️</span>
            <span class="text-lg font-semibold"
                >JSON to FHIR</span
            >
        </div>

        <div class="flex space-x-6">
            <RouterLink :to="{ name: link.routeName }" 
                v-for="link in middleLinks"

                class="hover:text-gray-400 duration-300 transition">
                {{ link.name }}
            </RouterLink>
        </div>

        <div class="flex space-x-6">
            <RouterLink :to="{ name: 'login' }"
                class="hover:text-gray-400 duration-300 transition">
                Login
            </RouterLink>
        </div>
    </nav>
</template>