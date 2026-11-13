<script setup>
defineProps({
    specializations: { type: Array, default: () => [] },
    clinics: { type: Array, default: () => [] }
})

const searchQuery = defineModel('searchQuery', { type: String, default: '' })
const selectedSpecialization = defineModel('selectedSpecialization', { type: String, default: '' })
const selectedClinic = defineModel('selectedClinic', { type: String, default: '' })
</script>

<template>
    <div
        class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-xl">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Lukmanlar we Klinikalar</h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Özüňize iň ýakyn klinikany we hünärmeni saýlap, boş wagtyňyza göni onlaýn bron ediň.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="relative">
                <input v-model="searchQuery" type="text" placeholder="Lukmanyň ady ýa-da hünäri..."
                    class="w-full px-4 py-3 pl-11 rounded-2xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" />
                <span class="absolute left-4 top-3.5 text-slate-400">🔍</span>
            </div>

            <select v-model="selectedSpecialization"
                class="w-full px-4 py-3 rounded-2xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm">
                <option value="">Ähli hünär ugurlary</option>
                <option v-for="spec in specializations" :key="spec.id" :value="spec.name">{{ spec.name }}</option>
            </select>

            <select v-model="selectedClinic"
                class="w-full px-4 py-3 rounded-2xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm">
                <option value="">Ähli klinikalar</option>
                <option v-for="clinic in clinics" :key="clinic.id" :value="clinic.name">{{ clinic.name }}</option>
            </select>
        </div>
    </div>
</template>