<script setup lang="ts">
const specialtyItems = [
  { id: 7, title: 'Menu 7', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe7.png' },
  { id: 8, title: 'Menu 8', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe8.png' },
  { id: 9, title: 'Menu 9', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe9.png' },
  { id: 10, title: 'Menu 10', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe10.png' },
  { id: 11, title: 'Menu 11', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe11.png' },
  { id: 12, title: 'Menu 12', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/paresko.png' }
]
</script>

<template>
  <section
    id="others"
    class="min-h-screen w-full bg-[#2b1e1a] py-16 px-6 md:px-12 flex flex-col items-center justify-center gap-10"
  >
    <div class="text-center space-y-2">
      <h3 class="text-lg md:text-xl font-medium text-stone-300">Others</h3>
      <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-white">
        Today's Speciality
      </h1>
    </div>

    <!-- Grid of specialty cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl justify-items-center">
      <MenuCard
        v-for="item in specialtyItems"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :price="item.price"
        :image="item.image"
      />
    </div>
  </section>
</template>
