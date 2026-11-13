<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

const auth = useAuthStore()
const updating = ref(false)
const message = ref('')
const success = ref(false)

const form = ref({
    name: '',
    email: '',
    phone: ''
})

onMounted(async () => {
    if (auth.user) {
        form.value.name = auth.user.name || ''
        form.value.email = auth.user.email || ''
        form.value.phone = auth.user.phone || ''
    } else {
        try {
            const { data } = await api.client.get('/user')
            auth.user = data.data || data
            form.value.name = auth.user.name || ''
            form.value.email = auth.user.email || ''
            form.value.phone = auth.user.phone || ''
        } catch (e) {
            console.error('Ulanyjy maglumatlary alyp bolmady', e)
        }
    }
})

const updateProfile = async () => {
    updating.value = true
    message.value = ''
    try {
        const { data } = await api.client.put('/user/profile', {
            name: form.value.name,
            phone: form.value.phone
        })
        success.value = true
        message.value = 'Profil maglumatlaryňyz üstünlikli täzelendi!'
        if (auth.user) {
            auth.user.name = form.value.name
            auth.user.phone = form.value.phone
        }
    } catch (e) {
        success.value = false
        message.value = e.response?.data?.message || 'Maglumatlary üýtgedip bolmady.'
    } finally {
        updating.value = false
    }
}
</script>

<template>
    <section class="mx-auto max-w-7xl px-4 py-10 space-y-10">
        <div
            class="bg-linear-to-br from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div
                class="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none">
            </div>

            <div class="space-y-2 relative z-10 text-center md:text-left">
                <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold">
                    <i class="ti ti-user-check text-emerald-300"></i> Näsag Sahypasy
                </span>
                <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">
                    Hoş geldiňiz, {{ form.name || 'Näsag' }}!
                </h1>
                <p class="text-emerald-100/80 text-sm">
                    Kabul ýazgylaryňyzy yzarlaň, lukman saýlaň ýa-da şahsy maglumatlaryňyzy täzeläň.
                </p>
            </div>

            <div class="flex items-center gap-3 relative z-10">
                <router-link to="/patient/appointments"
                    class="px-5 py-3 rounded-2xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition shadow-lg flex items-center gap-2">
                    <i class="ti ti-calendar-event text-lg"></i> Kabul ýazgylarym
                </router-link>
            </div>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
            <router-link to="/doctors"
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all group">
                <div
                    class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="ti ti-stethoscope"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Lukman gözlemek</h2>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Hünär we klinika boýunça lukman saýlaň we
                    wagtlary görüň.</p>
            </router-link>

            <router-link to="/patient/appointments"
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all group">
                <div
                    class="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="ti ti-calendar-time"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Kabul ýazgylarym</h2>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Geljekki we öňki kabul ediş
                    tassyklamalaryňyzy yzarlaň.</p>
            </router-link>

            <div
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl">
                <div
                    class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center text-2xl mb-4">
                    <i class="ti ti-bell-ringing"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Bildirişler</h2>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Kabul ýagdaýy üýtgände ýa-da tassyklananda
                    habar alyň.</p>
            </div>
        </div>

        <div
            class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6">
            <div class="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
                <div
                    class="w-12 h-12 rounded-2xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-2xl">
                    <i class="ti ti-user-edit"></i>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Şahsy maglumatlary üýtgetmek</h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Adyňyzy we telefon belginizi täzeläň</p>
                </div>
            </div>

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
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Elektron poçta
                        (Email)</label>
                    <input v-model="form.email" type="email" disabled
                        class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/30 px-4 py-3 text-sm text-slate-500 cursor-not-allowed" />
                </div>

                <div class="space-y-1.5 md:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Telefon belgi</label>
                    <input v-model="form.phone" type="text" placeholder="+993..."
                        class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div class="md:col-span-2 flex justify-end">
                    <button type="submit" :disabled="updating"
                        class="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2 disabled:opacity-50">
                        <i v-if="updating" class="ti ti-loader animate-spin text-lg"></i>
                        {{ updating ? 'Ýüklenýär...' : 'Üýtgeşmeleri sakla' }}
                    </button>
                </div>
            </form>
        </div>
    </section>
</template>