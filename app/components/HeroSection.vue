<script setup lang="ts">
</script>

<template>
  <section
    id="home"
    class="min-h-[calc(100vh-4rem)] w-full bg-[#2d1f1a] flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12"
  >
    <!-- Text Content -->
    <div class="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left order-2 md:order-1 pt-6 md:pt-0">
      <div class="max-w-md space-y-3">
        <h3 class="text-xl md:text-2xl font-medium text-stone-200">Our Special Pares</h3>
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          BEEF PARES
        </h1>
        <p class="text-sm md:text-base text-stone-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, saepe.
        </p>
        <div class="pt-4">
          <NuxtLink to="#order">
            <UButton
              color="primary"
              size="lg"
              class="bg-[#c46e3e] hover:bg-[#1b1514] text-white font-bold px-8 py-3 rounded-2xl border-2 border-white shadow-lg hover:shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] transition-all cursor-pointer inline-flex items-center"
            >
              ORDER NOW
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Hero Image -->
    <div class="w-full md:w-1/2 flex items-center justify-center order-1 md:order-2">
      <div class="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] border-4 border-stone-800">
        <img
          src="/pares_png/picture1.png"
          alt="Beef Pares Special"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
</template>
