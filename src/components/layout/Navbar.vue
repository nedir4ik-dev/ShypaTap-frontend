<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const auth = useAuthStore();
const router = useRouter();
const dark = ref(false);
const mobileMenuOpen = ref(false);

function apply(v) {
    dark.value = v;
    document.documentElement.classList.toggle('dark', v);
    localStorage.setItem('theme', v ? 'dark' : 'light');
}

onMounted(() => apply(localStorage.getItem('theme') === 'dark'));

function toggleTheme() {
    apply(!dark.value);
}

async function signOut() {
    mobileMenuOpen.value = false;
    await auth.logout();
    router.push('/');
}

const closeMenu = () => {
    mobileMenuOpen.value = false;
};
</script>

<template>
    <header
        class="sticky top-0 z-50 border-b border-white/40 bg-white/40 shadow-lg backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/40 transition-all">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            <!-- Logo -->
            <router-link to="/" @click="closeMenu" class="flex items-center gap-3 group">
                <span
                    class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition">
                    <i class="ti ti-heart-rate-monitor"></i>
                </span>
                <span class="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">ŞypaTap</span>
            </router-link>

            <!-- Desktop Navigation Links -->
            <nav class="hidden items-center gap-6 md:flex font-medium text-slate-700 dark:text-slate-200">
                <router-link to="/"
                    class="flex items-center gap-1.5 text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition py-1">
                    <i class="ti ti-home text-lg"></i> Baş sahypa
                </router-link>
                <router-link to="/doctors"
                    class="flex items-center gap-1.5 text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition py-1">
                    <i class="ti ti-stethoscope text-lg"></i> Lukmanlar
                </router-link>
                <router-link to="/doctors"
                    class="flex items-center gap-1.5 text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition py-1">
                    <i class="ti ti-building-hospital text-lg"></i> Klinikalar
                </router-link>
            </nav>

            <!-- Right Actions (Theme, Auth & Mobile Hamburger Button) -->
            <div class="flex items-center gap-3">
                <!-- Theme Toggle Button -->
                <button @click="toggleTheme"
                    class="flex items-center justify-center w-10 h-10 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 backdrop-blur-md transition shadow-sm cursor-pointer"
                    :aria-label="dark ? 'Açyk režim' : 'Garaňky režim'">
                    <i :class="dark ? 'ti ti-sun text-lg text-amber-400' : 'ti ti-moon text-lg text-slate-700'"></i>
                </button>

                <!-- Desktop Auth Buttons -->
                <div class="hidden sm:flex items-center gap-2">
                    <template v-if="auth.token">
                        <router-link :to="auth.dashboardPath ? auth.dashboardPath() : '/patient/dashboard'"
                            class="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/60 transition">
                            <i class="ti ti-user-circle text-lg text-emerald-600"></i> Kabinet
                        </router-link>
                        <button @click="signOut"
                            class="flex items-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition cursor-pointer">
                            <i class="ti ti-logout text-lg"></i> Çykmak
                        </button>
                    </template>
                    <template v-else>
                        <router-link to="/login"
                            class="flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/60 transition">
                            <i class="ti ti-login text-lg"></i> Giriş
                        </router-link>
                        <router-link to="/register"
                            class="flex items-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition">
                            <i class="ti ti-user-plus text-lg"></i> Hasaba ýazyl
                        </router-link>
                    </template>
                </div>

                <!-- Mobile Hamburger Menu Button -->
                <button @click="mobileMenuOpen = !mobileMenuOpen"
                    class="flex md:hidden items-center justify-center w-10 h-10 rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 backdrop-blur-md transition shadow-sm cursor-pointer"
                    aria-label="Menu">
                    <i :class="mobileMenuOpen ? 'ti ti-x text-2xl' : 'ti ti-menu-2 text-2xl'"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Dropdown Menu -->
        <div v-if="mobileMenuOpen"
            class="md:hidden absolute top-16 left-0 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-white/40 dark:border-slate-800 shadow-2xl px-6 py-6 space-y-4 transition-all">

            <!-- Nav Links -->
            <nav
                class="flex flex-col space-y-2 font-medium text-slate-800 dark:text-slate-200 border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                <router-link to="/" @click="closeMenu"
                    class="flex items-center gap-3 py-2.5 px-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-900 transition">
                    <i class="ti ti-home text-xl text-emerald-600"></i> Baş sahypa
                </router-link>
                <router-link to="/doctors" @click="closeMenu"
                    class="flex items-center gap-3 py-2.5 px-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-900 transition">
                    <i class="ti ti-stethoscope text-xl text-emerald-600"></i> Lukmanlar
                </router-link>
                <router-link to="/doctors" @click="closeMenu"
                    class="flex items-center gap-3 py-2.5 px-3 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-900 transition">
                    <i class="ti ti-building-hospital text-xl text-emerald-600"></i> Klinikalar
                </router-link>
            </nav>

            <!-- Auth Actions for Mobile -->
            <div class="flex flex-col gap-2.5 pt-1">
                <template v-if="auth.token">
                    <router-link :to="auth.dashboardPath ? auth.dashboardPath() : '/patient/dashboard'"
                        @click="closeMenu"
                        class="flex items-center justify-center gap-2 w-full py-3 px-4 text-center rounded-2xl bg-emerald-50 dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-semibold text-sm shadow-sm">
                        <i class="ti ti-user-circle text-xl"></i> Şahsy kabinet
                    </router-link>
                    <button @click="signOut"
                        class="flex items-center justify-center gap-2 w-full py-3 px-4 text-center rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition shadow-md">
                        <i class="ti ti-logout text-xl"></i> Çykmak
                    </button>
                </template>
                <template v-else>
                    <router-link to="/login" @click="closeMenu"
                        class="flex items-center justify-center gap-2 w-full py-3 px-4 text-center rounded-2xl border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm">
                        <i class="ti ti-login text-xl"></i> Giriş
                    </router-link>
                    <router-link to="/register" @click="closeMenu"
                        class="flex items-center justify-center gap-2 w-full py-3 px-4 text-center rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30">
                        <i class="ti ti-user-plus text-xl"></i> Hasaba ýazyl
                    </router-link>
                </template>
            </div>

        </div>
    </header>
</template>