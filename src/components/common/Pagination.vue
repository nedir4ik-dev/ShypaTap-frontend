<template>
    <div class="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6">
        <div class="flex justify-between flex-1 sm:hidden">
            <button @click="$emit('page-change', modelValue - 1)" :disabled="modelValue === 1"
                class="px-4 py-2 text-sm font-medium border rounded-xl disabled:opacity-50">
                Öňki
            </button>
            <button @click="$emit('page-change', modelValue + 1)" :disabled="modelValue === totalPages"
                class="px-4 py-2 text-sm font-medium border rounded-xl disabled:opacity-50">
                Indiki
            </button>
        </div>

        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-slate-700 dark:text-slate-400">
                    Jemi <span class="font-medium">{{ totalPages }}</span> sahypadan <span class="font-medium">{{
                        modelValue }}</span>-nji sahypa.
                </p>
            </div>
            <div>
                <nav class="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
                    <button @click="$emit('page-change', modelValue - 1)" :disabled="modelValue === 1"
                        class="px-3 py-2 text-sm font-medium rounded-l-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                        Öňki
                    </button>
                    <button v-for="page in totalPages" :key="page" @click="$emit('page-change', page)" :class="[
                        'px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700',
                        page === modelValue
                            ? 'bg-blue-600 text-white border-blue-600 z-10'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    ]">
                        {{ page }}
                    </button>
                    <button @click="$emit('page-change', modelValue + 1)" :disabled="modelValue === totalPages"
                        class="px-3 py-2 text-sm font-medium rounded-r-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                        Indiki
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: { type: Number, required: true }, // Aktiw sahypa (v-model üçin)
    totalPages: { type: Number, required: true }  // Jemi sahypa sany
})

defineEmits(['page-change'])
</script>