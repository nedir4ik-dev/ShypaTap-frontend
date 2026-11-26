<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'

const rows = ref([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const selected = ref(null)
const rating = ref(5)
const comment = ref('')

const status = { pending: 'Garaşylýar', confirmed: 'Tassyklanan', checked_in: 'Näsag geldi', rejected: 'Ret edilen', completed: 'Tamamlanan', cancelled: 'Ýatyrylan', no_show: 'Gelmedi' }
const formatDate = (d) => d ? d.split('T')[0] : '—'

async function load() {
  try { const { data } = await api.getMyAppointments(); rows.value = data.data || [] }
  catch (e) { error.value = e.response?.data?.message || 'Kabul ýazgylaryny alyp bolmady.' }
  finally { loading.value = false }
}
async function cancel(a) {
  if (!confirm('Kabul ýazgysyny ýatyrmak isleýärsiňizmi?')) return
  try { await api.cancelAppointment(a.id); await load() }
  catch (e) { error.value = e.response?.data?.message || 'Ýatyryp bolmady.' }
}
function openReview(a) { selected.value = a; rating.value = 5; comment.value = '' }
function editReview(a) { selected.value = a; rating.value = Number(a.review?.rating || 5); comment.value = a.review?.comment || '' }
async function submitReview() {
  if (!selected.value) return
  saving.value = true; error.value = ''
  try {
    if (selected.value.review) await api.client.patch(`/reviews/${selected.value.review.id}`, { rating: rating.value, comment: comment.value })
    else await api.client.post(`/appointments/${selected.value.id}/review`, { rating: rating.value, comment: comment.value })
    selected.value = null; await load()
  } catch (e) { error.value = e.response?.data?.message || 'Baha iberilmedi.' }
  finally { saving.value = false }
}
async function deleteReview(a) {
  if (!a.review || !confirm('Bu bahalandyrmany pozmak isleýärsiňizmi?')) return
  try { await api.client.delete(`/reviews/${a.review.id}`); await load() }
  catch (e) { error.value = e.response?.data?.message || 'Bahalandyrmany pozup bolmady.' }
}
onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 space-y-6">
    <div>
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Kabul ýazgylarym</h1>
      <p class="mt-1 text-sm text-slate-500">Bronlaryňyzyň ýagdaýyny yzarlaň we tamamlanan kabul üçin lukmana baha
        beriň.</p>
    </div>
    <div v-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>
    <div v-if="loading" class="py-12 text-center text-slate-500">Ýüklenýär...</div>
    <div v-else class="grid gap-4">
      <article v-for="a in rows" :key="a.id"
        class="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div class="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div>
            <h2 class="font-bold text-slate-900 dark:text-white">{{ a.doctor?.user?.name || 'Lukman' }}</h2>
            <p class="text-sm text-slate-500">{{ a.clinic?.name || 'Klinika' }}</p>
            <p class="mt-2 text-sm">{{ formatDate(a.appointment_date) }} · {{ String(a.start_time || '').slice(0, 5) }} ·
              {{ a.booking_code }}</p>
          </div>
          <span class="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">{{
            status[a.status] || a.status }}</span>
        </div>
        <div v-if="a.review" class="mt-4 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
          <p class="font-bold text-amber-700 dark:text-amber-300">★ {{ Number(a.review.rating).toFixed(1) }} / 5.0</p>
          <p v-if="a.review.comment" class="mt-1 text-sm">{{ a.review.comment }}</p>
          <button @click="editReview(a)" class="mt-2 mr-3 text-xs font-semibold text-emerald-700 hover:underline">Bahalandyrmany üýtget</button>
          <button @click="deleteReview(a)"
            class="mt-2 text-xs font-semibold text-red-600 hover:underline">Bahalandyrmany poz</button>
        </div>
        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <button v-if="['pending', 'confirmed'].includes(a.status)" @click="cancel(a)"
            class="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">Ýatyr</button>
          <button v-if="a.status === 'completed' && !a.review" @click="openReview(a)"
            class="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white">Baha ber</button>
        </div>
      </article>
      <p v-if="!rows.length" class="py-12 text-center text-slate-500">Kabul ýazgysy tapylmady.</p>
    </div>

    <div v-if="selected" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      @click.self="selected = null">
      <div class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">{{ selected.review ? 'Bahalandyrmany üýtget' : 'Lukmana baha beriň' }}</h2><button @click="selected = null"
            class="text-2xl text-slate-400">×</button>
        </div>
        <p class="mt-1 text-sm text-slate-500">{{ selected.doctor?.user?.name }} · {{ selected.booking_code }}</p>
        <label class="mt-5 block text-sm font-semibold">Baha: {{ Number(rating).toFixed(1) }} / 5.0</label>
        <input v-model.number="rating" type="range" min="1" max="5" step="0.1" class="mt-3 w-full accent-emerald-600" />
        <div class="flex justify-between text-xs text-slate-400"><span>1.0</span><span>5.0</span></div>
        <label class="mt-5 block text-sm font-semibold">Teswir (islege görä)</label>
        <textarea v-model="comment" rows="4" maxlength="1000" placeholder="Lukman barada pikiriňiz..."
          class="mt-2 w-full rounded-xl border border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-800"></textarea>
        <div class="mt-5 flex justify-end gap-2"><button @click="selected = null"
            class="rounded-xl px-4 py-2 text-sm">Ýatyr</button><button @click="submitReview" :disabled="saving"
            class="rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{{ saving ?
              'Ýüklenýär...' : 'Ugrat' }}</button></div>
      </div>
    </div>
  </section>
</template>
