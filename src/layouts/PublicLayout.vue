<template>
    <div
        class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Navbar />

        <main class="grow">
            <router-view />
        </main>
        <Footer />
    </div>
</template>

<script setup>
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
</script>