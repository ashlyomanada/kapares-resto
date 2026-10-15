<script setup lang="ts">
const isAboutModalOpen = ref(false)
</script>

<template>
  <section
    id="about"
    class="min-h-screen w-full bg-[#2d1f1a] py-16 px-6 md:px-12 flex flex-col items-center justify-center gap-10"
  >
    <div class="text-center space-y-2">
      <h3 class="text-lg md:text-xl font-medium text-stone-300">About us</h3>
      <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase">
        Why Choose Us?
      </h1>
    </div>

    <div class="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14">
      <!-- Image Container -->
      <div class="w-full md:w-1/2 flex justify-center">
        <div class="w-full max-w-md h-72 md:h-80 rounded-2xl overflow-hidden shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] border-2 border-stone-800">
          <img
            src="/pares_png/paresko.png"
            alt="Paresko beef pares"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Description Container -->
      <div class="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left">
        <div class="space-y-3">
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            Best Beef Pares In The Country
          </h2>
          <p class="text-sm md:text-base text-stone-300 leading-relaxed">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem quo nobis, aperiam voluptate similique ut ipsum.
          </p>
        </div>

        <!-- Badges / Labels -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-[#1b1514] text-xs md:text-sm font-medium py-3 px-2 rounded-2xl shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] flex items-center justify-center text-center">
            Free Delivery
          </div>
          <div class="bg-[#1b1514] text-xs md:text-sm font-medium py-3 px-2 rounded-2xl shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] flex items-center justify-center text-center">
            Easy Payments
          </div>
          <div class="bg-[#1b1514] text-xs md:text-sm font-medium py-3 px-2 rounded-2xl shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] flex items-center justify-center text-center">
            24/7 Service
          </div>
        </div>

        <!-- Learn More Button -->
        <div class="pt-2 flex justify-center md:justify-start">
          <UButton
            color="primary"
            class="bg-[#c46e3e] hover:bg-[#1b1514] text-white font-semibold px-6 py-2.5 rounded-2xl border-2 border-white shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] cursor-pointer transition-all"
            @click="isAboutModalOpen = true"
          >
            Learn More
          </UButton>
        </div>
      </div>
    </div>

    <!-- Learn More Modal -->
    <UModal v-model:open="isAboutModalOpen" title="About Kapares Resto">
      <template #content>
        <div class="p-6 bg-[#1b1514] text-white rounded-xl space-y-4">
          <h3 class="text-xl font-bold text-[#c46e3e]">About Kapares Resto</h3>
          <p class="text-sm text-stone-300 leading-relaxed">
            Founded with passion for authentic Filipino comfort food, Kapares Resto brings you tender slow-cooked beef pares simmered with star anise, garlic, and rich aromatics. Paired with garlic fried rice and piping-hot soup.
          </p>
          <div class="flex justify-end pt-2">
            <UButton color="neutral" variant="ghost" @click="isAboutModalOpen = false">Close</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </section>
</template>
