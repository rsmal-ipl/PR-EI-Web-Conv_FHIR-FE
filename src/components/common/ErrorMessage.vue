<script setup>
const props = defineProps({
    errorMessage: {
        type: String,
        default: ''
    }
})
</script>
<template>
    <div class="text-red-500 text-sm mt-1" v-show="errorMessage">
        {{ errorMessage }}
    </div>
</template>