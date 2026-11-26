<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const appointment = ref(null)
const loading = ref(true)
const error = ref('')
const busy = ref(false)

const statusLabels = { pending: 'Garaşylýar', confirmed: 'Tassyklanan', checked_in: 'Geldi', rejected: 'Ret edilen', completed: 'Tamamlanan', no_show: 'Gelmedi', cancelled: 'Ýatyrylan' }
const paymentLabels = { pending: 'Garaşylýar', paid: 'Tölenen', refunded: 'Yzyna gaýtarylan', cancelled: 'Ýatyrylan' }

async function load() {
  loading.value = true
  try {
    const { data } = await api.client.get(`/doctor/appointments/${route.params.id}`)
    appointment.value = data.data || data
  } catch (e) {
    error.value = e.response?.data?.message || 'Bron maglumatyny alyp bolmady.'
  } finally { loading.value = false }
}

function formatDate(dateString) {
  if (!dateString) return ''
  let date = typeof dateString === 'number' && dateString < 10000000000
    ? new Date(dateString * 1000)
    : new Date(dateString)

  if (isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat('tk-TM', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date).replaceAll('/', '.')
}

function formatDateTime(dateString) {
  if (!dateString) return '—'
  let date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  const formattedDate = new Intl.DateTimeFormat('tk-TM', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date).replaceAll('/', '.')

  return formattedDate
}


onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-4xl space-y-6 px-4 py-10">
    <button @click="router.push('/doctor/appointments')"
      class="text-sm font-semibold text-emerald-700 hover:underline">← Kabul ýazgylaryna dolan</button>
    <p v-if="error" class="rounded-xl bg-red-50 p-4 text-red-700">{{ error }}</p>
    <div v-if="loading" class="py-16 text-center text-slate-500">Ýüklenýär...</div>
    <template v-else-if="appointment">
      <div
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
        <div class="flex flex-wrap justify-between gap-2 items-center">
          <div>
            <p class="text-xs text-slate-500">Bron belgisi</p>
            <h1 class="text-2xl font-extrabold">{{ appointment.booking_code }}</h1>
          </div>
          <span class="rounded-full bg-emerald-100 px-5 py-1 text-sm font-semibold text-emerald-800">{{
            statusLabels[appointment.status] || appointment.status }}</span>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <p class="text-xs text-slate-500">Näsag</p>
            <p class="font-bold">{{ appointment.patient?.name }}</p>
            <p class="text-sm text-slate-500">{{ appointment.patient?.phone }} · {{ appointment.patient?.email }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500">Klinika</p>
            <p class="font-bold">{{ appointment.clinic?.name }}</p>
            <p class="text-sm text-slate-500">{{ appointment.clinic?.address }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500">Kabul wagty</p>
            <p class="font-semibold">{{ formatDate(appointment.appointment_date) }} · {{
              String(appointment.start_time).slice(0, 5) }}–{{ String(appointment.end_time).slice(0, 5) }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500">Näsagyň şikaýaty</p>
            <p class="font-semibold whitespace-pre-wrap">{{ appointment.reason || 'Görkezilmedi' }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500">Bron eden</p>
            <p class="font-semibold">{{ appointment.created_by?.name || appointment.patient?.name }} <span
                class="text-xs text-slate-500">({{ appointment.created_by?.role || 'patient' }})</span></p>
          </div>
        </div>
        <div v-if="appointment.notes" class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p class="text-xs text-slate-500">Goşmaça bellik</p>{{ appointment.notes }}
        </div>
      </div>

      <div
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <h2 class="text-xl font-bold">Näsagyň bahalandyrmasy</h2>
        <template v-if="appointment.review">
          <p class="text-2xl font-extrabold text-amber-500">★ {{ Number(appointment.review.rating).toFixed(1) }} / 5.0
          </p>
          <p class="whitespace-pre-wrap text-slate-700 dark:text-slate-200">
            {{ appointment.review.comment || 'Teswir ýazylmady.' }}</p>
          <p class="text-xs text-slate-500">Näsag: {{ appointment.review.patient?.name }}</p>
        </template>
        <p v-else class="text-sm text-slate-500">Bu kabul üçin entek baha berilmedi.</p>
      </div>

      <div v-if="appointment.payment"
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <h2 class="text-xl font-bold">Töleg</h2>
        <p>{{ appointment.payment.amount }} {{ appointment.payment.currency }} · {{
          paymentLabels[appointment.payment.status]
        }}</p>
        <p class="text-xs text-slate-500">Usuly: {{ appointment.payment.payment_method }} · Tölenen wagty: {{
          formatDateTime(appointment.payment.paid_at) }}</p>
        <p class="text-xs text-slate-500">Lukman töleg ýagdaýyny üýtgedip ýa-da yzyna gaýtaryp bilmeýär.</p>
        <div v-if="appointment.payment.histories?.length" class="border-t pt-3">
          <h3 class="font-semibold">Töleg taryhy</h3>
          <ul class="mt-2 space-y-2 text-sm">
            <li v-for="h in appointment.payment.histories" :key="h.id">
              {{ h.old_status || '—' }} → {{ h.new_status }} · {{ h.actor?.name || 'Ulgam' }} · {{
                formatDateTime(h.created_at) }}
            </li>
          </ul>
        </div>
      </div>
    </template>
  </section>
</template>
