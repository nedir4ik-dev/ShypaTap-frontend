<template>
    <div class="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div
            class="max-w-md w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-2xl">

            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Hasaba ýazylmak</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">ŞypaTap ulgamynda täze hasap dörediň</p>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adyňyz we
                        Familiýaňyz</label>
                    <input v-model="form.name" type="text" required
                        class="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition-colors text-sm"
                        placeholder="Atamyrat Amanow" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email
                        salgysy</label>
                    <input v-model="form.email" type="email" required
                        class="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition-colors text-sm"
                        placeholder="example@gmail.com" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Açar sözi
                    </label>
                    <input v-model="form.password" type="password" required
                        class="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 transition-colors text-sm"
                        placeholder="••••••••" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paroly
                        gaýtalaň</label>
                    <input v-model="form.password_confirmation" type="password" required minlength="8"
                        class="w-full px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm"
                        placeholder="Paroly gaýtalaň" />
                </div>

                <div v-if="errorMessage" class="text-xs text-red-600 dark:text-red-400 text-center font-medium">
                    {{ errorMessage }}
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 text-sm cursor-pointer mt-2">
                    {{ loading ? 'Hasap döredilýär...' : 'Hasaba ýazyl' }}
                </button>
            </form>

            <div class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Eýýäm hasabyňyz barmy?
                <router-link to="/login" class="text-blue-600 dark:text-blue-400 font-medium hover:underline">Giriş
                    etmek</router-link>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        // Laravel backend /api/register endpointine maglumat ugradyp baza ýazylýar
        await api.register(form.value)
        router.push('/login')
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Hasaba ýazylmakda ýalňyşlyk ýüze çykdy!'
    } finally {
        loading.value = false
    }
}
</script>