<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';

const props = defineProps({
    mode: { type: String, default: 'profile' }
});

const route = useRoute();
const auth = useAuthStore();

const mode = computed(() => props.mode || route.params.mode || 'profile');

const profile = ref({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: auth.user?.phone || ''
});

const password = ref({
    current_password: '',
    password: '',
    password_confirmation: ''
});

const notifications = ref([]);
const message = ref('');
const error = ref('');

async function saveProfile() {
    try {
        const { data } = await api.updateProfile(profile.value);
        auth.user = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));
        message.value = data.message;
        error.value = '';
    } catch (e) {
        error.value = e.response?.data?.message || 'Maglumatlary saklap bolmady.';
    }
}

async function changePassword() {
    try {
        const { data } = await api.changePassword(password.value);
        message.value = data.message;
        error.value = '';
        await auth.logout();
    } catch (e) {
        error.value = e.response?.data?.message || 'Paroly üýtgedip bolmady.';
    }
}

async function loadNotifications() {
    if (mode.value === 'notifications') {
        try {
            const { data } = await api.getNotifications();
            notifications.value = data.data?.data || data.data || [];
        } catch (e) {
            error.value = 'Bildirişleri alyp bolmady.';
        }
    }
}

async function read(n) {
    try {
        await api.client.patch(`/notifications/${n.id}/read`);
        n.read_at = new Date().toISOString();
    } catch (e) {
        error.value = 'Bildirişi okalan diýip beläp bolmady.';
    }
}

onMounted(loadNotifications);

watch(mode, (newMode) => {
    message.value = '';
    error.value = '';
    if (newMode === 'notifications') {
        loadNotifications();
    }
});
</script>

<template>
    <section class="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <h1 class="text-3xl font-bold">
            {{ mode === 'notifications' ? 'Bildirişler' : mode === 'password' ? 'Paroly üýtgetmek' : 'Şahsy profil' }}
        </h1>

        <p v-if="message" class="rounded-xl bg-emerald-50 p-3 text-emerald-800">
            {{ message }}
        </p>
        <p v-if="error" class="rounded-xl bg-red-50 p-3 text-red-700">
            {{ error }}
        </p>

        <form v-if="mode === 'profile'" @submit.prevent="saveProfile" class="glass-card space-y-4 p-6">
            <label class="block text-sm">
                Ady
                <input v-model="profile.name" required class="mt-1 w-full rounded-xl border p-3" />
            </label>
            <label class="block text-sm">
                E-poçta
                <input v-model="profile.email" type="email" required class="mt-1 w-full rounded-xl border p-3" />
            </label>
            <label class="block text-sm">
                Telefon
                <input v-model="profile.phone" class="mt-1 w-full rounded-xl border p-3" />
            </label>
            <button type="submit"
                class="rounded-xl bg-emerald-700 px-5 py-3 text-white transition hover:bg-emerald-800">
                Maglumatlary sakla
            </button>
        </form>

        <form v-else-if="mode === 'password'" @submit.prevent="changePassword" class="glass-card space-y-4 p-6">
            <label class="block text-sm">
                Häzirki parol
                <input v-model="password.current_password" type="password" required
                    class="mt-1 w-full rounded-xl border p-3" />
            </label>
            <label class="block text-sm">
                Täze parol
                <input v-model="password.password" type="password" minlength="8" required
                    class="mt-1 w-full rounded-xl border p-3" />
            </label>
            <label class="block text-sm">
                Täze paroly gaýtalaň
                <input v-model="password.password_confirmation" type="password" required
                    class="mt-1 w-full rounded-xl border p-3" />
            </label>
            <button type="submit"
                class="rounded-xl bg-emerald-700 px-5 py-3 text-white transition hover:bg-emerald-800">
                Paroly üýtget
            </button>
        </form>

        <div v-else class="space-y-3">
            <div v-for="n in notifications" :key="n.id" class="glass-card p-5">
                <div class="flex justify-between gap-3">
                    <h2 class="font-semibold">{{ n.title }}</h2>
                    <span v-if="!n.read_at" class="text-xs text-emerald-700">Täze</span>
                </div>
                <p class="mt-2 text-sm text-slate-600">{{ n.message }}</p>
                <button v-if="!n.read_at" @click="read(n)" class="mt-3 text-sm text-emerald-700 hover:underline">
                    Okalan diýip bellemek
                </button>
            </div>
            <p v-if="!notifications.length" class="py-8 text-center text-slate-500">
                Bildiriş ýok.
            </p>
        </div>
    </section>
</template>