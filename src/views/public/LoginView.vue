<template>
    <div class="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div
            class="max-w-md w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-2xl">

            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Ulgama Giriş</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">ŞypaTap hasabyňyza giriň ýa-da täze hasap
                    açyň</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email
                        salgysy</label>
                    <input v-model="form.email" type="email" required
                        class="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition-colors text-sm"
                        placeholder="example@gmail.com" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Açar sözi
                    </label>
                    <input v-model="form.password" type="password" required
                        class="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition-colors text-sm"
                        placeholder="••••••••" />
                </div>

                <div v-if="errorMessage" class="text-xs text-red-600 dark:text-red-400 text-center font-medium">
                    {{ errorMessage }}
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 text-sm cursor-pointer">
                    {{ loading ? 'Barlanylýär...' : 'Giriş etmek' }}
                </button>
            </form>

            <div class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Hasabyňyz ýokmy?
                <router-link to="/register" class="text-blue-600 dark:text-blue-400 font-medium hover:underline">Täze
                    hasaba ýazyl</router-link>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    email: '',
    password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    loading.value = true
    errorMessage.value = ''

    // Pinia store ýa-da API arkaly barlamak
    const result = await authStore.login(form.value)
    if (result.success) {
        router.push(authStore.dashboardPath())
    } else {
        errorMessage.value = result.message || 'Email ýa-da parol ýalňyş!'
    }
    loading.value = false
}
</script>