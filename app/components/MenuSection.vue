<script setup lang="ts">
const menuItems = [
  { id: 1, title: 'Menu 1', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe1.png' },
  { id: 2, title: 'Menu 2', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe2.png' },
  { id: 3, title: 'Menu 3', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe3.png' },
  { id: 4, title: 'Menu 4', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe4.png' },
  { id: 5, title: 'Menu 5', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe5.png' },
  { id: 6, title: 'Menu 6', description: 'Lorem ipsum dolor sit amet.', price: 50.0, image: '/pares_png/recipe6.png' }
]
</script>

<template>
  <section
    id="menu"
    class="min-h-screen w-full bg-[#2b1e1a] py-16 px-6 md:px-12 flex flex-col items-center justify-center gap-10"
  >
    <div class="text-center space-y-2">
      <h3 class="text-lg md:text-xl font-medium text-stone-300">Our Menu</h3>
      <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-white">
        Popular Beef Pares
      </h1>
    </div>

    <!-- Grid of menu cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl justify-items-center">
      <MenuCard
        v-for="item in menuItems"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :price="item.price"
        :image="item.image"
      />
    </div>
  </section>
</template>
