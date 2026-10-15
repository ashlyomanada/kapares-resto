<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  price: number
  image: string
}>()

const { addToCart } = useCart()

const handleAdd = () => {
  addToCart({
    name: props.title,
    price: props.price,
    image: props.image
  })
}
</script>

<template>
  <div
    class="bg-[#1b1514] rounded-2xl flex flex-col items-center justify-between overflow-hidden shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] transition-all duration-300 hover:scale-[1.02] p-3 text-white w-full max-w-[340px]"
  >
    <div class="w-full h-44 overflow-hidden rounded-xl">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>

    <div class="w-full flex items-center justify-between mt-3 px-1 gap-2">
      <div class="flex flex-col gap-1 text-left flex-1 min-w-0">
        <h3 class="font-semibold text-base truncate">{{ title }}</h3>
        <p class="text-xs text-stone-300 truncate">{{ description }}</p>
        <h4 class="text-sm font-medium text-stone-200">Price: Php {{ price.toFixed(2) }}</h4>
      </div>

      <UButton
        color="primary"
        variant="solid"
        size="sm"
        class="bg-[#c46e3e] hover:bg-[#1b1514] hover:shadow-[5px_4px_10px_4px_rgba(0,0,0,0.94)] text-white text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap"
        @click="handleAdd"
      >
        Add to Cart
      </UButton>
    </div>
  </div>
</template>
