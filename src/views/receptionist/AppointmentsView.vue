<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/services/api'
const clinics=ref([]), clinicId=ref(''), doctors=ref([]), patients=ref([]), rows=ref([]), slots=ref([])
const loading=ref(true), error=ref(''), saving=ref(false)
const form=ref({patient_id:'',doctor_profile_id:'',clinic_id:'',appointment_date:'',start_time:'',patient_phone:'',reason:''})
const selectedDoctor=computed(()=>doctors.value.find(d=>String(d.id)===String(form.value.doctor_profile_id)))
async function load(){loading.value=true;error.value='';try{
 const params=clinicId.value?{clinic_id:clinicId.value}:{}
 const [dash,docs,pats,appts]=await Promise.all([
  api.client.get('/receptionist/dashboard',{params}),api.client.get('/receptionist/doctors',{params}),
  api.client.get('/receptionist/patients',{params}),api.client.get('/receptionist/appointments',{params})])
 clinics.value=dash.data.clinics||[];doctors.value=docs.data.data||[];patients.value=pats.data.data||[];rows.value=appts.data.data||[]
 form.value.clinic_id=clinicId.value||''
 }catch(e){error.value=e.response?.data?.message||'Maglumatlary alyp bolmady.'}finally{loading.value=false}}
async function loadSlots(){slots.value=[];form.value.start_time='';if(!form.value.doctor_profile_id||!form.value.clinic_id||!form.value.appointment_date)return
 try{const {data}=await api.client.get(`/doctors/${form.value.doctor_profile_id}/slots`,{params:{clinic_id:form.value.clinic_id,date:form.value.appointment_date}});slots.value=data.slots||[]}catch(e){error.value=e.response?.data?.message||'Boş wagtlary alyp bolmady.'}}
async function create(){saving.value=true;error.value='';try{await api.client.post('/receptionist/appointments',form.value);form.value.patient_id='';form.value.doctor_profile_id='';form.value.start_time='';form.value.reason='';await load()}catch(e){error.value=e.response?.data?.message||'Kabul ýazgysyny döredip bolmady.'}finally{saving.value=false}}
watch(clinicId,load);watch(()=>[form.value.doctor_profile_id,form.value.appointment_date,form.value.clinic_id],loadSlots)
onMounted(load)
</script>
<template>
<section class="mx-auto max-w-7xl space-y-6 px-4 py-8">
 <header class="flex flex-wrap items-end justify-between gap-4"><div><h1 class="text-3xl font-extrabold">Kabul ýazgylary</h1><p class="mt-1 text-sm text-slate-500">Diňe size bellenen klinikalaryň bronlary.</p></div>
 <label class="text-sm font-semibold">Klinika<select v-model="clinicId" class="mt-1 block min-w-52 rounded-xl border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"><option value="">Ähli klinikalar</option><option v-for="c in clinics" :key="c.id" :value="c.id">{{c.name}}</option></select></label></header>
 <p v-if="error" class="rounded-xl bg-red-50 p-4 text-red-700">{{error}}</p>
 <div class="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80"><h2 class="mb-4 text-xl font-bold">Täze kabul ýazgysy</h2>
 <form class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" @submit.prevent="create">
 <label class="text-sm">Näsag<select v-model="form.patient_id" required class="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-950"><option value="">Saýlaň</option><option v-for="p in patients" :key="p.id" :value="p.id">{{p.name}} — {{p.phone}}</option></select></label>
 <label class="text-sm">Klinika<select v-model="form.clinic_id" required class="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-950"><option value="">Saýlaň</option><option v-for="c in clinics" :key="c.id" :value="c.id">{{c.name}}</option></select></label>
 <label class="text-sm">Lukman<select v-model="form.doctor_profile_id" required class="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-950"><option value="">Saýlaň</option><option v-for="d in doctors.filter(x=>!form.clinic_id||x.clinics?.some(c=>String(c.id)===String(form.clinic_id)))" :key="d.id" :value="d.id">{{d.user?.name}} — {{d.specialization?.name}}</option></select></label>
 <label class="text-sm">Sene<input v-model="form.appointment_date" type="date" required :min="new Date().toISOString().slice(0,10)" class="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-950"/></label>
 <label class="text-sm">Boş wagt<select v-model="form.start_time" required class="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-950"><option value="">Wagt saýlaň</option><option v-for="s in slots" :key="s.start_time" :value="s.start_time">{{s.start_time}} – {{s.end_time}}</option></select></label>
 <label class="text-sm">Näsagyň telefon belgisi<input v-model="form.patient_phone" required class="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-950"/></label>
 <label class="text-sm sm:col-span-2">Sebäp<input v-model="form.reason" class="mt-1 w-full rounded-xl border p-2.5 dark:bg-slate-950"/></label>
 <div class="flex items-end"><button :disabled="saving" class="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{{saving?'Ýüklenýär...':'Kabul ýazgysyny döret'}}</button></div>
 </form><p v-if="selectedDoctor" class="mt-3 text-xs text-slate-500">{{selectedDoctor.user?.name}} lukmanyň boş wagtlary saýlanan klinika we senä görä barlanýar.</p></div>
 <div class="overflow-x-auto rounded-3xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/80"><h2 class="mb-4 text-xl font-bold">Kabul sanawy</h2><p v-if="loading" class="p-6 text-center">Ýüklenýär...</p><table v-else class="w-full text-left text-sm"><thead><tr class="border-b text-slate-500"><th class="p-3">Näsag</th><th class="p-3">Lukman</th><th class="p-3">Klinika</th><th class="p-3">Sene / Wagt</th><th class="p-3">Ýagdaý</th></tr></thead><tbody><tr v-for="a in rows" :key="a.id" class="border-b dark:border-slate-800"><td class="p-3">{{a.patient?.name}}<div class="text-xs text-slate-500">{{a.patient?.phone}}</div></td><td class="p-3">{{a.doctor?.user?.name}}</td><td class="p-3">{{a.clinic?.name}}</td><td class="p-3">{{String(a.appointment_date).slice(0,10)}} · {{a.start_time}}</td><td class="p-3">{{a.status}}</td></tr></tbody></table><p v-if="!loading&&!rows.length" class="p-6 text-center text-slate-500">Kabul ýazgysy ýok.</p></div>
</section></template>
