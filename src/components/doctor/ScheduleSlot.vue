<template>
    <div @click="handleClick" :class="[
        'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer',
        isSelected
            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
            : slot.isBooked
                ? 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200'
    ]">
        <!-- Time Range -->
        <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-semibold">
                {{ slot.startTime }} - {{ slot.endTime }}
            </span>
        </div>

        <!-- Status Badge -->
        <div>
            <span v-if="slot.isBooked"
                class="text-xs px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-medium">
                Bron edilen
            </span>
            <span v-else-if="isSelected" class="text-xs px-2.5 py-1 rounded-lg bg-white/20 text-white font-medium">
                Saýlanan
            </span>
            <span v-else
                class="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium">
                Boş
            </span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    slot: {
        type: Object,
        required: true,
        // mysal üçin: { id: 1, startTime: '09:00', endTime: '09:30', isBooked: false }
    },
    isSelected: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['select'])

const handleClick = () => {
    if (!props.slot.isBooked) {
        emit('select', props.slot)
    }
}
</script>