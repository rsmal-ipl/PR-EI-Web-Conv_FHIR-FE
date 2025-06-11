<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <section class="relative min-h-screen flex flex-col items-center px-4 py-12 overflow-hidden">

        <div class="absolute inset-0 hidden md:block">
            <div class="absolute top-[-40px] left-[-40px]">
                <svg width="120" height="120">
                    <circle fill="#a794b0" cx="60" cy="60" r="60" />
                </svg>
            </div>
            <div class="absolute bottom-[-60px] right-[-60px]">
                <svg width="140" height="140">
                    <circle fill="#e99a3f" cx="70" cy="70" r="70" />
                </svg>
            </div>
            <div class="absolute bottom-0 left-0">
                <svg width="180" height="80">
                    <rect fill="#e99a3f" x="0" y="0" width="180" height="80" rx="40" />
                </svg>
            </div>
            <div class="absolute top-1/2 right-0 transform -translate-y-1/2">
                <svg width="100" height="40">
                    <rect fill="#a794b0" x="0" y="0" width="100" height="40" rx="20" />
                </svg>
            </div>
        </div>

        <div class="text-center max-w-2xl w-full">
            <div class="flex flex-wrap md:justify-between justify-center items-center">

                <div>
                    <h1
                        class="text-xl font-bold mb-4 text-left grow text-center md:text-left text-black dark:text-white">
                        Convert JSON to FHIR Format</h1>
                    <div class="text-left mb-8 max-w-md text-center md:text-left text-black dark:text-white">
                        <br>
                        <h2 class="font-bold text-lg mb-1">Context</h2>
                        <p>JSON to FHIR conversion allows for the transformation of JSON data into the Fast Healthcare
                            Interoperability Resources (FHIR) standard.</p>
                    </div>
                </div>
                <img src="@/assets/homeSchemaLight.svg" alt="JSON to FHIR" class="w-fit h-64 mb-8 dark:hidden" />
                <img src="@/assets/homeSchemaDark.svg" alt="JSON to FHIR" class="w-fit h-64 mb-8 hidden hidden dark:block" />
            </div>
            <hr class="border-gray-300 mb-8 rounded" />

            <div class="max-w-2xl w-full mb-8 text-black dark:text-white">
                <h2 class="font-bold text-2xl mb-5">Advantages</h2>
                <div class="flex flex-wrap gap-8 justify-center">
                    <div class="max-w-xs">
                        <h3 class="font-semibold text-lg">Standardization</h3>
                        <p class="text-md">FHIR conversion ensures consistent and uniform data format.</p>
                    </div>
                    <div class="max-w-xs">
                        <h3 class="font-semibold text-lg">Interoperability</h3>
                        <p class="text-md">Facilitates data-exchange between different healthcare systems.</p>
                    </div>
                    <div class="max-w-xs">
                        <h3 class="font-semibold text-lg mt-2">Compliance</h3>
                        <p class="text-md">Meets regulatory and industry standards, such as those, HL7.</p>
                    </div>
                </div>
            </div>

            <hr class="border-gray-300 mb-8 rounded" />
            <div class="max-w-2xl w-full text-black dark:text-white">
                <h2 class="font-bold text-2xl mb-2">Instructions</h2>
                <ol class="list-decimal list-inside space-y-1">
                    <li>Import your JSON file.</li>
                    <li>Configure all the settings as needed.</li>
                    <li>Click on the "Convert" button.</li>
                </ol>
            </div>

            <hr class="border-gray-300 my-8 rounded" />

            <div class="max-w-2xl w-full mb-8 text-black dark:text-white">
                <h2 class="font-bold text-2xl mb-5">About</h2>
                <p class="text-base">This tool provides a seamless way to convert JSON data into the FHIR format, ensuring compliance with healthcare data standards.</p>
            </div>
        </div>
    </section>
</template>
