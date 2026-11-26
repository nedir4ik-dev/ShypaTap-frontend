<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'
const rows=ref([]),loading=ref(true),error=ref('')
onMounted(async()=>{try{const {data}=await api.client.get('/doctor/reviews');rows.value=data.data||[]}catch(e){error.value=e.response?.data?.message||'Bahalandyrmalary alyp bolmady.'}finally{loading.value=false}})
</script>
<template><section class="mx-auto max-w-6xl space-y-6 px-4 py-8"><h1 class="text-3xl font-extrabold">Näsaglaryň bahalandyrmalary</h1><p v-if="error" class="rounded-xl bg-red-50 p-4 text-red-700">{{error}}</p><p v-if="loading" class="py-10 text-center">Ýüklenýär...</p><div v-else class="grid gap-4 md:grid-cols-2"><article v-for="r in rows" :key="r.id" class="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80"><div class="flex items-center justify-between"><strong>{{r.patient?.name||'Näsag'}}</strong><span class="font-bold text-amber-500">★ {{r.rating}} / 5</span></div><p class="mt-3 text-sm text-slate-600 dark:text-slate-300">{{r.comment||'Teswir ýok.'}}</p><p class="mt-4 text-xs text-slate-500">{{r.appointment?.booking_code}} · {{String(r.appointment?.appointment_date||'').slice(0,10)}}</p></article><p v-if="!rows.length" class="col-span-full py-10 text-center text-slate-500">Bahalandyrma ýok.</p></div></section></template>
