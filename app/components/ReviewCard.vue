<script setup lang="ts">
defineProps<{
  quote: string
  avatar: string
}>()
</script>

<template>
  <div
    class="bg-[#1b1514] rounded-2xl flex flex-col items-center justify-between p-6 shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] transition-transform duration-500 hover:-translate-y-6 w-full max-w-[340px] min-h-[260px] text-center"
  >
    <div class="flex flex-col items-center justify-center gap-3 flex-1">
      <img src="/pares_png/quoteicon.png" alt="quote" class="h-8 w-auto opacity-80" />
      <p class="text-xs text-stone-200 leading-relaxed">
        {{ quote }}
      </p>
    </div>
    <div class="mt-4 flex items-center justify-center">
      <img
        :src="avatar"
        alt="Customer"
        class="w-12 h-12 rounded-full object-cover border border-stone-600 shadow"
      />
    </div>
  </div>
</template>
