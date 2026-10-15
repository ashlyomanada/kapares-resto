<script setup lang="ts">
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const isNotifOpen = ref(false)
const searchQuery = ref('')

const { items, isCartOpen, removeFromCart, totalCount, totalPrice } = useCart()

const navLinks = [
  { label: 'HOME', to: '#home' },
  { label: 'MENU', to: '#menu' },
  { label: 'ABOUT', to: '#about' },
  { label: 'OTHERS', to: '#others' },
  { label: 'REVIEW', to: '#review' },
  { label: 'ORDER', to: '#order' }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#2d1f1a] text-white flex flex-col font-['Poppins']">
    <!-- Navbar -->
    <header class="fixed top-0 left-0 right-0 h-16 bg-[#1b1514] z-50 shadow-[0px_22px_18px_-16px_rgba(0,0,0,0.1)] flex items-center justify-between px-6 md:px-12 max-w-[1350px] mx-auto w-full">
      <!-- Logo -->
      <NuxtLink to="#home" class="text-xl md:text-2xl font-bold tracking-wider hover:text-[#c46e3e] transition-colors">
        KAPARES
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8 list-none">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="text-sm font-medium tracking-wide text-white hover:text-[#c46e3e] transition-colors"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Right Buttons (Search, Notif, Cart) -->
      <div class="hidden md:flex items-center gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-full p-2 hover:opacity-75 transition-opacity"
          aria-label="Search"
          @click="isSearchOpen = true"
        >
          <img src="/pares_png/search.png" alt="Search" class="w-5 h-5 object-contain" />
        </UButton>

        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-full p-2 hover:opacity-75 transition-opacity"
          aria-label="Notifications"
          @click="isNotifOpen = true"
        >
          <img src="/pares_png/notification.png" alt="Notification" class="w-5 h-5 object-contain" />
        </UButton>

        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          class="rounded-full p-2 hover:opacity-75 transition-opacity relative"
          aria-label="Cart"
          @click="isCartOpen = true"
        >
          <img src="/pares_png/shopping-cart.png" alt="Cart" class="w-5 h-5 object-contain" />
          <span
            v-if="totalCount > 0"
            class="absolute -top-1 -right-1 bg-[#c46e3e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ totalCount }}
          </span>
        </UButton>
      </div>

      <!-- Mobile Hamburger Button -->
      <button
        class="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 focus:outline-none cursor-pointer"
        aria-label="Toggle Menu"
        @click="toggleMobileMenu"
      >
        <span class="w-6 h-0.5 bg-white transition-all"></span>
        <span class="w-6 h-0.5 bg-white transition-all"></span>
        <span class="w-6 h-0.5 bg-white transition-all"></span>
      </button>

      <!-- Mobile Navigation Drawer -->
      <div
        v-if="isMobileMenuOpen"
        class="absolute top-16 left-0 w-full bg-[#1b1514] flex flex-col items-center py-6 gap-5 shadow-2xl md:hidden"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="text-base font-medium tracking-wide hover:text-[#c46e3e] transition-colors"
          @click="closeMobileMenu"
        >
          {{ link.label }}
        </NuxtLink>

        <div class="flex items-center gap-6 pt-3 border-t border-stone-800 w-3/4 justify-center">
          <UButton
            color="neutral"
            variant="ghost"
            class="rounded-full p-2"
            @click="isSearchOpen = true; closeMobileMenu()"
          >
            <img src="/pares_png/search.png" alt="Search" class="w-5 h-5" />
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            class="rounded-full p-2"
            @click="isNotifOpen = true; closeMobileMenu()"
          >
            <img src="/pares_png/notification.png" alt="Notifications" class="w-5 h-5" />
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            class="rounded-full p-2 relative"
            @click="isCartOpen = true; closeMobileMenu()"
          >
            <img src="/pares_png/shopping-cart.png" alt="Cart" class="w-5 h-5" />
            <span
              v-if="totalCount > 0"
              class="absolute -top-1 -right-1 bg-[#c46e3e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ totalCount }}
            </span>
          </UButton>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1 pt-16 max-w-[1350px] mx-auto w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-[#1b1514] py-12 px-6 md:px-16 w-full max-w-[1350px] mx-auto border-t border-stone-900">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
        <!-- Location -->
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold text-white mb-2">Location</h3>
          <p><NuxtLink to="#home" class="text-sm text-stone-300 hover:text-[#c46e3e]">Calapan City</NuxtLink></p>
          <p><NuxtLink to="#home" class="text-sm text-stone-300 hover:text-[#c46e3e]">Naujan</NuxtLink></p>
          <p><NuxtLink to="#home" class="text-sm text-stone-300 hover:text-[#c46e3e]">Pinamalayan</NuxtLink></p>
          <p><NuxtLink to="#home" class="text-sm text-stone-300 hover:text-[#c46e3e]">Roxas</NuxtLink></p>
        </div>

        <!-- Contact Info -->
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold text-white mb-2">Contact Info</h3>
          <p><a href="tel:+639507335078" class="text-sm text-stone-300 hover:text-[#c46e3e]">+639507335078</a></p>
          <p><a href="mailto:ashlyomanada@gmail.com" class="text-sm text-stone-300 hover:text-[#c46e3e]">ashlyomanada@gmail.com</a></p>
        </div>

        <!-- Follow Us -->
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold text-white mb-2">Follow Us</h3>
          <p><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-300 hover:text-[#c46e3e]">Facebook</a></p>
          <p><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-300 hover:text-[#c46e3e]">Twitter</a></p>
          <p><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-300 hover:text-[#c46e3e]">Instagram</a></p>
          <p><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-300 hover:text-[#c46e3e]">YouTube</a></p>
        </div>
      </div>

      <div class="text-center pt-6 border-t border-stone-800">
        <h3 class="text-xs text-stone-400">Copyright &copy; 2023 By Mr. Ashly Omañada</h3>
      </div>
    </footer>

    <!-- Search Modal -->
    <UModal v-model:open="isSearchOpen" title="Search Menu">
      <template #content>
        <div class="p-4 space-y-4 bg-[#1b1514] text-white rounded-xl">
          <h3 class="text-lg font-semibold">Search Menu</h3>
          <UInput
            v-model="searchQuery"
            placeholder="Search beef pares, recipes..."
            class="w-full"
            autofocus
          />
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="isSearchOpen = false">Close</UButton>
            <UButton color="primary" class="bg-[#c46e3e] text-white" @click="isSearchOpen = false">Search</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Notification Modal -->
    <UModal v-model:open="isNotifOpen" title="Notifications">
      <template #content>
        <div class="p-4 space-y-4 bg-[#1b1514] text-white rounded-xl">
          <h3 class="text-lg font-semibold">Notifications</h3>
          <div class="space-y-2 text-sm text-stone-300">
            <div class="p-3 bg-stone-900 rounded-lg border border-stone-800">
              <p class="font-medium text-white">🎉 Special Promo Today!</p>
              <p class="text-xs text-stone-400">Order any Beef Pares and get free soup refills.</p>
            </div>
            <div class="p-3 bg-stone-900 rounded-lg border border-stone-800">
              <p class="font-medium text-white">🛵 Fast Delivery Available</p>
              <p class="text-xs text-stone-400">Free delivery on orders within Calapan City.</p>
            </div>
          </div>
          <div class="flex justify-end">
            <UButton color="neutral" variant="ghost" @click="isNotifOpen = false">Close</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Cart Modal -->
    <UModal v-model:open="isCartOpen" title="Your Cart">
      <template #content>
        <div class="p-4 space-y-4 bg-[#1b1514] text-white rounded-xl">
          <h3 class="text-lg font-semibold">Your Cart</h3>

          <div v-if="items.length === 0" class="py-8 text-center text-stone-400 text-sm">
            Your cart is currently empty.
          </div>

          <div v-else class="space-y-3 max-h-60 overflow-y-auto">
            <div
              v-for="item in items"
              :key="item.id"
              class="flex items-center justify-between gap-3 p-2 bg-stone-900 rounded-lg border border-stone-800"
            >
              <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded object-cover" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ item.name }}</p>
                <p class="text-xs text-stone-400">Qty: {{ item.quantity }} × Php {{ item.price.toFixed(2) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-semibold text-white">Php {{ (item.price * item.quantity).toFixed(2) }}</p>
                <button
                  class="text-[11px] text-red-400 hover:underline cursor-pointer"
                  @click="removeFromCart(item.name)"
                >
                  Remove
                </button>
              </div>
            </div>

            <div class="pt-3 border-t border-stone-800 flex justify-between font-semibold text-base">
              <span>Total:</span>
              <span class="text-[#c46e3e]">Php {{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex justify-between gap-2 pt-2">
            <UButton color="neutral" variant="ghost" @click="isCartOpen = false">Close</UButton>
            <NuxtLink
              to="#order"
              class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#c46e3e] text-white text-sm font-semibold hover:bg-stone-800 transition-colors"
              @click="isCartOpen = false"
            >
              Proceed to Order
            </NuxtLink>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
