<template>
    <section class="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-3">
        <div v-if="loading" class="py-20 text-center">Lukman maglumatlary ýüklenýär...</div>
        <div v-else-if="!doctor" class="glass-card p-8">Lukman maglumatyny alyp bolmady.</div>
        <article v-else class="glass-card p-7 lg:col-span-2">
            <div class="flex flex-wrap items-center gap-5"><img v-if="doctor.photo_url" :src="doctor.photo_url"
                    class="h-24 w-24 rounded-2xl object-cover" alt="Lukmanyň suraty" />
                <div v-else
                    class="flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-100 text-3xl font-bold text-emerald-800">
                    {{ doctor.user?.name?.charAt(0) || 'L' }}</div>
                <div>
                    <h1 class="text-3xl font-bold">{{ doctor.user?.name }}</h1>
                    <p class="mt-1 text-emerald-700">{{ doctor.specialization?.name }}</p>
                    <p class="text-sm text-slate-500">{{ doctor.experience_years }} ýyl tejribe ·
                        {{ doctor.consultation_fee }} {{ doctor.currency || 'TMT' }}</p>
                </div>
            </div>
            <div class="mt-8 border-t pt-6">
                <h2 class="mb-2 text-xl font-semibold">Lukman barada</h2>
                <p>{{ doctor.biography || 'Goşmaça maglumat görkezilmedi.' }}</p>
                <p class="mt-3 text-sm text-slate-500">Bilimi: {{ doctor.education || 'Görkezilmedi' }}</p>
            </div>
            <h2 class="mb-3 mt-8 text-xl font-semibold">Klinika saýlaň</h2>
            <div class="flex flex-wrap gap-2"><button v-for="c in doctor.clinics || []" :key="c.id"
                    @click="clinic = c; loadSlots()"
                    :class="['rounded-xl border px-4 py-2 text-sm', clinic?.id === c.id ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300']">{{ c.name }}
                    · {{ c.city }}</button></div>
        </article>
        <aside v-if="doctor" class="glass-card h-fit space-y-4 p-6">
            <h2 class="text-xl font-bold">Kabul üçin ýazylmak</h2>
            <label class="block text-sm">Sene<input v-model="date" type="date" :min="today" @change="loadSlots"
                    class="mt-1 w-full rounded-xl border p-3" /></label>
            <div>
                <p class="mb-2 text-sm font-medium">Boş wagtlar</p>
                <p v-if="!clinic" class="text-sm text-slate-500">Ilki klinika saýlaň.</p>
                <p v-else-if="slotsLoading" class="text-sm">Wagtlar barlanýar...</p>
                <div v-else class="grid grid-cols-2 gap-2"><button v-for="slot in slots" :key="slot.start_time"
                        @click="selected = slot"
                        :class="['rounded-lg border p-2 text-sm', selected === slot ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-emerald-200 text-emerald-800']">{{ slot.start_time }}</button>
                    <p v-if="!slots.length" class="col-span-2 text-sm text-slate-500">Bu senede boş wagt ýok.</p>
                </div>
            </div>
            <template v-if="selected"><label class="block text-sm">Telefon belgisi<input v-model="phone" required
                        class="mt-1 w-full rounded-xl border p-3" placeholder="+993..." /></label><label
                    class="block text-sm">Ýüz tutma sebäbi<textarea v-model="reason"
                        class="mt-1 w-full rounded-xl border p-3" /></label><label class="block text-sm">Goşmaça
                    bellik<textarea v-model="notes" class="mt-1 w-full rounded-xl border p-3" /></label></template>
            <p v-if="message" class="text-sm" :class="success ? 'text-emerald-700' : 'text-red-600'">{{ message }}</p>
            <button @click="book" :disabled="!selected || !clinic || !phone || booking"
                class="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-40">{{ booking ? 'Ýüklenýär...' : 'Kabul ýazgysyny döret'}}</button>
        </aside>
    </section>
</template>
<script setup>
import { onMounted, ref } from 'vue'; import { useRoute, useRouter } from 'vue-router'; import { useAuthStore } from '@/stores/authStore'; import api from '@/services/api'
const route = useRoute(), router = useRouter(), auth = useAuthStore()
const doctor = ref(null), clinic = ref(null), loading = ref(true), slotsLoading = ref(false), booking = ref(false), slots = ref([]), selected = ref(null), date = ref(new Date().toLocaleDateString('en-CA')), today = new Date().toLocaleDateString('en-CA'), phone = ref(''), reason = ref(''), notes = ref(''), message = ref(''), success = ref(false)
onMounted(async () => { try { const { data } = await api.getDoctorDetail(route.params.id); doctor.value = data.data || data; clinic.value = doctor.value.clinics?.[0] || null; if (clinic.value) await loadSlots() } catch (e) { message.value = 'Lukman maglumatlaryny ýükläp bolmady.' } finally { loading.value = false } })
async function loadSlots() { selected.value = null; slots.value = []; if (!clinic.value) return; slotsLoading.value = true; try { const { data } = await api.getDoctorSlots(route.params.id, { date: date.value, clinic_id: clinic.value.id }); slots.value = data.slots || [] } catch (e) { message.value = e.response?.data?.message || 'Boş wagtlary alyp bolmady.' } finally { slotsLoading.value = false } }
async function book() { if (!auth.token) { router.push('/login'); return } booking.value = true; message.value = ''; try { await api.createAppointment({ doctor_profile_id: doctor.value.id, clinic_id: clinic.value.id, appointment_date: date.value, start_time: selected.value.start_time, patient_phone: phone.value, reason: reason.value, notes: notes.value }); success.value = true; message.value = 'Kabul ýazgysy döredildi we tassyklanmaga iberildi.'; setTimeout(() => router.push('/patient/appointments'), 900) } catch (e) { success.value = false; message.value = e.response?.data?.message || 'Kabul ýazgysyny döredip bolmady.' } finally { booking.value = false } }
</script>
