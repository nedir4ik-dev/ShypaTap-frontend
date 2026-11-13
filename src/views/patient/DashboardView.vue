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
                    <i class="ti ti-user-check text-emerald-300"></i> Näsag Paneli
                </span>
                <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">
                    Hoş geldiňiz, {{ auth.user?.name || 'Näsag' }}!
                </h1>
                <p class="text-emerald-100/80 text-sm">
                    Kabul ýazgylaryňyzy yzarlaň, profiliňizi sazlaň ýa-da täze lukman saýlaň.
                </p>
            </div>

            <div class="flex items-center gap-3 relative z-10">
                <router-link to="/patient/appointments"
                    class="px-5 py-3 rounded-2xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition shadow-lg flex items-center gap-2">
                    <i class="ti ti-calendar-event text-lg"></i> Kabul ýazgylarym
                </router-link>
            </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <router-link to="/doctors"
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all group">
                <div
                    class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="ti ti-stethoscope"></i>
                </div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Lukman gözlemek</h2>
                <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Hünär we klinika boýunça lukman tapyň.</p>
            </router-link>

            <router-link to="/patient/profile"
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all group">
                <div
                    class="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="ti ti-user-edit"></i>
                </div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Şahsy profil</h2>
                <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Adyňyzy, e-poçtaňyzy we telefonyňyzy
                    üýtgediň.</p>
            </router-link>

            <router-link to="/patient/password"
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all group">
                <div
                    class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="ti ti-lock"></i>
                </div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Paroly üýtgetmek</h2>
                <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Howpsuzlyk üçin parolyňyzy täzeläň.</p>
            </router-link>

            <router-link to="/patient/notifications"
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl hover:shadow-2xl transition-all group">
                <div
                    class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    <i class="ti ti-bell-ringing"></i>
                </div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Bildirişler</h2>
                <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Kabul ediş tassyklamalaryny görüň.</p>
            </router-link>
        </div>
    </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
</script>