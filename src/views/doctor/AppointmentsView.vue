<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'

const appointments = ref([])
const loading = ref(true)
const error = ref('')
const busyId = ref(null)
const filter = ref('')

const statusLabels = {
  pending: 'Garaşylýar',
  confirmed: 'Tassyklanan',
  rejected: 'Ret edilen',
  cancelled: 'Ýatyrylan',
  completed: 'Tamamlanan',
  no_show: 'Gelmedi'
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.client.get('/doctor/appointments', {
      params: filter.value ? { status: filter.value } : {}
    })
    appointments.value = data.data || []
  } catch (e) {
    error.value = e.response?.data?.message || 'Kabul ýazgylaryny ýükläp bolmady.'
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return ''

  let date = typeof dateString === 'number' && dateString < 10000000000
    ? new Date(dateString * 1000)
    : new Date(dateString)

  if (isNaN(date.getTime())) return dateString

  // Netijedäki slash (/) belliklerini nokat (.) bilen çalşýarys
  return new Intl.DateTimeFormat('tk-TM', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date).replaceAll('/', '.')
}

async function setStatus(appointment, status) {
  busyId.value = appointment.id
  error.value = ''
  try {
    await api.client.patch(`/doctor/appointments/${appointment.id}/status`, { status })
    await load()
  } catch (e) {
    error.value = e.response?.data?.message || 'Kabul ýazgysynyň ýagdaýyny üýtgedip bolmady.'
  } finally {
    busyId.value = null
  }
}

onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-7xl space-y-6 px-4 py-10">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Kabul ýazgylarym</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Näsaglaryň kabul ýazgylaryny görüň we ýagdaýyny
          dolandyryň.</p>
      </div>
      <router-link to="/doctor/dashboard" class="text-sm font-semibold text-emerald-700 hover:underline">← Panela
        dolan</router-link>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <label for="appointment-status" class="text-sm font-medium text-slate-700 dark:text-slate-300">Ýagdaýy:</label>
      <select id="appointment-status" v-model="filter" @change="load"
        class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
        <option value="">Ählisi</option>
        <option value="pending">Garaşylýar</option>
        <option value="confirmed">Tassyklanan</option>
        <option value="rejected">Ret edilen</option>
        <option value="completed">Tamamlanan</option>
        <option value="no_show">Gelmedi</option>
        <option value="cancelled">Ýatyrylan</option>
      </select>
      <button @click="load"
        class="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Täzele</button>
    </div>

    <p v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
      {{ error }}</p>
    <div v-if="loading" class="py-16 text-center text-slate-500">Kabul ýazgylary ýüklenýär...</div>
    <div v-else-if="!appointments.length"
      class="rounded-3xl border border-slate-200 bg-white/70 p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/70">
      Kabul ýazgysy tapylmady.</div>

    <div v-else class="grid gap-4">
      <article v-for="a in appointments" :key="a.id"
        class="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-3">
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {{ (a.patient?.name || 'N').trim().charAt(0).toUpperCase() }}
            </div>
            <div>
              <router-link :to="`/doctor/appointments/${a.id}`" class="font-bold text-emerald-700 hover:underline">{{
                a.patient?.name || 'Näsag' }} · Jikme-jiklik</router-link>
              <p class="text-xs text-slate-500">{{ a.patient?.phone || a.patient_phone || 'Telefon görkezilmedi' }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ a.clinic?.name || 'Klinika' }}</p>
            </div>
          </div>
          <div class="text-sm text-slate-700 dark:text-slate-300">
            <p class="font-semibold">{{ formatDate(a.appointment_date) }} · {{ String(a.start_time || '').slice(0, 5) }}
            </p>
            <p class="text-xs text-slate-500">{{ a.booking_code || `#${a.id}` }}</p>
          </div>
          <span
            class="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{
              statusLabels[a.status] || a.status }}</span>
        </div>
        <div v-if="a.reason || a.notes"
          class="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <p v-if="a.reason"><strong>Şikaýat:</strong> {{ a.reason }}</p>
          <p v-if="a.notes"><strong>Bellik:</strong> {{ a.notes }}</p>
        </div>
        <p v-if="a.review" class="mt-3 text-sm font-semibold text-amber-600">★ {{ Number(a.review.rating).toFixed(1) }}
          / 5.0 · {{ a.review.comment || 'Teswir ýok' }}</p>
        <div class="mt-4 flex flex-wrap justify-end gap-2" v-if="a.status === 'pending' || a.status === 'confirmed'">
          <button v-if="a.status === 'pending'" @click="setStatus(a, 'confirmed')" :disabled="busyId === a.id"
            class="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Tassykla</button>
          <button v-if="a.status === 'pending'" @click="setStatus(a, 'rejected')" :disabled="busyId === a.id"
            class="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 disabled:opacity-50">Ret
            et</button>
          <button v-if="a.status === 'confirmed'" @click="setStatus(a, 'completed')" :disabled="busyId === a.id"
            class="rounded-xl bg-blue-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Tamamlandy</button>
          <button v-if="a.status === 'confirmed'" @click="setStatus(a, 'no_show')" :disabled="busyId === a.id"
            class="rounded-xl border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700 disabled:opacity-50">Gelmedi</button>
        </div>
      </article>
    </div>
  </section>
</template>
