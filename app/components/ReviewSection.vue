<script setup lang="ts">
const reviews = [
  {
    id: 1,
    quote: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam dolorum mollitia exercitationem atque, eius architecto!',
    avatar: '/pares_png/customer.jpg'
  },
  {
    id: 2,
    quote: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti velit harum impedit temporibus commodi unde.',
    avatar: '/pares_png/customer.jpg'
  },
  {
    id: 3,
    quote: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas minus similique repellat, voluptatem a ex.',
    avatar: '/pares_png/customer.jpg'
  }
]
</script>

<template>
  <section
    id="review"
    class="min-h-screen w-full bg-[#2d1f1a] py-16 px-6 md:px-12 flex flex-col items-center justify-center gap-10"
  >
    <div class="text-center space-y-2">
      <h3 class="text-lg md:text-xl font-medium text-stone-300">Customer's Review</h3>
      <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-white">
        What They Say
      </h1>
    </div>

    <!-- Review cards grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl justify-items-center">
      <ReviewCard
        v-for="review in reviews"
        :key="review.id"
        :quote="review.quote"
        :avatar="review.avatar"
      />
    </div>
  </section>
</template>
