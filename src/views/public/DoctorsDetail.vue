<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const doctor = ref(null)
const clinic = ref(null)
const loading = ref(true)
const slotsLoading = ref(false)
const booking = ref(false)
const slots = ref([])
const selected = ref(null)
const date = ref(new Date().toLocaleDateString('en-CA'))
const today = new Date().toLocaleDateString('en-CA')
const phone = ref('')
const reason = ref('')
const notes = ref('')
const message = ref('')
const success = ref(false)

onMounted(async () => {
    try {
        const { data } = await api.getDoctorDetail(route.params.id)
        doctor.value = data.data || data
        clinic.value = doctor.value.clinics?.[0] || null
        if (clinic.value) await loadSlots()
    } catch (e) {
        message.value = 'Lukman maglumatlaryny ýükläp bolmady.'
    } finally {
        loading.value = false
    }
})

async function loadSlots() {
    selected.value = null
    slots.value = []
    if (!clinic.value) return
    slotsLoading.value = true
    try {
        const { data } = await api.getDoctorSlots(route.params.id, { date: date.value, clinic_id: clinic.value.id })
        slots.value = data.slots || []
    } catch (e) {
        message.value = e.response?.data?.message || 'Boş wagtlary alyp bolmady.'
    } finally {
        slotsLoading.value = false
    }
}

async function book() {
    if (!auth.token) {
        router.push('/login')
        return
    }
    booking.value = true
    message.value = ''
    try {
        await api.createAppointment({
            doctor_profile_id: doctor.value.id,
            clinic_id: clinic.value.id,
            appointment_date: date.value,
            start_time: selected.value.start_time,
            patient_phone: phone.value,
            reason: reason.value,
            notes: notes.value
        })
        success.value = true
        message.value = 'Kabul ýazgysy döredildi we tassyklanmaga iberildi.'
        setTimeout(() => router.push('/patient/appointments'), 1200)
    } catch (e) {
        success.value = false
        message.value = e.response?.data?.message || 'Kabul ýazgysyny döredip bolmady.'
    } finally {
        booking.value = false
    }
}
</script>

<template>
    <section class="mx-auto max-w-7xl px-4 py-10">

        <!-- Loading State -->
        <div v-if="loading" class="py-20 text-center text-slate-500">
            <i class="ti ti-loader animate-spin text-4xl text-emerald-600 mb-2"></i>
            <p>Lukman maglumatlary ýüklenýär...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="!doctor"
            class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 text-center space-y-4">
            <i class="ti ti-alert-circle text-5xl text-red-500"></i>
            <p class="text-slate-700 dark:text-slate-300 font-medium">Lukman maglumatyny alyp bolmady.</p>
            <router-link to="/doctors"
                class="inline-block px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold">
                Lukmanlara gaýdyp barmak
            </router-link>
        </div>

        <!-- Main Content Grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Left & Center: Doctor Info & Clinics -->
            <article
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl lg:col-span-2 space-y-8">

                <!-- Header Profile -->
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    <img v-if="doctor.photo_url" :src="doctor.photo_url"
                        class="h-28 w-28 rounded-2xl object-cover shadow-lg border border-white/20"
                        alt="Lukmanyň suraty" />
                    <div v-else
                        class="flex h-28 w-28 items-center justify-center rounded-2xl bg-emerald-600/15 dark:bg-emerald-500/20 text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 shadow-inner">
                        {{ (doctor.user?.name || doctor.name || 'L').charAt(0) }}
                    </div>

                    <div class="space-y-2 flex-1">
                        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                            {{ doctor.user?.name || doctor.name }}
                        </h1>
                        <p
                            class="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                            <i class="ti ti-stethoscope text-lg"></i> {{ doctor.specialization?.name ||
                                doctor.specialization }}
                        </p>
                        <div
                            class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                            <span
                                class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
                                <i class="ti ti-award"></i> {{ doctor.experience_years || 5 }} ýyl tejribe
                            </span>
                            <span
                                class="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-semibold">
                                <i class="ti ti-cash"></i> {{ doctor.consultation_fee || 100 }} {{ doctor.currency ||
                                    'TMT' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Biography & Education -->
                <div class="space-y-4 border-t border-slate-200/60 dark:border-slate-800 pt-6">
                    <div>
                        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                            <i class="ti ti-info-circle text-emerald-600"></i> Lukman barada
                        </h2>
                        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {{ doctor.biography || 'Goşmaça maglumat görkezilmedi.' }}
                        </p>
                    </div>

                    <div class="pt-2">
                        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Bilimi we derejesi:
                        </h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <i class="ti ti-certificate text-emerald-600"></i> {{ doctor.education || 'Görkezilmedi' }}
                        </p>
                    </div>
                </div>

                <!-- Clinic Selector -->
                <div class="space-y-4 border-t border-slate-200/60 dark:border-slate-800 pt-6">
                    <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <i class="ti ti-building-hospital text-emerald-600"></i> Kabul geçiriljek klinikany saýlaň
                    </h2>
                    <div class="flex flex-wrap gap-3">
                        <button v-for="c in doctor.clinics || []" :key="c.id" @click="clinic = c; loadSlots()" :class="[
                            'rounded-2xl px-5 py-3 text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm',
                            clinic?.id === c.id
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                : 'bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        ]">
                            <i class="ti ti-map-pin"></i>
                            <span>{{ c.name }}</span>
                            <span class="text-xs opacity-80">({{ c.city }})</span>
                        </button>
                    </div>
                </div>

            </article>

            <!-- Right Sidebar: Booking Form -->
            <aside
                class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl h-fit rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6">
                <div class="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800 pb-4">
                    <div
                        class="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xl">
                        <i class="ti ti-calendar-event"></i>
                    </div>
                    <div>
                        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Kabul edişe ýazylmak</h2>
                        <p class="text-xs text-slate-500">Boş wagty saýlap bron ediň</p>
                    </div>
                </div>

                <!-- Date Picker -->
                <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Sene saýlaň</label>
                    <div class="relative">
                        <input v-model="date" type="date" :min="today" @change="loadSlots"
                            class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                    </div>
                </div>

                <!-- Available Slots -->
                <div class="space-y-2">
                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">Boş sagatlar</p>

                    <p v-if="!clinic"
                        class="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900">
                        ⚠️ Ilki ýokardaky sanawdan klinika saýlaň.
                    </p>
                    <p v-else-if="slotsLoading" class="text-xs text-slate-500 py-4 text-center">Wagtlar barlanýar...</p>

                    <div v-else class="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                        <button v-for="slot in slots" :key="slot.start_time" @click="selected = slot" :class="[
                            'rounded-xl p-2.5 text-xs font-semibold transition cursor-pointer text-center',
                            selected === slot
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                : 'bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                        ]">
                            {{ slot.start_time }}
                        </button>
                        <p v-if="!slots.length"
                            class="col-span-3 text-xs text-slate-500 py-4 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                            Bu senede boş wagt ýok.
                        </p>
                    </div>
                </div>

                <!-- Patient Details Form -->
                <template v-if="selected">
                    <div class="space-y-4 pt-2 border-t border-slate-200/60 dark:border-slate-800 animate-fadeIn">
                        <div class="space-y-1">
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Telefon
                                belgisi *</label>
                            <input v-model="phone" required
                                class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="+993..." />
                        </div>

                        <div class="space-y-1">
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">Ýüz tutma
                                sebäbi</label>
                            <textarea v-model="reason" rows="2"
                                class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                placeholder="Näika şikaýatyňyz bar?"></textarea>
                        </div>
                    </div>
                </template>

                <!-- Status Message -->
                <p v-if="message" class="text-xs p-3 rounded-xl font-medium"
                    :class="success ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300'">
                    {{ message }}
                </p>

                <!-- Submit Button -->
                <button @click="book" :disabled="!selected || !clinic || !phone || booking"
                    class="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                    <i v-if="booking" class="ti ti-loader animate-spin text-lg"></i>
                    {{ booking ? 'Ýüklenýär...' : 'Kabul ýazgysyny döret' }}
                </button>
            </aside>

        </div>
    </section>
</template>