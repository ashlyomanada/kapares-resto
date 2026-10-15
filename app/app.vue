<script setup lang="ts">
useHead({
  title: 'Kapares Resto',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'description', content: 'Best Beef Pares in the country - Kapares Resto' }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600&family=Roboto:wght@100;300&display=swap'
    }
  ]
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
