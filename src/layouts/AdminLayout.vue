<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
const router = useRouter()
const logout = async () => { await auth.logout(); router.push('/') }
const isDarkMode = ref(false)
const isSidebarOpen = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <div :class="{ 'dark': isDarkMode }"
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex transition-colors duration-300">

    <aside :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      class="fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300">
      <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
        <router-link to="/" class="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <i class="ti ti-heart-rate text-2xl"></i>
          <span>ŞypaTap</span>
        </router-link>
        <button @click="isSidebarOpen = false"
          class="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <i class="ti ti-x text-xl"></i>
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <router-link to="/admin/dashboard"
          class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          active-class="bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
          <i class="ti ti-layout-dashboard text-lg"></i>
          Dolandyryş paneli
        </router-link>

        <router-link to="/admin/appointments"
          class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          active-class="bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
          <i class="ti ti-calendar-event text-lg"></i>
          Bronlar
        </router-link>

        <router-link to="/admin/doctors"
          class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          active-class="bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
          <i class="ti ti-stethoscope text-lg"></i>
          Lukmanlar
        </router-link>

        <router-link to="/admin/users"
          class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          active-class="bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
          <i class="ti ti-users text-lg"></i>
          Ulanyjylar
        </router-link>

        <router-link to="/admin/clinics"
          class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          active-class="bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
          <i class="ti ti-building-hospital text-lg"></i>
          Klinikalar
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div class="text-sm">
            <p class="font-semibold leading-none">Administrator</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"></p>
          </div>
        </div>
        <button @click="logout" class="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
          title="Ulgamdan çykmak">
          <i class="ti ti-logout text-lg"></i>
        </button>
      </div>
    </aside>

    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 md:hidden"></div>
    <div class="flex-1 flex flex-col min-w-0">
      <header
        class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 flex items-center justify-between">
        <button @click="isSidebarOpen = !isSidebarOpen" class="md:hidden text-gray-600 dark:text-gray-300 p-2">
          <i class="ti ti-menu-2 text-2xl"></i>
        </button>

        <h1 class="text-lg font-bold text-gray-800 dark:text-gray-200 hidden sm:block">
          Dolandyryş Paneli
        </h1>

        <div class="flex items-center gap-3">
          <button @click="toggleDarkMode"
            class="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            <i v-if="isDarkMode" class="ti ti-sun text-xl"></i>
            <i v-else class="ti ti-moon text-xl"></i>
          </button>
        </div>
      </header>

      <main class="flex-1 p-4 md:p-8 overflow-y-auto">
        <router-view />
      </main>

    </div>
  </div>
</template>