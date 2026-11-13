<template>
    <section class="mx-auto max-w-7xl px-4 py-10">
        <h1 class="mb-2 text-3xl font-bold">Näsag paneli</h1>
        <p class="mb-8 text-slate-500">Şahsy kabul ýazgylaryňyza we lukman gözlegine geçiň.</p>
        <div class="grid gap-5 md:grid-cols-3"><router-link to="/doctors" class="glass-card p-6">
                <h2 class="text-xl font-semibold text-emerald-700">Lukman gözlemek</h2>
                <p class="mt-2 text-sm text-slate-500">Hünär we klinika boýunça lukman saýlaň.</p>
            </router-link>
            <router-link to="/patient/appointments" class="glass-card p-6">
                <h2 class="text-xl font-semibold text-emerald-700">Kabul ýazgylarym</h2>
                <p class="mt-2 text-sm text-slate-500">Geljekki we öňki kabul ýazgylaryňyzy görüň.</p>
            </router-link>
            <div class="glass-card p-6">
                <h2 class="text-xl font-semibold text-emerald-700">Bildirişler</h2>
                <p class="mt-2 text-sm text-slate-500">Kabul ýagdaýy üýtgände habar alyň.</p>
            </div>
        </div>
    </section>
</template>
