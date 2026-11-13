<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(true)
const updating = ref(false)
const message = ref('')
const success = ref(false)

const form = ref({
    name: '',
    phone: '',
    experience_years: '',
    consultation_fee: '',
    bio: ''
})

onMounted(async () => {
    try {
        const { data } = await api.client.get('/doctor/profile')
        console.log('Backend-den gelen jogap:', data)

        const doc = data.data || data

        form.value = {
            name: doc.name || doc.user?.name || '',
            phone: doc.phone || doc.user?.phone || '',
            experience_years: doc.experience_years ?? '',
            consultation_fee: doc.consultation_fee ?? '',
            bio: doc.bio || ''
        }
    } catch (e) {
        console.error('Maglumat alyp bolmady:', e)
        message.value = 'Profil maglumatlary ýüklener ýaly ýalňyşlyk ýüze çykdy.'
        success.value = false
    } finally {
        loading.value = false
    }
})

const updateProfile = async () => {
    updating.value = true
    message.value = ''
    try {
        const { data } = await api.client.patch('/doctor/profile', form.value)
        success.value = true
        message.value = data.message || 'Üýtgeşmeler üstünlikli saklandy!'
    } catch (e) {
        success.value = false
        message.value = e.response?.data?.message || 'Maglumatlary täzeden saklap bolmady.'
    } finally {
        updating.value = false
    }
}
</script>

<template>
    <section class="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">Lukman Şahsy Profili</h1>
            <router-link to="/doctor/dashboard" class="text-sm font-semibold text-emerald-600 hover:underline">
                &larr; Panelä gaýdyt
            </router-link>
        </div>

        <div v-if="loading" class="text-center py-12 text-slate-500">Maglumatlar ýüklenýär...</div>

        <div v-else
            class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6">
            <div v-if="message" class="p-4 rounded-2xl text-sm font-medium"
                :class="success ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200' : 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300 border border-red-200'">
                {{ message }}
            </div>

            <form @submit.prevent="updateProfile" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Doly adyňyz</label>
                    <input v-model="form.name" type="text" required
                        class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Telefon belgi</label>
                    <input v-model="form.phone" type="text" placeholder="+993..."
                        class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Iş tejribesi
                        (ýyl)</label>
                    <input v-model="form.experience_years" type="number" min="0"
                        class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Kabul ediş bahasy
                        (TMT)</label>
                    <input v-model="form.consultation_fee" type="number" step="0.01" min="0"
                        class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div class="space-y-1.5 md:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Biografiýa / Barada
                        maglumat</label>
                    <textarea v-model="form.bio" rows="4"
                        class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                </div>

                <div class="md:col-span-2 flex justify-end">
                    <button type="submit" :disabled="updating"
                        class="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2 disabled:opacity-50">
                        <i v-if="updating" class="ti ti-loader animate-spin text-lg"></i>
                        {{ updating ? 'Saklanýar...' : 'Üýtgeşmeleri sakla' }}
                    </button>
                </div>
            </form>
        </div>
    </section>
</template>